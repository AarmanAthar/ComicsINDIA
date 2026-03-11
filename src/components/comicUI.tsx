"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Card {
  id: number;
  comic_name: string;
  author: string;
  issue: number;
  created_at: string;
  cover_url: string | null;
  cover_image_url: string | null;
}

export type { Card };

function SwipeCard({
  card,
  onSwipe,
  isTop,
  index,
}: {
  card: Card;
  onSwipe: (id: number, dir: "left" | "right") => void;
  isTop: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const saveOpacity = useTransform(x, [30, 120], [0, 1]);
  const skipOpacity = useTransform(x, [-120, -30], [1, 0]);

  const handleDragEnd = (_: never, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) onSwipe(card.id, "right");
    else if (info.offset.x < -100) onSwipe(card.id, "left");
  };

  const colors = ["#1a1a2e", "#2d1b00", "#0d2137", "#1a0a2e", "#002200", "#1a0000", "#001a1a"];
  const color = colors[card.id % colors.length];

  // Prefer cover_image_url (thumbnail), fall back to cover_url (works for PNGs)
  const isPDF = (url: string | null) => url?.toLowerCase().includes(".pdf") ?? false;
  const imageUrl = card.cover_image_url ?? (isPDF(card.cover_url) ? null : card.cover_url);

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale: 1 - index * 0.05,
        y: index * 12,
        zIndex: 10 - index,
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `linear-gradient(145deg, ${color}, #111)`,
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        cursor: isTop ? "grab" : "default",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        userSelect: "none",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
    >
      {/* Cover image or PDF placeholder or initial letter */}
      {imageUrl ? (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }} />
        </div>
      ) : isPDF(card.cover_url) ? (
        // PDF with no thumbnail — show a stylised placeholder
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(145deg, ${color}, #0a0a0a)`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{ fontSize: 64, opacity: 0.6 }}>📄</div>
          <div style={{
            color: "rgba(255,255,255,0.2)", fontSize: 12,
            fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
          }}>
            PDF Comic
          </div>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%)",
          }} />
        </div>
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 120, opacity: 0.08, fontWeight: 900,
            color: "white", textTransform: "uppercase",
          }}>
            {card.comic_name?.charAt(0)}
          </span>
        </div>
      )}

      {/* SAVE stamp */}
      {isTop && (
        <motion.div style={{
          opacity: saveOpacity,
          position: "absolute", top: 32, left: 24,
          border: "4px solid #39ff14", color: "#39ff14",
          borderRadius: 8, padding: "4px 14px",
          fontFamily: "sans-serif", fontWeight: 900,
          fontSize: 34, letterSpacing: 4,
          transform: "rotate(-15deg)",
          zIndex: 20,
        }}>
          SAVE
        </motion.div>
      )}

      {/* SKIP stamp */}
      {isTop && (
        <motion.div style={{
          opacity: skipOpacity,
          position: "absolute", top: 32, right: 24,
          border: "4px solid #ff4444", color: "#ff4444",
          borderRadius: 8, padding: "4px 14px",
          fontFamily: "sans-serif", fontWeight: 900,
          fontSize: 34, letterSpacing: 4,
          transform: "rotate(15deg)",
          zIndex: 20,
        }}>
          SKIP
        </motion.div>
      )}

      {/* Info */}
      <div style={{ position: "relative", zIndex: 10, padding: 28 }}>
        <div style={{ color: "white", fontFamily: "sans-serif", fontWeight: 800, fontSize: 32 }}>
          {card.comic_name}
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif", fontSize: 16, marginTop: 4 }}>
          by {card.author}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-block",
            padding: "3px 12px", borderRadius: 999,
            background: "rgba(255,107,53,0.15)",
            border: "1px solid rgba(255,107,53,0.4)",
            color: "#ff6b35", fontSize: 14, fontWeight: 700,
          }}>
            Issue {card.issue}
          </div>
          {isPDF(card.cover_url) && (
            <div style={{
              display: "inline-block",
              padding: "3px 12px", borderRadius: 999,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700,
            }}>
              PDF
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface TinderCardsProps {
  onSave?: (card: Card) => void;
}

export default function TinderCards({ onSave }: TinderCardsProps) {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [savedComics, setSavedComics] = useState<Card[]>([]);
  const [history, setHistory] = useState<{ id: number; dir: "left" | "right" }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchComics(): Promise<void> {
    const { data, error } = await supabase
      .from("ComicsINDIA")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<Card[]>();

    if (error) {
      console.error("Supabase error:", error.message);
      setError(error.message);
    }
    if (data) {
      // Deduplicate by id just in case
      const seen = new Set<number>();
      const unique = data.filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      setAllCards(unique);
      setCards(unique);
    }
    setLoading(false);
  }
  fetchComics();
}, []);

  const handleSwipe = (id: number, dir: "left" | "right") => {
    const card = cards.find((c) => c.id === id);
    if (dir === "right" && card) {
      setSavedComics((prev) =>
        prev.some((c) => c.id === card.id) ? prev : [...prev, card]
      );
      onSave?.(card);
    }
    setHistory((h) => [...h, { id, dir }]);
    setCards((c) => c.filter((c) => c.id !== id));
  };

  const handleUndo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    const restored = allCards.find((c) => c.id === last.id);
    if (restored) {
      if (last.dir === "right") setSavedComics((prev) => prev.filter((c) => c.id !== last.id));
      setCards((c) => [restored, ...c]);
      setHistory((h) => h.slice(0, -1));
    }
  };

  const handleReset = () => {
    setCards(allCards);
    setHistory([]);
    setSavedComics([]);
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: 460, gap: 12, fontFamily: "sans-serif",
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #ff6b35", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Loading comics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: 460, gap: 8, fontFamily: "sans-serif", color: "#ff4444",
      }}>
        <span style={{ fontSize: 36 }}>⚠️</span>
        <span style={{ fontSize: 13 }}>Failed to load: {error}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "sans-serif", padding: 16,
    }}>
      <h2 style={{ color: "white", fontSize: 22, fontWeight: 900, marginBottom: 32, letterSpacing: 2 }}>
        Your Feed
      </h2>

      <div style={{ position: "relative", width: 420, height: 580, marginBottom: 40 }}>
        <AnimatePresence>
          {cards.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "absolute", inset: 0, display: "flex",
                flexDirection: "column", alignItems: "center",
                justifyContent: "center", color: "rgba(255,255,255,0.3)",
                fontSize: 16, gap: 12,
              }}
            >
              <div style={{ fontSize: 48 }}>🎉</div>
              <div>You&apos;ve seen everything!</div>
              {savedComics.length > 0 && (
                <div style={{ color: "#39ff14", fontSize: 13, fontWeight: 700 }}>
                  ♥ {savedComics.length} comic{savedComics.length > 1 ? "s" : ""} saved
                </div>
              )}
              <button
                onClick={handleReset}
                style={{
                  marginTop: 8, padding: "10px 24px", borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700,
                }}
              >
                Start Over ↺
              </button>
            </motion.div>
          ) : (
            [...cards].reverse().map((card, reversedIdx) => {
              const index = cards.length - 1 - reversedIdx;
              const isTop = reversedIdx === cards.length - 1;
              return (
                <SwipeCard
                  key={`card-${card.id}-${reversedIdx}`}
                  card={card}
                  onSwipe={handleSwipe}
                  isTop={isTop}
                  index={index}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <ActionButton onClick={handleUndo} disabled={!history.length} color="#aaa" label="↩ Undo" />
        <ActionButton
          onClick={() => cards[0] && handleSwipe(cards[0].id, "left")}
          disabled={!cards.length} color="#ff4444" label="✕ Skip" size="lg"
        />
        <ActionButton
          onClick={() => cards[0] && handleSwipe(cards[0].id, "right")}
          disabled={!cards.length} color="#39ff14" label="♥ Save" size="lg"
        />
      </div>

      {savedComics.length > 0 && (
        <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 340 }}>
          {savedComics.map((card) => (
            <span key={card.id} style={{
              padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
              background: "rgba(57,255,20,0.1)",
              border: "1px solid rgba(57,255,20,0.3)",
              color: "#39ff14",
            }}>
              ♥ {card.comic_name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  onClick, disabled, color, label, size = "sm",
}: {
  onClick: () => void;
  disabled: boolean;
  color: string;
  label: string;
  size?: "sm" | "lg";
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.08, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: size === "lg" ? "14px 28px" : "10px 20px",
        borderRadius: 999,
        border: `2px solid ${disabled ? "#333" : color}`,
        background: disabled ? "transparent" : `${color}18`,
        color: disabled ? "#444" : color,
        fontWeight: 800,
        fontSize: size === "lg" ? 16 : 13,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: !disabled ? `0 4px 20px -4px ${color}44` : "none",
      }}
    >
      {label}
    </motion.button>
  );
}