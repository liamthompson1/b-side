"use client";

import { useEffect, useRef, useState } from "react";
import { type Product } from "@/lib/products";

type ImageState = "idle" | "loading" | "done" | "error";

export default function ProductModal({
  product,
  venue,
  onClose,
}: {
  product: Product;
  venue?: string;
  onClose: () => void;
}) {
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiImageState, setAiImageState] = useState<ImageState>("idle");

  const [personalImage, setPersonalImage] = useState<string | null>(null);
  const [personalState, setPersonalState] = useState<ImageState>("idle");

  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-generate guitar image on mount
  useEffect(() => {
    setAiImageState("loading");
    fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guitarName: product.name,
        brand: product.brand,
        venue,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.imageData) {
          setAiImage(`data:${d.mimeType};base64,${d.imageData}`);
          setAiImageState("done");
        } else {
          setAiImageState("error");
        }
      })
      .catch(() => setAiImageState("error"));
  }, [product, venue]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      generatePersonalised(base64);
    };
    reader.readAsDataURL(file);
  }

  function generatePersonalised(userPhoto: string) {
    setPersonalState("loading");
    setPersonalImage(null);
    fetch("/api/personalize-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guitarName: product.name,
        brand: product.brand,
        venue,
        userPhoto,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.imageData) {
          setPersonalImage(`data:${d.mimeType};base64,${d.imageData}`);
          setPersonalState("done");
        } else {
          setPersonalState("error");
        }
      })
      .catch(() => setPersonalState("error"));
  }

  const displayImage = personalImage ?? aiImage ?? product.image;
  const isGenerating = aiImageState === "loading";
  const isPersonalising = personalState === "loading";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#0f0f0f",
          border: "1px solid #252525",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image hero */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "42%",
            background: "#141414",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={product.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 0.4s",
              opacity: isGenerating ? 0.3 : 1,
            }}
          />

          {/* Generating overlay */}
          {(isGenerating || isPersonalising) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#e8d44d",
                      display: "inline-block",
                      animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <p style={{ color: "#e8d44d", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {isPersonalising ? "Placing you in the scene…" : "Generating your image…"}
              </p>
            </div>
          )}

          {/* Gradient overlay for text legibility */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
            }}
          />

          {/* AI badge */}
          {(aiImageState === "done" || personalState === "done") && (
            <div
              style={{
                position: "absolute",
                top: "14px",
                left: "14px",
                background: "rgba(0,0,0,0.7)",
                border: "1px solid #e8d44d",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#e8d44d",
                textTransform: "uppercase",
              }}
            >
              {personalState === "done" ? "✦ Personalised" : "✦ AI Generated"}
            </div>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid #333",
              color: "#aaa",
              fontSize: "16px",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* Brand + name over image */}
          <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#e8d44d",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              {product.brand}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: "auto", padding: "20px 24px 24px", flex: 1 }}>
          {/* Price + stars */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <p
              style={{ fontSize: "24px", fontWeight: 800, color: "#fff" }}
            >
              £{product.price.toLocaleString()}
            </p>
            <div style={{ display: "flex", gap: "3px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "14px",
                    color: i < product.stars ? "#e8d44d" : "#2a2a2a",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#a0a0a0",
              marginBottom: "16px",
            }}
          >
            {product.description}
          </p>

          {/* Style tags */}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}
          >
            {product.styles.map((s) => (
              <span
                key={s}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  color: "#6a6a6a",
                  textTransform: "capitalize",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Personalisation section */}
          <div
            style={{
              background: "#141414",
              border: "1px solid #252525",
              borderRadius: "14px",
              padding: "18px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#e8d44d",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              See yourself playing it
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#6a6a6a",
                marginBottom: "14px",
                lineHeight: 1.5,
              }}
            >
              Upload a photo of yourself and we&apos;ll place you in the scene.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              onClick={() => fileRef.current?.click()}
              disabled={isPersonalising}
              style={{
                background: isPersonalising ? "#1a1a1a" : "#e8d44d",
                color: isPersonalising ? "#4a4a4a" : "#0a0a0a",
                border: "none",
                borderRadius: "10px",
                padding: "11px 20px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: isPersonalising ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                width: "100%",
              }}
            >
              {isPersonalising
                ? "Generating your scene…"
                : personalState === "done"
                ? "↑ Upload a different photo"
                : "↑ Upload your photo"}
            </button>

            {personalState === "error" && (
              <p style={{ color: "#e05050", fontSize: "12px", marginTop: "8px" }}>
                Something went wrong — try a different photo.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
