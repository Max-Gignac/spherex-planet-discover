import io
import base64
import requests
import urllib3
import numpy as np
from PIL import Image
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from astroquery.ipac.irsa import Irsa
from astropy.coordinates import SkyCoord
from astropy.io import fits
from astropy.visualization import ZScaleInterval
import astropy.units as u

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="SPHEREx Discovery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

HEADERS = {"User-Agent": "Mozilla/5.0 (SPHEREx-Hackathon-Client)"}


def array_to_base64_png(data: np.ndarray) -> str:
    data = np.nan_to_num(data, nan=0.0)
    interval = ZScaleInterval()
    vmin, vmax = interval.get_limits(data)
    scaled = np.clip((data - vmin) / (vmax - vmin + 1e-8), 0, 1) * 255
    img = Image.fromarray(scaled.astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM)
    img = img.resize((256, 256), Image.Resampling.BILINEAR)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"


def find_poi_256(diff_array: np.ndarray) -> dict:
    """Finds the brightest anomaly (Point of Interest) mapped onto a 256x256 flipped display grid."""
    h, w = diff_array.shape
    # Ignore 6px border artifacts from detector edges
    border = max(2, min(h, w) // 20)
    core = np.abs(diff_array.copy())
    core[:border, :] = 0
    core[-border:, :] = 0
    core[:, :border] = 0
    core[:, -border:] = 0

    y_idx, x_idx = np.unravel_index(np.argmax(core), core.shape)
    # Match FLIP_TOP_BOTTOM used in array_to_base64_png and scale to 256x256
    flipped_y = (h - 1) - y_idx
    x_256 = int(round((x_idx / max(w - 1, 1)) * 255))
    y_256 = int(round((flipped_y / max(h - 1, 1)) * 255))
    return {"x": x_256, "y": y_256}


def fetch_fits_array(access_url: str, ra: float, dec: float, size: float) -> np.ndarray:
    cutout_url = f"{access_url}?center={ra},{dec}&size={size}"
    resp = requests.get(cutout_url, headers=HEADERS, timeout=15, verify=False)
    resp.raise_for_status()
    with fits.open(io.BytesIO(resp.content)) as hdul:
        data = hdul[1].data if len(hdul) > 1 and hdul[1].data is not None else hdul[0].data
        return np.nan_to_num(data.astype(np.float32), nan=0.0)


def generate_simulated_blink(ra: float, dec: float):
    rng = np.random.default_rng(int(abs(ra * 1000 + dec * 1000)))
    base = rng.normal(25, 5, (256, 256)).astype(np.float32)
    for _ in range(30):
        x, y = rng.integers(15, 240, size=2)
        base[y - 2 : y + 3, x - 2 : x + 3] += float(rng.integers(120, 220))

    ep1 = base.copy()
    ep2 = base.copy()
    ep1[120:126, 115:121] += 230.0
    ep2[128:134, 129:135] += 230.0
    diff = ep2 - ep1
    poi = find_poi_256(diff)
    return array_to_base64_png(ep1), array_to_base64_png(ep2), array_to_base64_png(diff), poi


@app.get("/")
def health_check():
    return {"status": "SPHEREx Backend is running!"}


@app.get("/api/blink")
def get_multi_epoch_blink(ra: float = 269.4521, dec: float = 4.6934, size: float = 0.05):
    coord = SkyCoord(ra=ra * u.deg, dec=dec * u.deg, frame="icrs")

    for col in ["spherex_dr1", "spherex_qr3"]:
        try:
            results = Irsa.query_sia(pos=(coord, size * u.deg), collection=col)
            if len(results) >= 2:
                if "t_min" in results.colnames:
                    results.sort("t_min")

                row1 = results[0]
                row2 = results[-1]

                arr1 = fetch_fits_array(row1["access_url"], ra, dec, size)
                arr2 = fetch_fits_array(row2["access_url"], ra, dec, size)

                if arr1.shape != arr2.shape:
                    pil2 = Image.fromarray(arr2).resize((arr1.shape[1], arr1.shape[0]), Image.Resampling.BILINEAR)
                    arr2 = np.array(pil2, dtype=np.float32)

                arr1_norm = arr1 - np.median(arr1)
                arr2_norm = arr2 - np.median(arr2)
                diff = arr2_norm - arr1_norm
                poi = find_poi_256(diff)

                return {
                    "ra": ra,
                    "dec": dec,
                    "source": f"IRSA SIA2 ({col})",
                    "total_observations": len(results),
                    "epoch1_mjd": round(float(row1["t_min"]), 2) if "t_min" in row1.colnames else "Earliest",
                    "epoch2_mjd": round(float(row2["t_min"]), 2) if "t_min" in row2.colnames else "Latest",
                    "poi": poi,
                    "epoch1_base64": array_to_base64_png(arr1),
                    "epoch2_base64": array_to_base64_png(arr2),
                    "diff_base64": array_to_base64_png(diff),
                }
        except Exception as e:
            print(f"IRSA {col} multi-epoch query failed: {e}")
            continue

    ep1_b64, ep2_b64, diff_b64, poi = generate_simulated_blink(ra, dec)
    return {
        "ra": ra,
        "dec": dec,
        "source": "Simulated Multi-Epoch Fallback (IRSA Proxy Busy)",
        "total_observations": 2,
        "epoch1_mjd": "Epoch 1 (Baseline)",
        "epoch2_mjd": "Epoch 2 (+6 Months)",
        "poi": poi,
        "epoch1_base64": ep1_b64,
        "epoch2_base64": ep2_b64,
        "diff_base64": diff_b64,
    }