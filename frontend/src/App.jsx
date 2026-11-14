import { useState, useEffect } from "react";

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

const LOADING_STAGES = [
  { threshold: 0, label: "Aiming SPHEREx infrared telescope at coordinates..." },
  { threshold: 30, label: "Querying NASA space archive for Before & After photos..." },
  { threshold: 60, label: "Stretching faint infrared light so hidden objects pop out..." },
  { threshold: 82, label: "Subtracting background stars to highlight what moved..." },
];

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
    <div
      style={{
        padding: "2.25rem 1.75rem",
        background: "#111827",
        borderRadius: "14px",
        border: "1px solid #1e293b",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
      }}
    >
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
              background: "#38bdf8",
              boxShadow: "0 0 10px #38bdf8",
            }}
          />
          <strong style={{ fontSize: "1.05rem", color: "#f8fafc" }}>
            Scanning {targetName}
          </strong>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.95rem",
            fontWeight: "800",
            color: "#38bdf8",
          }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#090d16",
          borderRadius: "999px",
          overflow: "hidden",
          border: "1px solid #1e293b",
          padding: "2px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #0284c7, #38bdf8, #34d399)",
            boxShadow: "0 0 14px rgba(56, 189, 248, 0.65)",
            transition: "width 0.25s ease-out",
          }}
        />
      </div>

      <p
        style={{
          margin: "0.75rem 0 0 0",
          fontSize: "0.88rem",
          color: "#94a3b8",
        }}
      >
        {currentStage.label}
      </p>
    </div>
  );
}

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
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #334155",
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

export default function App() {
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

  return (
    <div
      style={{
        background: "#090d16",
        color: "#f8fafc",
        minHeight: "100vh",
        padding: "2.5rem 1.5rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              padding: "0.3rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.04em",
              marginBottom: "0.75rem",
            }}
          >
            NASA SPHEREx SPACE EXPLORER
          </div>
          <h1
            style={{
              margin: "0 0 0.6rem 0",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              lineHeight: "1.2",
              fontWeight: "800",
            }}
          >
            Planet X & Moving Object Hunter
          </h1>
          <p
            style={{
              color: "#94a3b8",
              margin: "0 auto",
              maxWidth: "660px",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            Compare infrared telescope photos taken at different times. If a dot{" "}
            <strong style={{ color: "#e2e8f0" }}>jumps</strong> or{" "}
            <strong style={{ color: "#e2e8f0" }}>flashes</strong>, it could be a nearby brown dwarf, asteroid, or undiscovered Planet X!
          </p>
        </header>

        {/* Step 1: Pick a Famous Space Target + Aim Telescope Square */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: "700",
              color: "#94a3b8",
              marginBottom: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            1. Pick a Famous Space Target
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {BENCHMARK_TARGETS.map((target) => {
              const isSelected = !showAimPanel && selected?.name === target.name;
              return (
                <button
                  key={target.name}
                  onClick={() => handleSelectBenchmark(target)}
                  style={{
                    padding: "0.65rem 1rem",
                    borderRadius: "10px",
                    border: isSelected ? "2px solid #38bdf8" : "1px solid #1e293b",
                    background: isSelected ? "#0f2942" : "#111827",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{target.name}</div>
                  <div style={{ fontSize: "0.75rem", color: isSelected ? "#7dd3fc" : "#94a3b8" }}>
                    {target.tag}
                  </div>
                </button>
              );
            })}

            {/* 6th Square: Opens Custom Aim Telescope Drawer */}
            <button
              onClick={() => setShowAimPanel((prev) => !prev)}
              style={{
                padding: "0.65rem 1rem",
                borderRadius: "10px",
                border: showAimPanel ? "2px solid #10b981" : "1px dashed #34d399",
                background: showAimPanel ? "#064e3b" : "#111827",
                color: "#fff",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#34d399" }}>
                + Aim Telescope
              </div>
              <div style={{ fontSize: "0.75rem", color: "#a7f3d0" }}>
                {showAimPanel ? "Hide Custom Aim" : "Custom & Cool Spots"}
              </div>
            </button>
          </div>
        </div>

        {/* Collapsible Custom Telescope Aiming & Recommended Cool Spots */}
        {showAimPanel && (
          <div
            style={{
              background: "#111827",
              padding: "1.25rem",
              borderRadius: "12px",
              border: "1px solid #059669",
              marginBottom: "1.5rem",
            }}
          >
            {/* Recommended Cool Spots Grid */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "800",
                  color: "#34d399",
                  margin: "0 0 0.65rem 0",
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
                        background: isSpotActive ? "#0f2942" : "#090d16",
                        border: isSpotActive ? "2px solid #38bdf8" : "1px solid #1e293b",
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
                        <strong style={{ fontSize: "0.95rem", color: "#f8fafc" }}>{spot.name}</strong>
                        <span
                          style={{
                            background: "rgba(16, 185, 129, 0.2)",
                            color: "#34d399",
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
                      <p style={{ fontSize: "0.8rem", color: "#cbd5e1", margin: "0 0 0.5rem 0", lineHeight: "1.4" }}>
                        {spot.description}
                      </p>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>
                        RA: {spot.ra}° | Dec: {spot.dec}° | Zoom: {spot.fov}°
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual Coordinate Input Form + Valid Range Footnote */}
            <div style={{ paddingTop: "1rem", borderTop: "1px solid #1e293b" }}>
              <form
                onSubmit={handleCustomSearch}
                style={{
                  display: "flex",
                  gap: "0.85rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8" }}>
                  Manual Coordinates:
                </span>
                <label style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
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
                      border: "1px solid #334155",
                      background: "#090d16",
                      color: "#fff",
                    }}
                  />
                </label>
                <label style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
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
                      border: "1px solid #334155",
                      background: "#090d16",
                      color: "#fff",
                    }}
                  />
                </label>
                <label style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                  Zoom:{" "}
                  <select
                    value={fov}
                    onChange={(e) => setFov(Number(e.target.value))}
                    style={{
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #334155",
                      background: "#090d16",
                      color: "#fff",
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
                    padding: "0.45rem 1.1rem",
                    borderRadius: "6px",
                    border: "none",
                    background: "#10b981",
                    color: "#022c22",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  Scan Sky
                </button>
              </form>

              {/* Valid Range Footnote */}
              <p
                style={{
                  margin: "0.65rem 0 0 0",
                  fontSize: "0.78rem",
                  color: "#64748b",
                  lineHeight: "1.4",
                }}
              >
                * <strong style={{ color: "#94a3b8" }}>Valid input ranges:</strong> Sky Longitude (RA) accepts numbers from{" "}
                <span style={{ color: "#34d399", fontFamily: "monospace" }}>0° to 360°</span> (around the sky), and Sky Latitude (Dec) accepts numbers from{" "}
                <span style={{ color: "#34d399", fontFamily: "monospace" }}>-90° to +90°</span> (South Pole to North Pole). Decimals are allowed!
              </p>
            </div>
          </div>
        )}

        {/* Empty Prompt Before User Chooses a Target */}
        {!selected && !loading && (
          <div
            style={{
              padding: "2.5rem 1.5rem",
              background: "#111827",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px dashed #334155",
              color: "#94a3b8",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.05rem" }}>
              Select one of the space targets above (or click{" "}
              <strong style={{ color: "#34d399" }}>+ Aim Telescope</strong>) to load infrared telescope photos!
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
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
                background: "#111827",
                padding: "1.1rem 1.35rem",
                borderRadius: "12px",
                border: "1px solid #1e293b",
              }}
            >
              <div style={{ maxWidth: "560px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{selected.name}</h2>
                  <span
                    style={{
                      background: data.source.includes("IRSA")
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(245, 158, 11, 0.2)",
                      color: data.source.includes("IRSA") ? "#34d399" : "#fbbf24",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                    }}
                  >
                    {data.source.includes("IRSA") ? "Live NASA SPHEREx Data" : "Demo Simulation Mode"}
                  </span>
                </div>
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.9rem", color: "#cbd5e1", lineHeight: "1.4" }}>
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
                    background: isBlinking ? "#f59e0b" : "#38bdf8",
                    color: "#090d16",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {isBlinking ? "Pause Flipbook" : "Play Flipbook"}
                </button>
                <button
                  onClick={() => setBlinkSpeed(blinkSpeed === 500 ? 250 : 500)}
                  style={{
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #334155",
                    background: "#1e293b",
                    color: "#e2e8f0",
                    fontSize: "0.85rem",
                    cursor: "pointer",
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
                    border: "1px solid #334155",
                    background: !isBlinking && activeEpoch === 1 ? "#2563eb" : "#090d16",
                    color: "#fff",
                    cursor: "pointer",
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
                    border: "1px solid #334155",
                    background: !isBlinking && activeEpoch === 2 ? "#7c3aed" : "#090d16",
                    color: "#fff",
                    cursor: "pointer",
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
                  padding: "0.7rem 1.5rem",
                  borderRadius: "999px",
                  border: showDifferenceArrow ? "2px solid #fca5a5" : "2px solid #ef4444",
                  background: showDifferenceArrow ? "#dc2626" : "rgba(239, 68, 68, 0.18)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  boxShadow: showDifferenceArrow ? "0 0 18px rgba(239, 68, 68, 0.5)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {showDifferenceArrow ? "Hide Difference Arrow" : "Show Difference"}
              </button>
            </div>

            {/* Two Side-by-Side Image Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {/* Card 1: Before & After Flipbook */}
              <div style={{ background: "#111827", padding: "1.25rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>Before & After Flipbook</h3>
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

                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: 0, lineHeight: "1.45" }}>
                  <strong style={{ color: "#e2e8f0" }}>What to look for:</strong> Distant stars stay frozen in place, while anything moving in our Solar System hops back and forth!
                </p>
              </div>

              {/* Card 2: What Changed? (Subtraction) */}
              <div style={{ background: "#111827", padding: "1.25rem", borderRadius: "12px", border: "1px solid #1e293b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>What Changed? (Difference Map)</h3>
                  <span
                    style={{
                      background: "#059669",
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

                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: 0, lineHeight: "1.45" }}>
                  <strong style={{ color: "#e2e8f0" }}>How it works:</strong> We subtract Photo 1 from Photo 2 so normal stars vanish. Any glowing dot left behind is a moving or flaring object!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}