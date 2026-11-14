import { useState, useEffect, useRef } from "react";
import "./styles.css";

const BENCHMARK_TARGETS = [
  {
    name: "Barnard's Star",
    tag: "Speedy Star",
    hint: "One of the fastest-moving stars in our night sky! Watch it hop between photos.",
    ra: 269.4521,
    dec: 4.6934,
  },
  {
    name: "WISE 0855",
    tag: "Rogue Brown Dwarf",
    hint: "A freezing, failed star zipping close to our Solar System.",
    ra: 133.7951,
    dec: -7.2451,
  },
  {
    name: "Epsilon Indi B",
    tag: "Twin Brown Dwarfs",
    hint: "Two cool, dim objects orbiting each other in deep space.",
    ra: 331.0767,
    dec: -56.7825,
  },
  {
    name: "RW Aurigae",
    tag: "Flickering Young Star",
    hint: "A baby star surrounded by dust clouds that make it randomly dim and brighten.",
    ra: 76.9565,
    dec: 30.4014,
  },
  {
    name: "R Draconis",
    tag: "Pulsing Red Giant",
    hint: "A giant aging star that swells up and changes brightness like a heartbeat.",
    ra: 248.1633,
    dec: 66.7544,
  },
];

const RECOMMENDED_COOL_SPOTS = [
  {
    name: "Orion Nebula (M42)",
    badge: "Star Nursery",
    ra: 83.8221,
    dec: -5.3911,
    fov: 0.1,
    description:
      "A massive glowing cloud of cosmic dust where thousands of brand-new baby stars and planets are being born right now.",
  },
  {
    name: "Crab Nebula (M1)",
    badge: "Supernova Explosion",
    ra: 83.6331,
    dec: 22.0145,
    fov: 0.08,
    description:
      "The shattered, expanding wreckage of a giant star that exploded in the year 1054—powered by a spinning neutron star at its core.",
  },
  {
    name: "Andromeda Galaxy Core (M31)",
    badge: "Neighbor Galaxy",
    ra: 10.6847,
    dec: 41.2687,
    fov: 0.1,
    description:
      "The blazing heart of our nearest major neighbor galaxy, packed with millions of tightly clustered stars and a supermassive black hole.",
  },
  {
    name: "Ring Nebula (M57)",
    badge: "Dying Star Shell",
    ra: 283.3962,
    dec: 33.0292,
    fov: 0.04,
    description:
      "A cosmic smoke-ring of glowing gas blown off into space by a sun-like star at the end of its life.",
  },
];

const DISCOVER_SECTORS = [
  {
    id: "wise0855",
    sectorName: "Hydra Infrared Deep Field",
    centerRa: 133.7951,
    centerDec: -7.2451,
    summary: "Cold interstellar neighborhood monitored by SPHEREx for high-proper-motion brown dwarfs.",
    landmarks: [
      {
        id: "wise-core",
        title: "WISE 0855−0714",
        category: "Sub-Brown Dwarf",
        yawOffset: 0,
        pitchOffset: 0,
        ra: 133.7951,
        dec: -7.2451,
        description:
          "The coldest known star-like object outside our Solar System (-48°C to -13°C), sprinting across the sky at 8.1 arcseconds per year.",
      },
      {
        id: "hydra-above",
        title: "Upper Ecliptic Dust Filament",
        category: "Infrared Cirrus",
        yawOffset: 38,
        pitchOffset: 34,
        ra: 135.12,
        dec: -4.8,
        description:
          "Warm microscopic silicate grains glowing in SPHEREx mid-infrared bands above the main target plane.",
      },
      {
        id: "hydra-below",
        title: "Background Elliptical Cluster",
        category: "Distant Galaxies",
        yawOffset: -46,
        pitchOffset: -32,
        ra: 132.04,
        dec: -9.6,
        description:
          "Ancient redshifted galaxies that stay completely stationary across multi-epoch blink frames—ideal reference anchors.",
      },
      {
        id: "hydra-rear",
        title: "Main-Belt Asteroid Trail",
        category: "Solar System Mover",
        yawOffset: 155,
        pitchOffset: 12,
        ra: 138.4,
        dec: -6.1,
        description:
          "Sunlight reflected off a rocky asteroid produces a thermal infrared peak that shifts position within hours.",
      },
    ],
  },
  {
    id: "barnard",
    sectorName: "Ophiuchus High-Velocity Sector",
    centerRa: 269.4521,
    centerDec: 4.6934,
    summary: "Dense Milky Way foreground field featuring the fastest-moving star in Earth's sky.",
    landmarks: [
      {
        id: "barnard-core",
        title: "Barnard's Star",
        category: "Hyper-Velocity Red Dwarf",
        yawOffset: 0,
        pitchOffset: 0,
        ra: 269.4521,
        dec: 4.6934,
        description:
          "Only 6 light-years away! It moves the width of a full Moon every 180 years, creating an unmistakable jump between SPHEREx epochs.",
      },
      {
        id: "oph-zenith",
        title: "Ophiuchus Dark Cloud Rim",
        category: "Molecular Cloud",
        yawOffset: -28,
        pitchOffset: 42,
        ra: 268.2,
        dec: 7.4,
        description:
          "Dense cold gas that blocks visible starlight but becomes transparent to SPHEREx near-infrared detectors.",
      },
      {
        id: "oph-nadir",
        title: "Galactic Bulge Star Stream",
        category: "Old Star Population",
        yawOffset: 62,
        pitchOffset: -38,
        ra: 271.3,
        dec: 2.1,
        description:
          "Thousands of tightly packed orange and red giant stars near the Milky Way's central plane.",
      },
      {
        id: "oph-behind",
        title: "Eclipsing Binary Candidate",
        category: "Variable Star",
        yawOffset: -165,
        pitchOffset: -10,
        ra: 265.9,
        dec: 4.0,
        description:
          "Two orbiting stars that periodically dim when one passes in front of the other, leaving a bright flare residual on difference maps.",
      },
    ],
  },
  {
    id: "orion",
    sectorName: "Orion Molecular Cloud Complex (M42)",
    centerRa: 83.8221,
    centerDec: -5.3911,
    summary: "Turbulent stellar nursery bursting with newborn protostars and glowing ionized hydrogen.",
    landmarks: [
      {
        id: "orion-core",
        title: "Trapezium Protostar Cluster",
        category: "Star Nursery Core",
        yawOffset: 0,
        pitchOffset: 0,
        ra: 83.8221,
        dec: -5.3911,
        description:
          "Ultra-young massive stars carving out a glowing cavity in the Orion Nebula, illuminating protoplanetary disks.",
      },
      {
        id: "orion-above",
        title: "Running Man Reflection Nebula",
        category: "Dust Cavity",
        yawOffset: 24,
        pitchOffset: 36,
        ra: 83.85,
        dec: -4.36,
        description:
          "Interstellar dust clouds scattering blue and infrared light from neighboring hot B-type stars.",
      },
      {
        id: "orion-below",
        title: "Herbig-Haro Protostellar Jet",
        category: "Outflow Shockwave",
        yawOffset: -42,
        pitchOffset: -35,
        ra: 83.6,
        dec: -6.4,
        description:
          "Supersonic jets of gas blasted from a newborn star colliding with surrounding cloud material.",
      },
      {
        id: "orion-behind",
        title: "Horsehead Dark Nebula Edge",
        category: "Cold Pillar",
        yawOffset: 170,
        pitchOffset: 18,
        ra: 85.24,
        dec: -2.45,
        description:
          "A towering column of cold gas and dust sculpted by ultraviolet radiation from nearby stars.",
      },
    ],
  },
  {
    id: "rwaurigae",
    sectorName: "Taurus-Auriga Young Star Nursery",
    centerRa: 76.9565,
    centerDec: 30.4014,
    summary: "Active T Tauri star-forming region where dusty disks eclipse young stars unpredictably.",
    landmarks: [
      {
        id: "rwaur-core",
        title: "RW Aurigae A & B",
        category: "Flickering Young Binary",
        yawOffset: 0,
        pitchOffset: 0,
        ra: 76.9565,
        dec: 30.4014,
        description:
          "A young binary star system whose warped dust disk causes dramatic, irregular brightness dips and infrared flares.",
      },
      {
        id: "aur-above",
        title: "Taurus Filaments North",
        category: "Gas Ridge",
        yawOffset: -55,
        pitchOffset: 40,
        ra: 75.4,
        dec: 32.8,
        description:
          "Cold molecular hydrogen filaments where future Sun-like stars are slowly condensing.",
      },
      {
        id: "aur-below",
        title: "Flaming Star Nebula (IC 405)",
        category: "Emission / Reflection",
        yawOffset: 48,
        pitchOffset: -30,
        ra: 79.07,
        dec: 34.3,
        description:
          "A runaway star plowing through interstellar gas and lighting up ripples of glowing dust.",
      },
      {
        id: "aur-behind",
        title: "Outer Solar System Trans-Neptunian Zone",
        category: "Planet X Search Band",
        yawOffset: 145,
        pitchOffset: -16,
        ra: 80.1,
        dec: 28.9,
        description:
          "Close to the ecliptic plane where faint, distant icy bodies slowly drift across multi-month SPHEREx scans.",
      },
    ],
  },
];

const LOADING_STAGES = [
  { threshold: 0, label: "Aiming SPHEREx infrared telescope at coordinates..." },
  { threshold: 30, label: "Querying NASA space archive for Before & After photos..." },
  { threshold: 60, label: "Stretching faint infrared light so hidden objects pop out..." },
  { threshold: 82, label: "Subtracting background stars to highlight what moved..." },
];

/* ================= 360° Discover Explorer Page ================= */
function Discover360Page({ onInspectInViewer }) {
  const [sectorIndex, setSectorIndex] = useState(() =>
    Math.floor(Math.random() * DISCOVER_SECTORS.length)
  );
  const sector = DISCOVER_SECTORS[sectorIndex];

  // Camera orientation in degrees: yaw (-180..180), pitch (-85..85)
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [activeLandmarkId, setActiveLandmarkId] = useState(sector.landmarks[0].id);
  const [nasaCutout, setNasaCutout] = useState(null);
  const [loadingCutout, setLoadingCutout] = useState(true);

  const canvasRef = useRef(null);
  const draggingRef = useRef({ active: false, lastX: 0, lastY: 0, moved: false });
  const starsRef = useRef([]);

  // Generate 3D unit-sphere stars once so looking 360° left/right/up/down feels truly spherical
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 650; i++) {
      const theta = Math.random() * Math.PI * 2; // azimuth
      const u = Math.random() * 2 - 1; // cos(polar)
      const phi = Math.acos(u);
      pts.push({
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
        size: Math.pow(Math.random(), 2.6) * 2.1 + 0.45,
        color:
          Math.random() > 0.82
            ? "#4cc9f0"
            : Math.random() > 0.78
            ? "#ffb454"
            : "#e9eefb",
        alpha: 0.35 + Math.random() * 0.65,
      });
    }
    starsRef.current = pts;
  }, []);

  // Fetch real NASA cutout for the current random sector
  useEffect(() => {
    const controller = new AbortController();
    setLoadingCutout(true);
    setYaw(0);
    setPitch(0);
    setActiveLandmarkId(sector.landmarks[0].id);

    fetch(
      `http://127.0.0.1:8000/api/blink?ra=${sector.centerRa}&dec=${sector.centerDec}&size=0.08`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((json) => {
        setNasaCutout(json);
        setLoadingCutout(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoadingCutout(false);
      });

    return () => controller.abort();
  }, [sector]);

  // Keyboard arrow / WASD navigation for 360° look-around
  useEffect(() => {
    const onKey = (e) => {
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName)) return;
      if (e.key === "ArrowLeft" || e.key === "a") setYaw((y) => ((y - 6 + 540) % 360) - 180);
      if (e.key === "ArrowRight" || e.key === "d") setYaw((y) => ((y + 6 + 540) % 360) - 180);
      if (e.key === "ArrowUp" || e.key === "w") setPitch((p) => Math.min(82, p + 5));
      if (e.key === "ArrowDown" || e.key === "s") setPitch((p) => Math.max(-82, p - 5));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Project a 3D direction (targetYaw, targetPitch) onto the 2D viewport
  const projectPoint = (targetYawDeg, targetPitchDeg, width, height) => {
    const toRad = Math.PI / 180;
    const tYaw = targetYawDeg * toRad;
    const tPitch = targetPitchDeg * toRad;

    // World vector of target
    const wx = Math.cos(tPitch) * Math.sin(tYaw);
    const wy = Math.sin(tPitch);
    const wz = Math.cos(tPitch) * Math.cos(tYaw);

    // Rotate by -yaw around Y axis
    const cYaw = -yaw * toRad;
    const x1 = wx * Math.cos(cYaw) + wz * Math.sin(cYaw);
    const y1 = wy;
    const z1 = -wx * Math.sin(cYaw) + wz * Math.cos(cYaw);

    // Rotate by -pitch around X axis
    const cPitch = -pitch * toRad;
    const x2 = x1;
    const y2 = y1 * Math.cos(cPitch) - z1 * Math.sin(cPitch);
    const z2 = y1 * Math.sin(cPitch) + z1 * Math.cos(cPitch);

    if (z2 <= 0.12) return null; // Behind the camera

    const fovScale = Math.min(width, height) * 0.85;
    const sx = width / 2 + (x2 / z2) * fovScale;
    const sy = height / 2 - (y2 / z2) * fovScale;
    return { x: sx, y: sy, depth: z2 };
  };

  // Render 360° spherical starfield & ecliptic/galactic coordinate grid on canvas
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const rect = cv.parentElement.getBoundingClientRect();
    cv.width = rect.width;
    cv.height = rect.height;
    const ctx = cv.getContext("2d");
    const W = cv.width;
    const H = cv.height;

    ctx.clearRect(0, 0, W, H);

    // Subtle cosmic nebula backdrop shifting with camera orientation
    const grad = ctx.createRadialGradient(
      W * (0.5 - yaw / 360),
      H * (0.5 + pitch / 180),
      40,
      W * 0.5,
      H * 0.5,
      Math.max(W, H) * 0.75
    );
    grad.addColorStop(0, "rgba(18, 36, 72, 0.65)");
    grad.addColorStop(0.5, "rgba(8, 16, 34, 0.85)");
    grad.addColorStop(1, "#050912");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Draw 360° latitude & longitude celestial grid lines (above, below, all around)
    ctx.strokeStyle = "rgba(76, 201, 240, 0.11)";
    ctx.lineWidth = 1;

    for (let lat = -75; lat <= 75; lat += 25) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 6) {
        const pt = projectPoint(lon, lat, W, H);
        if (pt && pt.x >= -100 && pt.x <= W + 100 && pt.y >= -100 && pt.y <= H + 100) {
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -85; lat <= 85; lat += 6) {
        const pt = projectPoint(lon, lat, W, H);
        if (pt && pt.x >= -100 && pt.x <= W + 100 && pt.y >= -100 && pt.y <= H + 100) {
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Draw 3D sphere stars
    const toRad = Math.PI / 180;
    const cYaw = -yaw * toRad;
    const cPitch = -pitch * toRad;
    const fovScale = Math.min(W, H) * 0.85;

    for (const s of starsRef.current) {
      const x1 = s.x * Math.cos(cYaw) + s.z * Math.sin(cYaw);
      const y1 = s.y;
      const z1 = -s.x * Math.sin(cYaw) + s.z * Math.cos(cYaw);

      const x2 = x1;
      const y2 = y1 * Math.cos(cPitch) - z1 * Math.sin(cPitch);
      const z2 = y1 * Math.sin(cPitch) + z1 * Math.cos(cPitch);

      if (z2 <= 0.15) continue;
      const sx = W / 2 + (x2 / z2) * fovScale;
      const sy = H / 2 - (y2 / z2) * fovScale;
      if (sx < 0 || sx > W || sy < 0 || sy > H) continue;

      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [yaw, pitch, sector]);

  const jumpToRandomSector = () => {
    setSectorIndex((prev) => {
      if (DISCOVER_SECTORS.length <= 1) return 0;
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * DISCOVER_SECTORS.length);
      }
      return next;
    });
  };

  const handlePointerDown = (e) => {
    draggingRef.current = {
      active: true,
      lastX: e.clientX,
      lastY: e.clientY,
      moved: false,
    };
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current.active) return;
    const dx = e.clientX - draggingRef.current.lastX;
    const dy = e.clientY - draggingRef.current.lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) draggingRef.current.moved = true;
    draggingRef.current.lastX = e.clientX;
    draggingRef.current.lastY = e.clientY;

    setYaw((prev) => ((prev - dx * 0.25 + 540) % 360) - 180);
    setPitch((prev) => Math.max(-82, Math.min(82, prev + dy * 0.25)));
  };

  const handlePointerUp = () => {
    draggingRef.current.active = false;
  };

  // Compute screen coordinates for the NASA center tile and all 360° landmarks
  const viewW = typeof window !== "undefined" ? Math.min(1200, window.innerWidth - 48) : 1000;
  const viewH = 580;
  const centerProj = projectPoint(0, 0, viewW, viewH);

  return (
    <section
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "92px 24px 64px",
      }}
    >
      {/* Top Control Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.15rem",
        }}
      >
        <div>
          <span
            style={{
              display: "inline-block",
              background: "rgba(76, 201, 240, 0.15)",
              color: "var(--ir)",
              padding: "0.24rem 0.8rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "0.05em",
              marginBottom: "0.45rem",
            }}
          >
            360° SPHERICAL SKY EXPLORER
          </span>
          <h1 style={{ font: "900 clamp(1.8rem, 3.5vw, 2.6rem)/1.1 var(--head)", margin: 0 }}>
            Discover: {sector.sectorName}
          </h1>
          <p style={{ color: "#b9c7e6", marginTop: "0.35rem", maxWidth: "64ch" }}>
            {sector.summary} Drag in any direction (left, right, up, or down) to look 360° around this NASA sky patch and click glowing beacons to open info clouds.
          </p>
        </div>

        <button
          type="button"
          onClick={jumpToRandomSector}
          style={{
            padding: "0.75rem 1.35rem",
            borderRadius: "999px",
            border: "none",
            background: "var(--mover)",
            color: "#1a1000",
            fontWeight: "700",
            fontSize: "0.92rem",
            boxShadow: "0 6px 24px rgba(255, 180, 84, 0.35)",
          }}
        >
          🎲 Jump to Random NASA Sector
        </button>
      </div>

      {/* Quick Radar Pills to Snap Camera Above, Below, or Behind */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "0.9rem",
        }}
      >
        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--mute)" }}>
          Quick Look:
        </span>
        {sector.landmarks.map((lm) => {
          const isFocused = activeLandmarkId === lm.id;
          return (
            <button
              key={lm.id}
              type="button"
              onClick={() => {
                setYaw(lm.yawOffset);
                setPitch(lm.pitchOffset);
                setActiveLandmarkId(lm.id);
              }}
              style={{
                padding: "0.38rem 0.85rem",
                borderRadius: "999px",
                border: isFocused ? "1px solid var(--ir)" : "1px solid var(--line)",
                background: isFocused ? "var(--raise)" : "var(--ink)",
                color: isFocused ? "var(--ir)" : "#b9c7e6",
                fontSize: "0.8rem",
                fontWeight: "700",
              }}
            >
              {lm.pitchOffset > 20
                ? "↑ Above: "
                : lm.pitchOffset < -20
                ? "↓ Below: "
                : Math.abs(lm.yawOffset) > 110
                ? "↺ Behind: "
                : "◎ Center: "}
              {lm.title}
            </button>
          );
        })}
      </div>

      {/* Interactive 360° Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: "relative",
          width: "100%",
          height: `${viewH}px`,
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid var(--line)",
          background: "#050912",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* Spherical Starfield & Coordinate Grid Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        {/* Real NASA Cutout Anchored at the Center of the 360° Sphere (0°, 0°) */}
        {centerProj && nasaCutout?.epoch1_base64 && (
          <div
            style={{
              position: "absolute",
              left: `${centerProj.x}px`,
              top: `${centerProj.y}px`,
              transform: "translate(-50%, -50%)",
              width: "240px",
              height: "240px",
              borderRadius: "14px",
              overflow: "hidden",
              border: "2px solid rgba(76, 201, 240, 0.55)",
              boxShadow: "0 0 40px rgba(76, 201, 240, 0.25)",
              pointerEvents: "none",
              opacity: 0.9,
            }}
          >
            <img
              src={nasaCutout.epoch1_base64}
              alt={sector.sectorName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "6px",
                left: "8px",
                right: "8px",
                background: "rgba(5, 9, 18, 0.8)",
                borderRadius: "6px",
                padding: "2px 6px",
                fontSize: "0.68rem",
                fontFamily: "monospace",
                color: "var(--ir)",
                textAlign: "center",
              }}
            >
              NASA IRSA Cutout ({sector.centerRa.toFixed(2)}°, {sector.centerDec.toFixed(2)}°)
            </div>
          </div>
        )}

        {/* Highlighted Interesting Targets & Speech Clouds in 360° Space */}
        {sector.landmarks.map((lm) => {
          const pos = projectPoint(lm.yawOffset, lm.pitchOffset, viewW, viewH);
          if (!pos) return null;
          const isOpen = activeLandmarkId === lm.id;

          return (
            <div
              key={lm.id}
              style={{
                position: "absolute",
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: "translate(-50%, -50%)",
                zIndex: isOpen ? 20 : 10,
              }}
            >
              {/* Pulsing Beacon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveLandmarkId(isOpen ? null : lm.id);
                }}
                style={{
                  width: isOpen ? "24px" : "20px",
                  height: isOpen ? "24px" : "20px",
                  borderRadius: "50%",
                  border: "2px solid #ffffff",
                  background: isOpen ? "var(--mover)" : "var(--ir)",
                  boxShadow: isOpen
                    ? "0 0 0 8px rgba(255, 180, 84, 0.28), 0 0 20px var(--mover)"
                    : "0 0 0 6px rgba(76, 201, 240, 0.22), 0 0 14px var(--ir)",
                  transition: "all 0.15s ease",
                }}
                aria-label={`Inspect ${lm.title}`}
              />

              {/* Compact Label When Collapsed */}
              {!isOpen && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLandmarkId(lm.id);
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "28px",
                    transform: "translateX(-50%)",
                    background: "rgba(10, 18, 36, 0.88)",
                    border: "1px solid var(--line)",
                    borderRadius: "999px",
                    padding: "2px 10px",
                    fontSize: "0.74rem",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  {lm.title}
                </div>
              )}

              {/* Speech Cloud Popup With Target Info & Description */}
              {isOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "34px",
                    transform: "translateX(-50%)",
                    width: "290px",
                    background: "rgba(10, 18, 36, 0.96)",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid var(--mover)",
                    borderRadius: "16px",
                    padding: "0.95rem 1.05rem",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.75)",
                    textAlign: "left",
                    cursor: "default",
                  }}
                >
                  {/* Speech Cloud Pointer Triangle */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-9px",
                      left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: "16px",
                      height: "16px",
                      background: "rgba(10, 18, 36, 0.96)",
                      borderRight: "1.5px solid var(--mover)",
                      borderBottom: "1.5px solid var(--mover)",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(255, 180, 84, 0.18)",
                        color: "var(--mover)",
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        padding: "0.15rem 0.55rem",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                      }}
                    >
                      {lm.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveLandmarkId(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--mute)",
                        fontSize: "0.9rem",
                        fontWeight: "700",
                      }}
                      aria-label="Close speech cloud"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.02rem", fontFamily: "var(--head)" }}>
                    {lm.title}
                  </h3>

                  <p style={{ margin: "0 0 0.65rem 0", fontSize: "0.82rem", color: "#c4d0ea", lineHeight: "1.42" }}>
                    {lm.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "0.5rem",
                      borderTop: "1px solid var(--line)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "var(--mute)" }}>
                      RA {lm.ra.toFixed(2)}° • Dec {lm.dec.toFixed(2)}°
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onInspectInViewer({
                          name: lm.title,
                          tag: lm.category,
                          hint: lm.description,
                          ra: lm.ra,
                          dec: lm.dec,
                        })
                      }
                      style={{
                        background: "var(--ir)",
                        color: "#03121c",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.28rem 0.6rem",
                        fontSize: "0.74rem",
                        fontWeight: "700",
                      }}
                    >
                      Blink in Viewer →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom HUD Telemetry Bar (Heading, Pitch Above/Below, Loading State) */}
        <div
          style={{
            position: "absolute",
            left: "14px",
            right: "14px",
            bottom: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            background: "rgba(5, 9, 18, 0.82)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--line)",
            borderRadius: "10px",
            padding: "0.5rem 0.9rem",
            fontSize: "0.78rem",
            fontFamily: "monospace",
            color: "var(--mute)",
            pointerEvents: "none",
          }}
        >
          <span>
            Azimuth (Yaw): <strong style={{ color: "var(--text)" }}>{Math.round((yaw + 360) % 360)}°</strong> | Altitude (Pitch):{" "}
            <strong style={{ color: pitch > 10 ? "var(--ir)" : pitch < -10 ? "var(--mover)" : "var(--text)" }}>
              {pitch > 0 ? `+${Math.round(pitch)}° (Above)` : pitch < 0 ? `${Math.round(pitch)}° (Below)` : "0° (Horizon)"}
            </strong>
          </span>
          <span>
            {loadingCutout ? "Syncing NASA IRSA cutout..." : "Drag or use Arrow Keys to look 360° around"}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ================= Orbital Earth & Starfield Hero ================= */
function OrbitalHero({ selectedTarget, onOpenDiscover }) {
  const heroRef = useRef(null);
  const globeContainerRef = useRef(null);
  const starsCanvasRef = useRef(null);
  const globeInstanceRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const globeEl = globeContainerRef.current;
    const starsCv = starsCanvasRef.current;
    if (!hero || !globeEl || !starsCv || !window.Globe) return;

    const HORIZON = 0.56;
    const EARTH_W = 2.6;
    const ALT = 2.0;
    const TEX = "https://unpkg.com/three-globe/example/img/";

    const drawStars = () => {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      starsCv.width = W;
      starsCv.height = H;
      const g = starsCv.getContext("2d");
      for (let i = 0, n = Math.round((W * H) / 2400); i < n; i++) {
        const r = Math.pow(Math.random(), 3) * 1.3 + 0.25;
        g.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.75})`;
        g.beginPath();
        g.arc(Math.random() * W, Math.random() * H, r, 0, Math.PI * 2);
        g.fill();
      }
    };

    const globe = window.Globe()(globeEl)
      .globeImageUrl(TEX + "earth-night.jpg")
      .bumpImageUrl(TEX + "earth-topology.png")
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#3d8bff")
      .atmosphereAltitude(0.12)
      .pointsData([])
      .pointColor(() => "#ffb454")
      .pointAltitude(0.03)
      .pointRadius(0.55)
      .ringsData([])
      .ringColor(() => (t) => `rgba(255,180,84,${1 - t})`)
      .ringMaxRadius(6)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(900);

    globe.pointOfView({ lat: 38, lng: -85, altitude: ALT });
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;

    const layoutGlobe = () => {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const fov = (globe.camera().fov * Math.PI) / 180;
      const ratio = Math.tan(Math.asin(1 / (1 + ALT))) / Math.tan(fov / 2);
      const Hc = Math.min(9000, (EARTH_W * W) / ratio);
      globeEl.style.height = `${Hc}px`;
      globeEl.style.top = `${HORIZON * H - (Hc / 2) * (1 - ratio)}px`;
      const pr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(16e6 / (W * Hc)));
      globe.renderer().setPixelRatio(pr);
      globe.width(W).height(Hc);
      drawStars();
    };

    layoutGlobe();
    globeInstanceRef.current = globe;
    window.addEventListener("resize", layoutGlobe);
    return () => window.removeEventListener("resize", layoutGlobe);
  }, []);

  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe || !selectedTarget) return;
    const pt = [{ lat: selectedTarget.dec, lng: selectedTarget.ra - 180 }];
    globe.pointsData(pt).ringsData(pt);
    globe.controls().autoRotate = false;
    globe.pointOfView({ lat: selectedTarget.dec, lng: selectedTarget.ra - 180, altitude: 2.0 }, 1200);
  }, [selectedTarget]);

  return (
    <section id="hero" ref={heroRef}>
      <canvas id="stars" ref={starsCanvasRef} aria-hidden="true" />
      <div id="globe" ref={globeContainerRef} aria-hidden="true" />
      <div className="sun" aria-hidden="true" />
      <div className="hero-copy">
        <h1>Flare Chasers</h1>
        <p className="lede">
          Compare infrared telescope photos taken at different times. If a dot{" "}
          <strong style={{ color: "#ffb454" }}>jumps</strong> or{" "}
          <strong style={{ color: "#4cc9f0" }}>flashes</strong>, it could be a nearby brown dwarf, asteroid, or undiscovered Planet X.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", pointerEvents: "auto" }}>
          <a className="hero-cta" href="#viewer">
            Start Scanning the Sky
          </a>
          <button
            type="button"
            onClick={onOpenDiscover}
            style={{
              background: "rgba(16, 27, 51, 0.85)",
              color: "var(--text)",
              border: "1px solid var(--mover)",
              fontWeight: "700",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
            }}
          >
            Discover 360° Sky
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================= Dynamic Loading Bar ================= */
function TelescopeLoader({ targetName }) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    setProgress(8);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return 94;
        const increment = prev < 45 ? 7 : prev < 75 ? 4 : 1.5;
        return Math.min(94, prev + increment);
      });
    }, 220);

    return () => clearInterval(interval);
  }, [targetName]);

  const currentStage =
    [...LOADING_STAGES].reverse().find((s) => progress >= s.threshold) || LOADING_STAGES[0];

  return (
    <div className="panel-card" style={{ padding: "2.25rem 1.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.65rem",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--ir)",
              boxShadow: "0 0 10px var(--ir)",
            }}
          />
          <strong style={{ fontSize: "1.05rem" }}>Scanning {targetName}</strong>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.95rem",
            fontWeight: "700",
            color: "var(--ir)",
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "var(--space)",
          borderRadius: "999px",
          overflow: "hidden",
          border: "1px solid var(--line)",
          padding: "2px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #0284c7, var(--ir), var(--mover))",
            boxShadow: "0 0 14px rgba(76, 201, 240, 0.65)",
            transition: "width 0.25s ease-out",
          }}
        />
      </div>

      <p style={{ margin: "0.75rem 0 0 0", fontSize: "0.9rem", color: "var(--mute)" }}>
        {currentStage.label}
      </p>
    </div>
  );
}

/* ================= Red Arrow Overlay ================= */
function ImageWithRedArrow({ src, alt, poi, showArrow }) {
  const targetX = poi?.x ?? 128;
  const targetY = poi?.y ?? 128;

  const offsetX = targetX > 175 ? -52 : 52;
  const offsetY = targetY < 80 ? 52 : -52;
  const startX = targetX + offsetX;
  const startY = targetY + offsetY;

  const angle = Math.atan2(targetY - startY, targetX - startX);
  const tipX = targetX - Math.cos(angle) * 14;
  const tipY = targetY - Math.sin(angle) * 14;

  const markerId = `red-arrow-${alt.replace(/\s+/g, "-")}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--line)",
        background: "#000",
      }}
    >
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} />
      {showArrow && (
        <svg
          viewBox="0 0 256 256"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker
              id={markerId}
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#ef4444" />
            </marker>
          </defs>

          <circle
            cx={targetX}
            cy={targetY}
            r="11"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="3 2"
          />

          <line
            x1={startX}
            y1={startY}
            x2={tipX}
            y2={tipY}
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />
        </svg>
      )}
    </div>
  );
}

/* ================= Main App ================= */
export default function App() {
  const [activePage, setActivePage] = useState("viewer"); // "viewer" | "discover"

  const [selected, setSelected] = useState(null);
  const [showAimPanel, setShowAimPanel] = useState(false);
  const [customRa, setCustomRa] = useState(RECOMMENDED_COOL_SPOTS[0].ra);
  const [customDec, setCustomDec] = useState(RECOMMENDED_COOL_SPOTS[0].dec);
  const [fov, setFov] = useState(0.05);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isBlinking, setIsBlinking] = useState(true);
  const [blinkSpeed, setBlinkSpeed] = useState(500);
  const [activeEpoch, setActiveEpoch] = useState(1);
  const [showDifferenceArrow, setShowDifferenceArrow] = useState(false);

  useEffect(() => {
    if (!selected) return;

    const controller = new AbortController();
    setLoading(true);
    setCustomRa(selected.ra);
    setCustomDec(selected.dec);

    fetch(
      `http://127.0.0.1:8000/api/blink?ra=${selected.ra}&dec=${selected.dec}&size=${fov}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });

    return () => controller.abort();
  }, [selected, fov]);

  useEffect(() => {
    if (!isBlinking || !data) return;
    const timer = setInterval(() => {
      setActiveEpoch((prev) => (prev === 1 ? 2 : 1));
    }, blinkSpeed);
    return () => clearInterval(timer);
  }, [isBlinking, blinkSpeed, data]);

  const handleSelectBenchmark = (target) => {
    setShowAimPanel(false);
    setFov(0.05);
    setSelected(target);
  };

  const handleSelectCoolSpot = (spot) => {
    setCustomRa(spot.ra);
    setCustomDec(spot.dec);
    setFov(spot.fov);
    setSelected({
      name: spot.name,
      tag: spot.badge,
      hint: spot.description,
      ra: spot.ra,
      dec: spot.dec,
    });
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    setSelected({
      name: "Custom Space Patch",
      tag: "User Search",
      hint: `Scanning sky coordinates (${Number(customRa).toFixed(2)}°, ${Number(customDec).toFixed(2)}°). Look for dots that jump or flash!`,
      ra: Number(customRa),
      dec: Number(customDec),
    });
  };

  const handleInspectFromDiscover = (targetObj) => {
    setActivePage("viewer");
    setFov(0.05);
    setSelected(targetObj);
    setTimeout(() => {
      document.getElementById("viewer")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div>
      {/* Fixed Top Navigation */}
      <header className="top">
        <a
          className="brand"
          href="#hero"
          onClick={() => setActivePage("viewer")}
        >
          <span className="brand-dot" />
          Flare Chasers
        </a>
        <nav aria-label="Sections">
          <a
            href="#viewer"
            onClick={() => setActivePage("viewer")}
            style={{ color: activePage === "viewer" ? "var(--ir)" : undefined }}
          >
            Sky viewer
          </a>
          <a
            href="#discover"
            onClick={(e) => {
              e.preventDefault();
              setActivePage("discover");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ color: activePage === "discover" ? "var(--mover)" : undefined }}
          >
            Discover 360°
          </a>
          <a href="#how" onClick={() => setActivePage("viewer")}>
            How blinking works
          </a>
          <a href="#targets" onClick={() => setActivePage("viewer")}>
            Test targets
          </a>
          <a href="#about" onClick={() => setActivePage("viewer")}>
            About
          </a>
        </nav>
      </header>

      {activePage === "discover" ? (
        <Discover360Page onInspectInViewer={handleInspectFromDiscover} />
      ) : (
        <>
          {/* Orbital Earth Hero */}
          <OrbitalHero
            selectedTarget={selected}
            onOpenDiscover={() => {
              setActivePage("discover");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* Main Interactive Workspace */}
          <main id="viewer" className="workspace">
            {/* Step 1: Pick a Famous Space Target + Aim Telescope Square */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: "var(--mute)",
                  marginBottom: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                1. Pick a Famous Space Target
              </p>
              <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                {BENCHMARK_TARGETS.map((target) => {
                  const isSelected = !showAimPanel && selected?.name === target.name;
                  return (
                    <button
                      key={target.name}
                      onClick={() => handleSelectBenchmark(target)}
                      style={{
                        padding: "0.7rem 1.05rem",
                        borderRadius: "12px",
                        border: isSelected ? "2px solid var(--ir)" : "1px solid var(--line)",
                        background: isSelected ? "var(--raise)" : "var(--ink)",
                        color: "var(--text)",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{target.name}</div>
                      <div style={{ fontSize: "0.76rem", color: isSelected ? "var(--ir)" : "var(--mute)" }}>
                        {target.tag}
                      </div>
                    </button>
                  );
                })}

                {/* 6th Square: Opens Custom Aim Telescope Drawer */}
                <button
                  onClick={() => setShowAimPanel((prev) => !prev)}
                  style={{
                    padding: "0.7rem 1.05rem",
                    borderRadius: "12px",
                    border: showAimPanel ? "2px solid var(--mover)" : "1px dashed var(--mover)",
                    background: showAimPanel ? "rgba(255, 180, 84, 0.14)" : "var(--ink)",
                    color: "var(--text)",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--mover)" }}>
                    + Aim Telescope
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "var(--mute)" }}>
                    {showAimPanel ? "Hide Custom Aim" : "Custom & Cool Spots"}
                  </div>
                </button>
              </div>
            </div>

            {/* Collapsible Custom Telescope Aiming & Recommended Cool Spots */}
            {showAimPanel && (
              <div
                className="panel-card"
                style={{
                  padding: "1.25rem",
                  borderColor: "var(--mover)",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ marginBottom: "1.25rem" }}>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "var(--mover)",
                      marginBottom: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Recommended Cool Space Sights (Click to Aim)
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {RECOMMENDED_COOL_SPOTS.map((spot) => {
                      const isSpotActive = selected?.name === spot.name;
                      return (
                        <div
                          key={spot.name}
                          onClick={() => handleSelectCoolSpot(spot)}
                          style={{
                            background: isSpotActive ? "var(--raise)" : "var(--space)",
                            border: isSpotActive ? "2px solid var(--ir)" : "1px solid var(--line)",
                            borderRadius: "10px",
                            padding: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "0.4rem",
                              marginBottom: "0.35rem",
                            }}
                          >
                            <strong style={{ fontSize: "0.95rem" }}>{spot.name}</strong>
                            <span
                              style={{
                                background: "rgba(76, 201, 240, 0.15)",
                                color: "var(--ir)",
                                fontSize: "0.7rem",
                                fontWeight: "700",
                                padding: "0.15rem 0.5rem",
                                borderRadius: "999px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {spot.badge}
                            </span>
                          </div>
                          <p style={{ fontSize: "0.82rem", color: "#b9c7e6", marginBottom: "0.5rem", lineHeight: "1.4" }}>
                            {spot.description}
                          </p>
                          <div style={{ fontSize: "0.72rem", color: "var(--mute)", fontFamily: "monospace" }}>
                            RA: {spot.ra}° | Dec: {spot.dec}° | Zoom: {spot.fov}°
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Coordinate Input Form + Valid Range Footnote */}
                <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
                  <form
                    onSubmit={handleCustomSearch}
                    style={{
                      display: "flex",
                      gap: "0.85rem",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--mute)" }}>
                      Manual Coordinates:
                    </span>
                    <label style={{ fontSize: "0.85rem" }}>
                      Sky Longitude (RA):{" "}
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max="360"
                        required
                        value={customRa}
                        onChange={(e) => setCustomRa(e.target.value)}
                        style={{
                          width: "95px",
                          padding: "0.4rem",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "var(--space)",
                        }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem" }}>
                      Sky Latitude (Dec):{" "}
                      <input
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        required
                        value={customDec}
                        onChange={(e) => setCustomDec(e.target.value)}
                        style={{
                          width: "95px",
                          padding: "0.4rem",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "var(--space)",
                        }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem" }}>
                      Zoom:{" "}
                      <select
                        value={fov}
                        onChange={(e) => setFov(Number(e.target.value))}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "6px",
                          border: "1px solid var(--line)",
                          background: "var(--space)",
                        }}
                      >
                        <option value={0.03}>Close-Up (0.03°)</option>
                        <option value={0.05}>Normal (0.05°)</option>
                        <option value={0.08}>Medium (0.08°)</option>
                        <option value={0.1}>Wide View (0.10°)</option>
                      </select>
                    </label>
                    <button
                      type="submit"
                      style={{
                        padding: "0.45rem 1.15rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "var(--ir)",
                        color: "#03121c",
                        fontWeight: "700",
                      }}
                    >
                      Scan Sky
                    </button>
                  </form>

                  <p
                    style={{
                      margin: "0.65rem 0 0 0",
                      fontSize: "0.78rem",
                      color: "var(--mute)",
                      lineHeight: "1.4",
                    }}
                  >
                    * <strong style={{ color: "var(--text)" }}>Valid input ranges:</strong> Sky Longitude (RA) accepts numbers from{" "}
                    <span style={{ color: "var(--ir)", fontFamily: "monospace" }}>0° to 360°</span> (around the sky), and Sky Latitude (Dec) accepts numbers from{" "}
                    <span style={{ color: "var(--ir)", fontFamily: "monospace" }}>-90° to +90°</span> (South Pole to North Pole). Decimals are allowed!
                  </p>
                </div>
              </div>
            )}

            {/* Empty Prompt Before User Chooses a Target */}
            {!selected && !loading && (
              <div
                className="panel-card"
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  borderStyle: "dashed",
                  color: "var(--mute)",
                }}
              >
                <p style={{ margin: 0, fontSize: "1.05rem" }}>
                  Select one of the space targets above (or click{" "}
                  <strong style={{ color: "var(--mover)" }}>+ Aim Telescope</strong>) to load infrared telescope photos!
                </p>
              </div>
            )}

            {/* Dynamic Animated Loading Bar */}
            {selected && loading && <TelescopeLoader targetName={selected.name} />}

            {/* Main Viewer */}
            {selected && !loading && data && (
              <div>
                {/* Target Info & Controls Bar */}
                <div
                  className="panel-card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1rem",
                    padding: "1.1rem 1.35rem",
                  }}
                >
                  <div style={{ maxWidth: "560px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                      <h2 style={{ margin: 0, fontSize: "1.35rem", fontFamily: "var(--head)" }}>{selected.name}</h2>
                      <span
                        style={{
                          background: data.source.includes("IRSA")
                            ? "rgba(76, 201, 240, 0.16)"
                            : "rgba(255, 180, 84, 0.16)",
                          color: data.source.includes("IRSA") ? "var(--ir)" : "var(--mover)",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                        }}
                      >
                        {data.source.includes("IRSA") ? "Live NASA SPHEREx Data" : "Demo Simulation Mode"}
                      </span>
                    </div>
                    <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.92rem", color: "#b9c7e6", lineHeight: "1.45" }}>
                      {selected.hint}
                    </p>
                  </div>

                  {/* Flipbook Controls */}
                  <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setIsBlinking(!isBlinking)}
                      style={{
                        padding: "0.55rem 1rem",
                        borderRadius: "8px",
                        border: "none",
                        background: isBlinking ? "var(--mover)" : "var(--ir)",
                        color: "#03121c",
                        fontWeight: "700",
                      }}
                    >
                      {isBlinking ? "Pause Flipbook" : "Play Flipbook"}
                    </button>
                    <button
                      onClick={() => setBlinkSpeed(blinkSpeed === 500 ? 250 : 500)}
                      style={{
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: "var(--raise)",
                        fontSize: "0.85rem",
                      }}
                    >
                      Speed: {blinkSpeed === 250 ? "Fast" : "Normal"}
                    </button>
                    <button
                      onClick={() => {
                        setIsBlinking(false);
                        setActiveEpoch(1);
                      }}
                      style={{
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: !isBlinking && activeEpoch === 1 ? "#2563eb" : "var(--space)",
                      }}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => {
                        setIsBlinking(false);
                        setActiveEpoch(2);
                      }}
                      style={{
                        padding: "0.55rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: !isBlinking && activeEpoch === 2 ? "#7c3aed" : "var(--space)",
                      }}
                    >
                      After
                    </button>
                  </div>
                </div>

                {/* "Show Difference" Button Positioned Right Above the Images */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <button
                    onClick={() => setShowDifferenceArrow((prev) => !prev)}
                    style={{
                      padding: "0.7rem 1.6rem",
                      borderRadius: "999px",
                      border: showDifferenceArrow ? "2px solid #fca5a5" : "2px solid #ef4444",
                      background: showDifferenceArrow ? "#dc2626" : "rgba(239, 68, 68, 0.18)",
                      color: "#ffffff",
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      boxShadow: showDifferenceArrow ? "0 0 18px rgba(239, 68, 68, 0.55)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {showDifferenceArrow ? "Hide Difference Arrow" : "Show Difference"}
                  </button>
                </div>

                {/* Two Side-by-Side Image Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                  {/* Card 1: Before & After Flipbook */}
                  <div className="panel-card" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--head)" }}>Before & After Flipbook</h3>
                      <span
                        style={{
                          background: activeEpoch === 1 ? "#0284c7" : "#7c3aed",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                        }}
                      >
                        {activeEpoch === 1 ? "Photo 1 (Earlier)" : "Photo 2 (Later)"}
                      </span>
                    </div>

                    <ImageWithRedArrow
                      src={activeEpoch === 1 ? data.epoch1_base64 : data.epoch2_base64}
                      alt="Before and After Space View"
                      poi={data.poi}
                      showArrow={showDifferenceArrow}
                    />

                    <p style={{ fontSize: "0.86rem", color: "var(--mute)", marginTop: "0.85rem", lineHeight: "1.45" }}>
                      <strong style={{ color: "var(--text)" }}>What to look for:</strong> Distant stars stay frozen in place, while anything moving in our Solar System hops back and forth!
                    </p>
                  </div>

                  {/* Card 2: What Changed? (Subtraction) */}
                  <div className="panel-card" style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontFamily: "var(--head)" }}>What Changed? (Difference Map)</h3>
                      <span
                        style={{
                          background: "rgba(76, 201, 240, 0.18)",
                          color: "var(--ir)",
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                        }}
                      >
                        Change Detector
                      </span>
                    </div>

                    <ImageWithRedArrow
                      src={data.diff_base64}
                      alt="Difference Map"
                      poi={data.poi}
                      showArrow={showDifferenceArrow}
                    />

                    <p style={{ fontSize: "0.86rem", color: "var(--mute)", marginTop: "0.85rem", lineHeight: "1.45" }}>
                      <strong style={{ color: "var(--text)" }}>How it works:</strong> We subtract Photo 1 from Photo 2 so normal stars vanish. Any glowing dot left behind is a moving or flaring object!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Educational Sections */}
          <section className="topic" id="how">
            <h2>How blinking works</h2>
            <p>
              Pluto was found by flicking between two photos of the same patch of sky. Distant stars stay put, while anything closer to us shifts from one picture to the next. This tool automates that flicking with NASA SPHEREx infrared observations and subtracts the background so moving objects stand out immediately.
            </p>
          </section>

          <section className="topic" id="targets">
            <h2>Test targets</h2>
            <p>
              Try the quick picks above: Barnard's Star moves steadily across the sky, WISE 0855 is a faint fast-moving brown dwarf, and RW Aurigae and R Draconis dramatically change in infrared brightness over time.
            </p>
          </section>

          <section className="topic" id="about">
            <h2>About</h2>
            <p>
              Built for the NASA Space Apps SPHEREx challenge using data from NASA/IPAC IRSA. You can also search the same sky with citizen scientists at{" "}
              <a
                href="https://www.zooniverse.org/projects/marckuchner/backyard-worlds-planet-9"
                target="_blank"
                rel="noopener noreferrer"
              >
                Backyard Worlds: Planet 9
              </a>
              .
            </p>
          </section>
        </>
      )}

      <footer>
        SPHEREx infrared cutout data courtesy of NASA/IPAC Infrared Science Archive (IRSA).
      </footer>
    </div>
  );
}