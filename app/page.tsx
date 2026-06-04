"use client";

import { useState, lazy, Suspense } from "react";

const GuitarFinder = lazy(() => import("@/components/GuitarFinder"));

const QUICK_CHIPS = [
  { id: "band",       label: "Favourite Band",    prompt: "I want to find guitars based on my favourite band" },
  { id: "brand",      label: "Favourite Brand",   prompt: "I already have a favourite guitar brand in mind" },
  { id: "experience", label: "Experience Level",  prompt: "Help me find a guitar based on my experience and budget" },
];

const CATEGORIES = [
  { label: "Guitars",  count: "647 instruments", img: "https://images.unsplash.com/photo-1510915361869-0191d45b0516?w=600&h=400&fit=crop&auto=format" },
  { label: "Keys",     count: "312 instruments", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop&auto=format" },
  { label: "Drums",    count: "224 kits & more", img: "https://images.unsplash.com/photo-1524230507669-5f7701d936ce?w=600&h=400&fit=crop&auto=format" },
  { label: "Studio",   count: "340 pieces of gear", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop&auto=format" },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderInitial, setFinderInitial] = useState<string | undefined>();

  function openFinder(prompt?: string) {
    setFinderInitial(prompt);
    setFinderOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) openFinder(input.trim());
  }

  return (
    <>
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column" }}>

          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/persona.jpg"
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
            }}
          />

          {/* Gradient overlays */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(10,10,10,0.85) 80%, #0a0a0a 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

          {/* Nav */}
          <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px" }}>
            <BSideLogo />
            <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.55)" }}>
              {["Guitars", "Keys", "Drums", "Studio"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{ textDecoration: "none", color: "inherit", textTransform: "uppercase", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>

          {/* Hero content */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "40px 24px 80px",
            }}
          >
            <p style={{ fontSize: "11px", letterSpacing: "0.28em", color: "#e8d44d", textTransform: "uppercase", marginBottom: "24px" }}>
              Where Music Lives on Both Sides
            </p>

            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.8rem, 9vw, 6.5rem)",
                fontWeight: 900,
                lineHeight: 1.0,
                marginBottom: "0",
                color: "#fff",
              }}
            >
              Find the guitar
              <br />
              <em style={{ color: "#e8d44d", fontStyle: "italic" }}>
                you&apos;ve been
                <br />
                waiting for.
              </em>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "400px", margin: "28px 0 40px" }}>
              This team should win.
            </p>

            {/* Input bar */}
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "520px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "100px",
                  padding: "6px 6px 6px 22px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What kind of guitarist are you?"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: "16px",
                    padding: "8px 0",
                    caretColor: "#e8d44d",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? "#e8d44d" : "rgba(255,255,255,0.1)",
                    color: input.trim() ? "#0a0a0a" : "rgba(255,255,255,0.3)",
                    border: "none",
                    borderRadius: "100px",
                    padding: "12px 24px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  Find →
                </button>
              </div>

              {/* Quick chips */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "16px" }}>
                {QUICK_CHIPS.map((chip) => (
                  <ChipButton key={chip.id} label={chip.label} onClick={() => openFinder(chip.prompt)} />
                ))}
              </div>
            </form>
          </div>

          {/* Scroll cue */}
          <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.35 }}>
            <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, transparent, white)" }} />
          </div>
        </section>

        {/* ── Category grid ─────────────────────────────────────────── */}
        <section style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", maxWidth: "1100px", margin: "0 auto" }}>
            {CATEGORIES.map((cat) => (
              <CategoryTile key={cat.label} {...cat} />
            ))}
          </div>
        </section>

        {/* ── Now Playing ──────────────────────────────────────────── */}
        <section style={{ padding: "0 16px 16px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "20px",
              padding: "28px 28px 0",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "8px", height: "8px", borderRadius: "50%", background: "#1DB954" }} />
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "#4a4a4a", textTransform: "uppercase" }}>
                Now Playing
              </p>
              <p style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "0.05em" }}>— Manilla Times</p>
            </div>
            <iframe
              src="https://open.spotify.com/embed/artist/4pJF1tw5SVplqOd4WIMz5n?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "0 0 12px 12px", display: "block" }}
            />
          </div>
        </section>

        {/* ── Editorial strip ───────────────────────────────────────── */}
        <section
          style={{
            margin: "16px",
            borderRadius: "20px",
            background: "#111",
            border: "1px solid #1e1e1e",
            padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1100px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#e8d44d", textTransform: "uppercase" }}>Editorial</p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "#fff",
              maxWidth: "600px",
            }}
          >
            Every record has<br />
            <em style={{ fontStyle: "italic", color: "#e8d44d" }}>a B-Side.</em>
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#666", maxWidth: "520px" }}>
            The side that didn&apos;t make the radio. The one the artist played everything into. The side the real fans know.
            <br /><br />
            B-Side exists for those people — the ones who go deeper, care more, and refuse to settle. From first lessons to the main stage, we&apos;re with you at every step.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="#"
              style={{ background: "#e8d44d", color: "#0a0a0a", padding: "13px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
            >
              Our Story
            </a>
            <a
              href="#"
              style={{ background: "transparent", color: "#666", padding: "13px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: "1px solid #2a2a2a" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#e8d44d"; e.currentTarget.style.color = "#e8d44d"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
            >
              Lessons &amp; Tutorials
            </a>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 32px", borderTop: "1px solid #141414", marginTop: "16px" }}>
          <BSideLogo />
          <div style={{ display: "flex", gap: "28px" }}>
            {["Guitars", "Keys", "Drums", "Studio"].map((item) => (
              <a key={item} href="#" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#2a2a2a", textDecoration: "none", textTransform: "uppercase" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#666")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#2a2a2a")}
              >{item}</a>
            ))}
          </div>
        </footer>

      </main>

      {finderOpen && (
        <Suspense fallback={null}>
          <GuitarFinder initialInput={finderInitial} onClose={() => setFinderOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ChipButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.55)",
        fontSize: "12px",
        padding: "8px 18px",
        borderRadius: "100px",
        cursor: "pointer",
        transition: "all 0.15s",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#e8d44d";
        e.currentTarget.style.color = "#e8d44d";
        e.currentTarget.style.background = "rgba(232,212,77,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.color = "rgba(255,255,255,0.55)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
    >
      {label}
    </button>
  );
}

function CategoryTile({ label, count, img }: { label: string; count: string; img: string }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: "4/3",
        background: "#141414",
      }}
      onMouseEnter={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        const img = e.currentTarget.querySelector("img") as HTMLImageElement;
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
      <div style={{ position: "absolute", bottom: "16px", left: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-playfair)", lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontSize: "10px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)", marginTop: "3px" }}>{count}</p>
      </div>
    </div>
  );
}

function BSideLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.25rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>B</span>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ margin: "0 1px" }}>
        <circle cx="10" cy="10" r="9" fill="white" />
        <circle cx="10" cy="10" r="5.5" fill="#0a0a0a" />
        <circle cx="10" cy="10" r="2.5" fill="white" />
        <circle cx="10" cy="10" r="1.2" fill="#0a0a0a" />
      </svg>
      <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.25rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>SIDE</span>
    </div>
  );
}
