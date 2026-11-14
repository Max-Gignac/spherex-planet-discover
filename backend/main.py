import io
import base64
import requests
import numpy as np
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from astroquery.ipac.irsa import Irsa
from astropy.coordinates import SkyCoord
from astropy.io import fits
from astropy.visualization import ZScaleInterval
import astropy.units as u

app = FastAPI(title="SPHEREx Discovery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def fits_bytes_to_base64_png(fits_bytes: bytes) -> str:
    with fits.open(io.BytesIO(fits_bytes)) as hdul:
        data = hdul[1].data if len(hdul) > 1 and hdul[1].data is not None else hdul[0].data
        data = np.nan_to_num(data, nan=0.0)

    interval = ZScaleInterval()
    vmin, vmax = interval.get_limits(data)
    scaled = np.clip((data - vmin) / (vmax - vmin + 1e-8), 0, 1) * 255
    img = Image.fromarray(scaled.astype(np.uint8)).transpose(Image.FLIP_TOP_BOTTOM)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    img_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_b64}"


@app.get("/")
def health_check():
    return {"status": "SPHEREx Backend is running!"}


@app.get("/api/cutout")
def get_spherex_cutout(ra: float = 133.7951, dec: float = -7.2451, size: float = 0.05):
    """
    Default coordinates point to WISE 0855 (fast-moving brown dwarf benchmark).
    Tries IRSA SIA2 first; falls back to HiPS2FITS infrared FITS cutouts if IRSA's proxy returns 502.
    """
    coord = SkyCoord(ra=ra * u.deg, dec=dec * u.deg, frame="icrs")

    # 1. Primary: Try IRSA SIA2 (SPHEREx DR1 / QR3)
    for col in ["spherex_dr1", "spherex_qr3"]:
        try:
            results = Irsa.query_sia(pos=(coord, size * u.deg), collection=col)
            if len(results) > 0:
                row = results[0]
                cutout_url = f"{row['access_url']}?center={ra},{dec}&size={size}"
                resp = requests.get(cutout_url, timeout=20)
                resp.raise_for_status()
                return {
                    "ra": ra,
                    "dec": dec,
                    "source": f"IRSA SIA2 ({col})",
                    "total_observations_found": len(results),
                    "obs_date_mjd": float(row["t_min"]) if "t_min" in row.colnames else None,
                    "image_base64": fits_bytes_to_base64_png(resp.content),
                }
        except Exception:
            continue

    # 2. Fallback: Fetch real infrared FITS cutout via CDS/IRSA HiPS2FITS when IRSA SIA2 has a 502 Proxy Error
    try:
        hips_url = (
            "https://alasky.cds.unistra.fr/hips-image-services/hips2fits"
            f"?hips=CDS%2FP%2FallWISE%2FW1&width=256&height=256&fov={size}"
            f"&projection=TAN&coordsys=icrs&ra={ra}&dec={dec}&format=fits"
        )
        resp = requests.get(hips_url, timeout=25)
        resp.raise_for_status()
        return {
            "ra": ra,
            "dec": dec,
            "source": "HiPS2FITS Infrared Fallback (IRSA SIA2 Proxy 502)",
            "total_observations_found": 1,
            "obs_date_mjd": None,
            "image_base64": fits_bytes_to_base64_png(resp.content),
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Both primary and fallback cutout services failed: {e}")