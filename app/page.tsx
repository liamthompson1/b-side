"use client";

import { useState } from "react";

const QUICK_CHIPS = [
  {
    id: "band",
    label: "Favourite Band",
    prompt: "I want to find guitars based on my favourite band",
    icon: "♪",
  },
  {
    id: "brand",
    label: "Favourite Brand",
    prompt: "I already have a favourite guitar brand in mind",
    icon: "◈",
  },
  {
    id: "experience",
    label: "Experience Level",
    prompt: "Help me find a guitar based on my experience and budget",
    icon: "◎",
  },
];

export default function Home() {
  const [input, setInput] = useState("");

  function handleChip(prompt: string) {
    setInput(prompt);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#0a0a0a" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6">
        <BSideLogo />
        <div
          className="hidden md:flex items-center gap-8"
          style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#6b6b6b" }}
        >
          <a href="#" className="hover:text-white transition-colors uppercase">Guitars</a>
          <a href="#" className="hover:text-white transition-colors uppercase">Keys</a>
          <a href="#" className="hover:text-white transition-colors uppercase">Drums</a>
          <a href="#" className="hover:text-white transition-colors uppercase">Studio</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p
          className="mb-8 uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#e8d44d" }}
        >
          Where Music Lives on Both Sides
        </p>

        <h1
          className="font-black leading-tight mb-4"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            lineHeight: 1.05,
          }}
        >
          Find the guitar
          <br />
          <em style={{ color: "#e8d44d", fontStyle: "italic" }}>
            you&apos;ve been waiting for.
          </em>
        </h1>

        <p className="mt-6 mb-12 max-w-md" style={{ color: "#6b6b6b", fontSize: "1.05rem", lineHeight: 1.7 }}>
          Tell us what you play, who inspires you, or how much you want to spend —
          our AI expert will find your perfect match.
        </p>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div
            className="flex items-center rounded-full px-5 py-1 transition-colors"
            style={{
              background: "#141414",
              border: "1px solid #252525",
            }}
            onFocus={() => {}}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What kind of guitarist are you?"
              className="flex-1 bg-transparent text-white outline-none py-3 text-sm"
              style={{ caretColor: "#e8d44d" }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="ml-3 rounded-full font-bold uppercase transition-colors"
              style={{
                background: input.trim() ? "#e8d44d" : "#1e1e1e",
                color: input.trim() ? "#0a0a0a" : "#3a3a3a",
                fontSize: "11px",
                letterSpacing: "0.12em",
                padding: "10px 20px",
              }}
            >
              Find →
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleChip(chip.prompt)}
                className="flex items-center gap-2 rounded-full transition-all"
                style={{
                  padding: "8px 18px",
                  border: "1px solid #252525",
                  color: "#6b6b6b",
                  fontSize: "12px",
                  letterSpacing: "0.03em",
                  background: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#e8d44d";
                  e.currentTarget.style.color = "#e8d44d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#252525";
                  e.currentTarget.style.color = "#6b6b6b";
                }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Footer strip */}
      <div
        className="flex items-center justify-between px-8 py-5"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <span style={{ color: "#2a2a2a", fontSize: "11px", letterSpacing: "0.2em" }}>B—SIDE</span>
        <span style={{ color: "#2a2a2a", fontSize: "11px" }}>Guitars · Keys · Drums · Studio</span>
      </div>
    </main>
  );
}

function BSideLogo() {
  return (
    <div className="flex items-center gap-0.5">
      <span
        className="font-black text-white"
        style={{ fontFamily: "var(--font-playfair)", fontSize: "1.25rem", lineHeight: 1 }}
      >
        B
      </span>
      <VinylIcon />
      <span
        className="font-black text-white"
        style={{ fontFamily: "var(--font-playfair)", fontSize: "1.25rem", lineHeight: 1 }}
      >
        SIDE
      </span>
    </div>
  );
}

function VinylIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ margin: "0 1px" }}>
      <circle cx="10" cy="10" r="9" fill="white" />
      <circle cx="10" cy="10" r="5.5" fill="#0a0a0a" />
      <circle cx="10" cy="10" r="2.5" fill="white" />
      <circle cx="10" cy="10" r="1.2" fill="#0a0a0a" />
    </svg>
  );
}
