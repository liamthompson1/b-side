"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProductCard from "./ProductCard";
import { getProductsByIds } from "@/lib/products";

type ContextualChip = { label: string; prompt: string };

const INITIAL_CHIPS: ContextualChip[] = [
  { label: "♪  Favourite Band", prompt: "I want to find guitars based on my favourite band" },
  { label: "◈  Favourite Brand", prompt: "I already have a favourite guitar brand in mind" },
  { label: "◎  Experience Level", prompt: "Help me find a guitar based on my experience and budget" },
];

const STATIC_GREETING =
  "Hey! I'm B-Side's guitar expert. Tell me about the music you play, a band you love, or what you want to spend — and I'll find you the perfect guitar.";

export default function GuitarFinder({
  initialInput,
  onClose,
}: {
  initialInput?: string;
  onClose: () => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState("");
  const [chips, setChips] = useState<ContextualChip[]>(INITIAL_CHIPS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didAutoSend = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-send initialInput once on mount
  useEffect(() => {
    if (didAutoSend.current || !initialInput) return;
    didAutoSend.current = true;
    sendMessage({ role: "user", parts: [{ type: "text", text: initialInput }] });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update chips based on last assistant message
  useEffect(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    const text = last.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ")
      .toLowerCase();

    if (text.includes("budget") || text.includes("spend") || text.includes("price")) {
      setChips([
        { label: "Under £700", prompt: "My budget is under £700" },
        { label: "£700–£1,000", prompt: "My budget is between £700 and £1,000" },
        { label: "Up to £1,500", prompt: "My budget is up to £1,500" },
      ]);
    } else if (text.includes("style") || text.includes("genre") || text.includes("play")) {
      setChips([
        { label: "Rock / Metal", prompt: "I mostly play rock and metal" },
        { label: "Blues / Jazz", prompt: "I play blues and jazz" },
        { label: "Folk / Country", prompt: "I play folk and country" },
        { label: "Indie / Alternative", prompt: "I play indie and alternative" },
      ]);
    } else if (text.includes("experience") || text.includes("beginner") || text.includes("how long")) {
      setChips([
        { label: "Complete beginner", prompt: "I'm a complete beginner" },
        { label: "A few years in", prompt: "I've been playing a few years" },
        { label: "Gigging musician", prompt: "I'm an experienced gigging musician" },
      ]);
    } else if (messages.length >= 4) {
      setChips([
        { label: "Show me a demo", prompt: "Can I see a video demo of your top pick?" },
        { label: "Something cheaper", prompt: "Do you have anything a bit cheaper?" },
        { label: "Ready to buy", prompt: "I'm ready to buy — what's next?" },
      ]);
    }
  }, [messages]);

  function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || status === "streaming") return;
    sendMessage({ role: "user", parts: [{ type: "text", text: value }] });
    setInput("");
  }

  const isStreaming = status === "streaming";

  const visibleMessages = messages.filter((m) => {
    if (m.role !== "user") return true;
    const text = m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");
    return text.trim() !== "";
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid #1a1a1a",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VinylIcon />
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "14px",
              fontWeight: 700,
              color: "#e8d44d",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            B-Side Guitar Finder
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#6b6b6b",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px 8px",
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Static greeting */}
        <AssistantRow>
          <TextBubble text={STATIC_GREETING} />
        </AssistantRow>

        {visibleMessages.map((message) => {
          if (message.role === "user") {
            const text = message.parts
              .filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("\n");
            return (
              <div key={message.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: "18px 18px 4px 18px",
                    background: "#e8d44d",
                    color: "#0a0a0a",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </div>
              </div>
            );
          }

          // Assistant message — combine all text parts into one bubble,
          // tool results rendered inline in order
          const elements: React.ReactNode[] = [];
          let textBuffer = "";

          const flushText = (key: string) => {
            if (!textBuffer.trim()) return;
            elements.push(
              <AssistantRow key={key}>
                <TextBubble text={textBuffer.trim()} />
              </AssistantRow>
            );
            textBuffer = "";
          };

          message.parts.forEach((part, i) => {
            const key = `${message.id}-${i}`;

            if (part.type === "text") {
              const t = (part as { type: "text"; text: string }).text;
              if (t) textBuffer += (textBuffer ? "\n\n" : "") + t;
              return;
            }

            if (part.type.startsWith("tool-")) {
              const inv = part as {
                type: string;
                state?: string;
                output?: {
                  productIds?: string[];
                  headline?: string;
                  youtubeId?: string;
                  title?: string;
                };
              };

              if (inv.state !== "output-available") return;

              flushText(`text-before-${key}`);

              if (part.type === "tool-showProducts" && inv.output?.productIds) {
                const found = getProductsByIds(inv.output.productIds);
                elements.push(
                  <div key={key}>
                    {inv.output.headline && (
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          color: "#e8d44d",
                          textTransform: "uppercase",
                          marginBottom: "10px",
                        }}
                      >
                        {inv.output.headline}
                      </p>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          found.length === 1
                            ? "1fr"
                            : found.length === 2
                            ? "repeat(2, 1fr)"
                            : "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {found.map((p) => (
                        <ProductCard key={p.id} product={p} featured={found.length === 1} />
                      ))}
                    </div>
                  </div>
                );
              }

              if (part.type === "tool-showVideo" && inv.output?.youtubeId) {
                elements.push(
                  <div
                    key={key}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      background: "#141414",
                      border: "1px solid #252525",
                    }}
                  >
                    {inv.output.title && (
                      <p
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          color: "#e8d44d",
                          textTransform: "uppercase",
                          padding: "12px 14px 8px",
                        }}
                      >
                        {inv.output.title}
                      </p>
                    )}
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${inv.output.youtubeId}?rel=0&modestbranding=1`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={inv.output.title ?? "Guitar demo"}
                      />
                    </div>
                  </div>
                );
              }
            }
          });

          flushText(`text-end-${message.id}`);

          return <div key={message.id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{elements}</div>;
        })}

        {isStreaming && (
          <AssistantRow>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 18px 18px 18px",
                background: "#1a1a1a",
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#6b6b6b",
                    display: "inline-block",
                    animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </AssistantRow>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "14px 24px 20px",
          borderTop: "1px solid #1a1a1a",
          flexShrink: 0,
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => submit(chip.prompt)}
              disabled={isStreaming}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                color: "#7a7a7a",
                fontSize: "12px",
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: isStreaming ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!isStreaming) {
                  e.currentTarget.style.borderColor = "#e8d44d";
                  e.currentTarget.style.color = "#e8d44d";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2a2a2a";
                e.currentTarget.style.color = "#7a7a7a";
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#111",
            border: "1px solid #252525",
            borderRadius: "12px",
            padding: "4px 4px 4px 16px",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submit()}
            placeholder="Ask about a guitar, a band, a budget..."
            disabled={isStreaming}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "14px",
              padding: "10px 0",
              caretColor: "#e8d44d",
            }}
          />
          <button
            onClick={() => submit()}
            disabled={!input.trim() || isStreaming}
            style={{
              background: input.trim() && !isStreaming ? "#e8d44d" : "#1e1e1e",
              color: input.trim() && !isStreaming ? "#0a0a0a" : "#3a3a3a",
              border: "none",
              borderRadius: "8px",
              padding: "10px 18px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: input.trim() && !isStreaming ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1.1); }
        }
        .md-prose p { margin: 0 0 8px; }
        .md-prose p:last-child { margin-bottom: 0; }
        .md-prose strong { color: #ffffff; font-weight: 700; }
        .md-prose em { font-style: italic; }
        .md-prose ul { margin: 6px 0 8px; padding-left: 18px; }
        .md-prose li { margin-bottom: 4px; }
        .md-prose a { color: #e8d44d; text-decoration: underline; }
      `}</style>
    </div>
  );
}

function AssistantRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      {children}
    </div>
  );
}

function TextBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        maxWidth: "85%",
        padding: "12px 16px",
        borderRadius: "4px 18px 18px 18px",
        background: "#1a1a1a",
        color: "#d8d8d8",
        fontSize: "14px",
        lineHeight: 1.65,
      }}
    >
      <div className="md-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

function VinylIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="#e8d44d" />
      <circle cx="10" cy="10" r="5.5" fill="#0a0a0a" />
      <circle cx="10" cy="10" r="2.5" fill="#e8d44d" />
      <circle cx="10" cy="10" r="1.2" fill="#0a0a0a" />
    </svg>
  );
}
