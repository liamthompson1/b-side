"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { getProductsByIds } from "@/lib/products";

type ContextualChip = { label: string; prompt: string };

const INITIAL_CHIPS: ContextualChip[] = [
  { label: "♪  Favourite Band", prompt: "I want guitars based on my favourite band" },
  { label: "◈  Favourite Brand", prompt: "I have a favourite guitar brand in mind" },
  { label: "◎  Experience Level", prompt: "Help me find a guitar based on my experience and budget" },
];

export default function GuitarFinder({
  initialInput,
  onClose,
}: {
  initialInput?: string;
  onClose: () => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({ transport });
  const [input, setInput] = useState(initialInput ?? "");
  const [chips, setChips] = useState<ContextualChip[]>(INITIAL_CHIPS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasGreeted = useRef(false);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Send initial greeting from assistant on mount
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: "__greet__" }],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-send if initialInput provided
  useEffect(() => {
    if (initialInput && messages.length > 1) {
      // greeting already happened, now send the actual initial prompt
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: initialInput }],
      });
      setInput("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length >= 2 ? true : false]);

  // Update chips based on conversation context
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    const text = lastAssistant.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ")
      .toLowerCase();

    if (text.includes("budget") || text.includes("spend")) {
      setChips([
        { label: "Under £700", prompt: "My budget is under £700" },
        { label: "£700–£1,000", prompt: "My budget is between £700 and £1,000" },
        { label: "£1,000–£1,500", prompt: "My budget is up to £1,500" },
      ]);
    } else if (text.includes("genre") || text.includes("style") || text.includes("play")) {
      setChips([
        { label: "Rock / Metal", prompt: "I mostly play rock and metal" },
        { label: "Blues / Jazz", prompt: "I play blues and jazz" },
        { label: "Folk / Country", prompt: "I play folk and country" },
        { label: "Indie / Alternative", prompt: "I play indie and alternative" },
      ]);
    } else if (text.includes("beginner") || text.includes("experience") || text.includes("year")) {
      setChips([
        { label: "Complete beginner", prompt: "I'm a complete beginner" },
        { label: "A few years in", prompt: "I've been playing a few years" },
        { label: "Gigging musician", prompt: "I'm an experienced gigging musician" },
      ]);
    } else if (messages.length > 4) {
      setChips([
        { label: "Show me a demo", prompt: "Can I see a video demo of your top pick?" },
        { label: "Something cheaper", prompt: "Do you have anything a bit cheaper?" },
        { label: "I'm ready to buy", prompt: "I'm ready to buy — what's the best way to order?" },
      ]);
    }
  }, [messages]);

  function submit(text?: string) {
    const value = text ?? input.trim();
    if (!value || status === "streaming") return;
    sendMessage({ role: "user", parts: [{ type: "text", text: value }] });
    setInput("");
  }

  const isStreaming = status === "streaming";

  // Filter out the hidden greeting trigger
  const visibleMessages = messages.filter((m) => {
    if (m.role === "user") {
      const text = m.parts
        .filter((p) => p.type === "text")
        .map((p) => (p as { type: "text"; text: string }).text)
        .join("");
      return text !== "__greet__";
    }
    return true;
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

      {/* Main area — chat + showcase */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Chat column */}
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxWidth: "640px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 24px 0",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {visibleMessages.map((message) => (
              <div key={message.id}>
                {message.parts.map((part, i) => {
                  // Text bubble
                  if (part.type === "text" && (part as { type: "text"; text: string }).text) {
                    const text = (part as { type: "text"; text: string }).text;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent:
                            message.role === "user" ? "flex-end" : "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "85%",
                            padding: "12px 16px",
                            borderRadius:
                              message.role === "user"
                                ? "18px 18px 4px 18px"
                                : "4px 18px 18px 18px",
                            background:
                              message.role === "user" ? "#e8d44d" : "#1a1a1a",
                            color: message.role === "user" ? "#0a0a0a" : "#e8e8e8",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {text}
                        </div>
                      </div>
                    );
                  }

                  // Product cards tool result
                  if (
                    part.type.startsWith("tool-") &&
                    (part as { state?: string }).state === "output-available"
                  ) {
                    const invocation = part as {
                      type: string;
                      state: string;
                      output?: { productIds?: string[]; headline?: string; youtubeId?: string; title?: string };
                    };

                    if (
                      part.type === "tool-showProducts" &&
                      invocation.output?.productIds
                    ) {
                      const foundProducts = getProductsByIds(
                        invocation.output.productIds
                      );
                      return (
                        <div key={i} style={{ marginBottom: "12px" }}>
                          {invocation.output.headline && (
                            <p
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                color: "#e8d44d",
                                textTransform: "uppercase",
                                marginBottom: "12px",
                              }}
                            >
                              {invocation.output.headline}
                            </p>
                          )}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                foundProducts.length === 1
                                  ? "1fr"
                                  : "repeat(auto-fill, minmax(200px, 1fr))",
                              gap: "12px",
                            }}
                          >
                            {foundProducts.map((product) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                featured={foundProducts.length === 1}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (
                      part.type === "tool-showVideo" &&
                      invocation.output?.youtubeId
                    ) {
                      return (
                        <div
                          key={i}
                          style={{
                            marginBottom: "12px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#1a1a1a",
                            border: "1px solid #252525",
                          }}
                        >
                          {invocation.output.title && (
                            <p
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                color: "#e8d44d",
                                textTransform: "uppercase",
                                padding: "12px 14px 8px",
                              }}
                            >
                              {invocation.output.title}
                            </p>
                          )}
                          <div
                            style={{
                              position: "relative",
                              paddingBottom: "56.25%",
                              height: 0,
                            }}
                          >
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${invocation.output.youtubeId}?rel=0&modestbranding=1`}
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
                              title={invocation.output.title ?? "Guitar demo"}
                            />
                          </div>
                        </div>
                      );
                    }
                  }

                  return null;
                })}
              </div>
            ))}

            {/* Typing indicator */}
            {isStreaming && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "4px 18px 18px 18px",
                    background: "#1a1a1a",
                    display: "flex",
                    gap: "4px",
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
                        animation: "pulse 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} style={{ paddingBottom: "24px" }} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "16px 24px 24px",
              borderTop: "1px solid #1a1a1a",
              flexShrink: 0,
            }}
          >
            {/* Chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => submit(chip.prompt)}
                  disabled={isStreaming}
                  style={{
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    color: "#8a8a8a",
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
                    e.currentTarget.style.color = "#8a8a8a";
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Text input */}
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
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
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
