// Tappable brand logo buttons for the chip flow

export const GUITAR_BRANDS = [
  "Fender", "Gibson", "PRS", "Epiphone",
  "Gretsch", "Rickenbacker", "Taylor", "Martin",
  "Yamaha", "Ibanez", "Squier", "Guild",
];

export const POPULAR_BANDS = [
  "Radiohead", "Oasis", "The Beatles", "Arctic Monkeys",
  "Nirvana", "Led Zeppelin", "Metallica", "Red Hot Chili Peppers",
  "Jimi Hendrix", "Pink Floyd", "The Smiths", "Blur",
  "Taylor Swift", "Ed Sheeran", "John Mayer", "Eric Clapton",
];

// Minimal SVG wordmark for each brand — styled to evoke the brand identity
const brandStyles: Record<string, { font: string; style?: React.CSSProperties }> = {
  Fender:      { font: "serif",      style: { fontStyle: "italic", letterSpacing: "-0.02em" } },
  Gibson:      { font: "serif",      style: { fontWeight: 400, letterSpacing: "0.04em" } },
  PRS:         { font: "sans-serif", style: { fontWeight: 900, letterSpacing: "0.1em" } },
  Epiphone:    { font: "serif",      style: { letterSpacing: "0.06em" } },
  Gretsch:     { font: "serif",      style: { fontStyle: "italic", fontWeight: 400 } },
  Rickenbacker:{ font: "sans-serif", style: { fontWeight: 700, letterSpacing: "-0.03em", fontSize: "10px" } },
  Taylor:      { font: "serif",      style: { fontWeight: 400, letterSpacing: "0.08em" } },
  Martin:      { font: "serif",      style: { fontWeight: 700, letterSpacing: "0.05em" } },
  Yamaha:      { font: "sans-serif", style: { fontWeight: 800, letterSpacing: "0.12em" } },
  Ibanez:      { font: "sans-serif", style: { fontWeight: 900, fontStyle: "italic" } },
  Squier:      { font: "serif",      style: { fontStyle: "italic", letterSpacing: "0.02em" } },
  Guild:       { font: "serif",      style: { fontWeight: 400, letterSpacing: "0.1em" } },
};

import { useState } from "react";

export function BrandButtons({ onSelect }: { onSelect: (brand: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "4px" }}>
      {GUITAR_BRANDS.map((brand) => (
        <BrandButton key={brand} brand={brand} onSelect={onSelect} />
      ))}
    </div>
  );
}

function BrandButton({ brand, onSelect }: { brand: string; onSelect: (b: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const s = brandStyles[brand] ?? { font: "sans-serif" };

  return (
    <button
      onClick={() => onSelect(brand)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1e1e1e" : "#141414",
        border: `1px solid ${hovered ? "#e8d44d" : "#2a2a2a"}`,
        borderRadius: "10px",
        padding: "10px 16px",
        cursor: "pointer",
        transition: "all 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "80px",
      }}
    >
      <span
        style={{
          fontFamily: s.font,
          fontSize: "13px",
          fontWeight: 700,
          color: hovered ? "#e8d44d" : "#c0c0c0",
          transition: "color 0.15s",
          ...s.style,
        }}
      >
        {brand}
      </span>
    </button>
  );
}

export function BandButtons({ onSelect }: { onSelect: (band: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "4px" }}>
      {POPULAR_BANDS.map((band) => (
        <BandButton key={band} band={band} onSelect={onSelect} />
      ))}
    </div>
  );
}

function BandButton({ band, onSelect }: { band: string; onSelect: (b: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onSelect(band)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1e1e1e" : "#141414",
        border: `1px solid ${hovered ? "#e8d44d" : "#2a2a2a"}`,
        borderRadius: "20px",
        padding: "8px 16px",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: hovered ? "#e8d44d" : "#a0a0a0",
          transition: "color 0.15s",
        }}
      >
        {band}
      </span>
    </button>
  );
}
