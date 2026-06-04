"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState, lazy, Suspense, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ProductCard from "./ProductCard";
import { BrandButtons, BandButtons } from "./BrandSuggestions";
import { getProductsByIds, type Product } from "@/lib/products";

const ProductModal = lazy(() => import("./ProductModal"));

// ─── Types ────────────────────────────────────────────────────────────────────

type FlowMode = "chip-brand" | "chip-band" | "chip-experience" | "quiz" | null;
type QuizStage = "experience" | "venue" | "budget" | "band_brand" | "done";

interface QuizAnswers {
  experience?: string;
  venue?: string;
  budget?: string;
  bandBrand?: string;
}

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  quizStage?: QuizStage;
}

// ─── Quiz config ──────────────────────────────────────────────────────────────

const QUIZ = [
  {
    stage: "experience" as QuizStage,
    question: "How long have you been playing?",
    options: [
      { label: "Just started", icon: "○", value: "complete beginner" },
      { label: "A few years in", icon: "◑", value: "a few years of experience" },
      { label: "Gigging musician", icon: "●", value: "experienced gigging musician" },
      { label: "Decades deep", icon: "★", value: "many years — very experienced" },
    ],
  },
  {
    stage: "venue" as QuizStage,
    question: "Where do you mainly play?",
    options: [
      { label: "On stage", icon: "▲", value: "performing live on stage" },
      { label: "In the studio", icon: "◈", value: "recording in a studio" },
      { label: "In the garage", icon: "⬡", value: "jamming in the garage" },
      { label: "In the bedroom", icon: "◎", value: "bedroom player at home" },
    ],
  },
  {
    stage: "budget" as QuizStage,
    question: "What's your budget?",
    options: [
      { label: "Under £600", icon: "·", value: "budget under £600" },
      { label: "£600 – £1,000", icon: "··", value: "budget £600–£1,000" },
      { label: "£1,000 – £1,500", icon: "···", value: "budget £1,000–£1,500" },
      { label: "£1,500+", icon: "····", value: "budget over £1,500" },
    ],
  },
  {
    stage: "band_brand" as QuizStage,
    question: "Favourite band or brand? (skip if unsure)",
    isText: true,
  },
];

const CHIP_MAP: Record<string, FlowMode> = {
  "I want to find guitars based on my favourite band": "chip-band",
  "I already have a favourite guitar brand in mind": "chip-brand",
  "Help me find a guitar based on my experience and budget": "chip-experience",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuitarFinder({
  initialInput,
  onClose,
}: {
  initialInput?: string;
  onClose: () => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({ transport });

  const [flowMode, setFlowMode] = useState<FlowMode>(null);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [quizStage, setQuizStage] = useState<QuizStage | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({});
  const [bandInput, setBandInput] = useState("");
  const [input, setInput] = useState("");
  const [venue, setVenue] = useState<string | undefined>();

  // Suggestion state — shown after first Claude response in chip flows
  const [showSuggestions, setShowSuggestions] = useState(false);
  const prevMsgCount = useRef(0);

  // Modal
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const didInit = useRef(false);

  const isStreaming = status === "streaming";

  // Show suggestions after first assistant reply in chip flows
  useEffect(() => {
    const count = messages.filter((m) => m.role === "assistant").length;
    if (count > prevMsgCount.current && (flowMode === "chip-brand" || flowMode === "chip-band" || flowMode === "chip-experience")) {
      if (count === 1 && !showSuggestions) setShowSuggestions(true);
    }
    prevMsgCount.current = count;
  }, [messages, flowMode, showSuggestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, localMessages, quizStage, showSuggestions]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (didInit.current || !initialInput) return;
    didInit.current = true;
    const mode = CHIP_MAP[initialInput];
    if (mode) {
      startChipFlow(initialInput, mode);
    } else {
      startQuizFlow(initialInput);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startChipFlow(prompt: string, mode: FlowMode) {
    setFlowMode(mode);
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] });
  }

  function startQuizFlow(userText: string) {
    setFlowMode("quiz");
    const id = Date.now().toString();
    setLocalMessages([
      { id: `u-${id}`, role: "user", text: userText },
      { id: `a-${id}`, role: "assistant", text: QUIZ[0].question, quizStage: "experience" },
    ]);
    setQuizStage("experience");
  }

  function selectQuizOption(stageId: QuizStage, optionValue: string, optionLabel: string) {
    const newAnswers = { ...quizAnswers, [stageId]: optionValue };
    if (stageId === "venue") setVenue(optionValue);
    setQuizAnswers(newAnswers);

    const nextIndex = QUIZ.findIndex((q) => q.stage === stageId) + 1;
    const id = Date.now().toString();

    setLocalMessages((prev) => [...prev, { id: `u-${id}`, role: "user", text: optionLabel }]);

    if (nextIndex < QUIZ.length) {
      const next = QUIZ[nextIndex];
      setTimeout(() => {
        setLocalMessages((prev) => [...prev, { id: `a-${id}`, role: "assistant", text: next.question, quizStage: next.stage }]);
        setQuizStage(next.stage);
      }, 300);
    } else {
      setQuizStage("done");
      submitQuizToAgent(newAnswers, "");
    }
  }

  function submitBandBrand(value: string) {
    const newAnswers = { ...quizAnswers, bandBrand: value || undefined };
    const id = Date.now().toString();
    if (value) setLocalMessages((prev) => [...prev, { id: `u-${id}`, role: "user", text: value }]);
    setQuizStage("done");
    submitQuizToAgent(newAnswers, value);
  }

  function submitQuizToAgent(answers: QuizAnswers, bandBrand: string) {
    const parts: string[] = [];
    if (answers.experience) parts.push(answers.experience);
    if (answers.venue) parts.push(answers.venue);
    if (answers.budget) parts.push(answers.budget);
    const band = bandBrand || answers.bandBrand;
    if (band) parts.push(`favourite band/brand: ${band}`);
    const firstUserMsg = localMessages.find((m) => m.role === "user");
    const contextLine = firstUserMsg ? `The customer said: "${firstUserMsg.text}". ` : "";
    const prompt = `${contextLine}Their profile: ${parts.join(", ")}. Please recommend the best guitars for them straight away using showProducts.`;
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] });
  }

  function submitSuggestion(value: string) {
    setShowSuggestions(false);
    sendMessage({ role: "user", parts: [{ type: "text", text: value }] });
  }

  function submitInput(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isStreaming) return;
    setInput("");
    if (flowMode === null) {
      const mode = CHIP_MAP[value];
      if (mode) { startChipFlow(value, mode); return; }
      startQuizFlow(value);
      return;
    }
    sendMessage({ role: "user", parts: [{ type: "text", text: value }] });
  }

  const activeQuiz = quizStage && quizStage !== "done"
    ? QUIZ.find((q) => q.stage === quizStage) ?? null
    : null;

  const contextChips = getContextChips(messages, flowMode, quizStage, showSuggestions);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VinylIcon />
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", fontWeight: 700, color: "#e8d44d", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            B-Side Guitar Finder
          </span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#5a5a5a", fontSize: "18px", cursor: "pointer", padding: "4px 8px" }} aria-label="Close">✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {flowMode === null && (
          <AssistantRow>
            <TextBubble text="Hey! I'm B-Side's guitar expert. Tell me about the music you play, a band you love, or what you want to spend — and I'll find you the perfect guitar." />
          </AssistantRow>
        )}

        {/* Local quiz messages */}
        {localMessages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <UserBubble text={msg.text} />
            </div>
          ) : (
            <AssistantRow key={msg.id}><TextBubble text={msg.text} /></AssistantRow>
          )
        )}

        {/* Claude API messages */}
        {messages.map((message) => {
          if (message.role === "user") {
            if (flowMode?.startsWith("chip-")) {
              const text = message.parts.filter((p) => p.type === "text").map((p) => (p as { type: "text"; text: string }).text).join("\n");
              if (!text || Object.keys(CHIP_MAP).includes(text)) return null;
              return (
                <div key={message.id} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <UserBubble text={text} />
                </div>
              );
            }
            return null;
          }

          const elements: React.ReactNode[] = [];
          let textBuffer = "";

          const flushText = (key: string) => {
            if (!textBuffer.trim()) return;
            elements.push(<AssistantRow key={key}><TextBubble text={textBuffer.trim()} /></AssistantRow>);
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
              const inv = part as { type: string; state?: string; output?: { productIds?: string[]; headline?: string; youtubeId?: string; title?: string } };
              if (inv.state !== "output-available") return;
              flushText(`text-${key}`);

              if (part.type === "tool-showProducts" && inv.output?.productIds) {
                const found = getProductsByIds(inv.output.productIds);
                const isMultiple = found.length > 1;
                elements.push(
                  <div key={key}>
                    {inv.output.headline && (
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8d44d", textTransform: "uppercase", marginBottom: "10px" }}>
                        {inv.output.headline}
                      </p>
                    )}
                    {isMultiple ? (
                      /* Horizontal scrollable carousel */
                      <div style={{ display: "flex", gap: "12px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "8px", marginRight: "-24px", paddingRight: "24px" }}>
                        {found.map((p) => (
                          <div key={p.id} style={{ scrollSnapAlign: "start", minWidth: "220px", maxWidth: "220px" }}>
                            <ProductCard product={p} venue={venue} onClick={() => setModalProduct(p)} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ProductCard product={found[0]} venue={venue} featured onClick={() => setModalProduct(found[0])} />
                    )}
                  </div>
                );
              }

              if (part.type === "tool-showVideo" && inv.output?.youtubeId) {
                elements.push(
                  <div key={key} style={{ borderRadius: "12px", overflow: "hidden", background: "#141414", border: "1px solid #252525" }}>
                    {inv.output.title && (
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#e8d44d", textTransform: "uppercase", padding: "12px 14px 8px" }}>
                        {inv.output.title}
                      </p>
                    )}
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${inv.output.youtubeId}?rel=0&modestbranding=1`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
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

        {/* Streaming indicator */}
        {isStreaming && (
          <AssistantRow>
            <div style={{ padding: "12px 16px", borderRadius: "4px 18px 18px 18px", background: "#1a1a1a", display: "flex", gap: "5px", alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6b6b6b", display: "inline-block", animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </AssistantRow>
        )}

        {/* Brand / band suggestion buttons after chip follow-up */}
        {showSuggestions && !isStreaming && (
          <div style={{ paddingTop: "4px" }}>
            {flowMode === "chip-brand" && <BrandButtons onSelect={(b) => submitSuggestion(b)} />}
            {flowMode === "chip-band" && <BandButtons onSelect={(b) => submitSuggestion(b)} />}
            {flowMode === "chip-experience" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  { label: "Just started", value: "I'm a complete beginner" },
                  { label: "A few years in", value: "I've been playing a few years" },
                  { label: "Gigging musician", value: "I'm an experienced gigging musician" },
                  { label: "Decades deep", value: "I've been playing for decades" },
                ].map((o) => (
                  <SuggestionPill key={o.label} label={o.label} onClick={() => submitSuggestion(o.value)} />
                ))}
              </div>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ borderTop: "1px solid #1a1a1a", flexShrink: 0, maxWidth: "680px", width: "100%", margin: "0 auto", boxSizing: "border-box", padding: "14px 24px 20px" }}>
        {/* Active quiz question */}
        {activeQuiz && !isStreaming && (
          <div style={{ marginBottom: "16px" }}>
            {activeQuiz.isText ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  autoFocus
                  value={bandInput}
                  onChange={(e) => setBandInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitBandBrand(bandInput)}
                  placeholder="e.g. Radiohead, Fender, John Mayer..."
                  style={{ flex: 1, background: "#111", border: "1px solid #252525", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "16px", outline: "none", caretColor: "#e8d44d" }}
                />
                <button onClick={() => submitBandBrand(bandInput)} style={{ background: "#e8d44d", color: "#0a0a0a", border: "none", borderRadius: "10px", padding: "12px 18px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                  Find →
                </button>
                <button onClick={() => submitBandBrand("")} style={{ background: "transparent", color: "#5a5a5a", border: "1px solid #252525", borderRadius: "10px", padding: "12px 14px", fontSize: "12px", cursor: "pointer" }}>
                  Skip
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {activeQuiz.options?.map((opt) => (
                  <QuizCard key={opt.value} icon={opt.icon} label={opt.label} onClick={() => selectQuizOption(activeQuiz.stage, opt.value, opt.label)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Context chips */}
        {!activeQuiz && !showSuggestions && contextChips.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {contextChips.map((chip) => (
              <SuggestionPill key={chip.label} label={chip.label} onClick={() => submitInput(chip.prompt)} disabled={isStreaming} />
            ))}
          </div>
        )}

        {/* Text input */}
        {!activeQuiz && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", background: "#111", border: "1px solid #252525", borderRadius: "12px", padding: "4px 4px 4px 16px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submitInput()}
              placeholder={flowMode === null ? "What kind of guitarist are you?" : "Ask anything..."}
              disabled={isStreaming}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px", padding: "10px 0", caretColor: "#e8d44d" }}
            />
            <button
              onClick={() => submitInput()}
              disabled={!input.trim() || isStreaming}
              style={{ background: input.trim() && !isStreaming ? "#e8d44d" : "#1e1e1e", color: input.trim() && !isStreaming ? "#0a0a0a" : "#3a3a3a", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "13px", fontWeight: 700, cursor: input.trim() && !isStreaming ? "pointer" : "not-allowed", transition: "all 0.15s", flexShrink: 0 }}
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Product modal */}
      {modalProduct && (
        <Suspense fallback={null}>
          <ProductModal product={modalProduct} venue={venue} onClose={() => setModalProduct(null)} />
        </Suspense>
      )}

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SuggestionPill({ label, onClick, disabled }: { label: string; prompt?: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: "transparent", border: "1px solid #252525", color: "#7a7a7a", fontSize: "12px", padding: "6px 14px", borderRadius: "20px", cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "#e8d44d"; e.currentTarget.style.color = "#e8d44d"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#252525"; e.currentTarget.style.color = "#7a7a7a"; }}
    >
      {label}
    </button>
  );
}

function QuizCard({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "#1e1e1e" : "#141414", border: `1px solid ${hovered ? "#e8d44d" : "#252525"}`, borderRadius: "12px", padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <span style={{ fontSize: "18px", color: hovered ? "#e8d44d" : "#4a4a4a", lineHeight: 1, transition: "color 0.15s" }}>{icon}</span>
      <span style={{ fontSize: "13px", fontWeight: 600, color: hovered ? "#ffffff" : "#b0b0b0", transition: "color 0.15s" }}>{label}</span>
    </button>
  );
}

function AssistantRow({ children }: { children: ReactNode }) {
  return <div style={{ display: "flex", justifyContent: "flex-start" }}>{children}</div>;
}

function UserBubble({ text }: { text: string }) {
  return (
    <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "18px 18px 4px 18px", background: "#e8d44d", color: "#0a0a0a", fontSize: "14px", lineHeight: 1.6 }}>
      {text}
    </div>
  );
}

function TextBubble({ text }: { text: string }) {
  return (
    <div style={{ maxWidth: "85%", padding: "12px 16px", borderRadius: "4px 18px 18px 18px", background: "#1a1a1a", color: "#d0d0d0", fontSize: "14px", lineHeight: 1.65 }}>
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

function getContextChips(
  messages: ReturnType<typeof useChat>["messages"],
  flowMode: FlowMode,
  quizStage: QuizStage | null,
  showSuggestions: boolean
): { label: string; prompt: string }[] {
  if (quizStage && quizStage !== "done") return [];
  if (showSuggestions) return [];
  if (messages.length === 0) return [];

  const last = [...messages].reverse().find((m) => m.role === "assistant");
  if (!last) return [];

  const text = last.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join(" ")
    .toLowerCase();

  if (text.includes("budget") || text.includes("spend")) {
    return [
      { label: "Under £600", prompt: "My budget is under £600" },
      { label: "£600–£1,000", prompt: "Budget is £600–£1,000" },
      { label: "£1,000–£1,500", prompt: "Budget is £1,000–£1,500" },
    ];
  }
  if (messages.length >= 4) {
    return [
      { label: "Show me a demo", prompt: "Can I see a video demo of your top pick?" },
      { label: "Something cheaper", prompt: "Do you have anything cheaper?" },
      { label: "Ready to buy", prompt: "I'm ready to buy — what's next?" },
    ];
  }
  return [];
}

