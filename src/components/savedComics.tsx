"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { type Card } from "@/components/comicUI";

interface SavedComicsProps {
  comics: Card[];
  selectedId: number | null;
  onSelect: (card: Card | null) => void;
}

export default function SavedComics({ comics, selectedId, onSelect }: SavedComicsProps) {
  const colors = ["#1a1a2e", "#2d1b00", "#0d2137", "#1a0a2e", "#002200", "#1a0000", "#001a1a"];
  const selected = comics.find((c) => c.id === selectedId) ?? null;
  const router = useRouter();

  if (comics.length === 0) {
    return (
      <div style={{
        padding: "20px",
        borderRadius: 16,
        border: "1px dashed rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.2)",
        fontFamily: "sans-serif",
        fontSize: 13,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>📚</div>
        Swipe right to save comics here
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>

      {/* Expanded detail view */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              marginBottom: 16,
              borderRadius: 20,
              overflow: "hidden",
              background: `linear-gradient(145deg, ${colors[selected.id % colors.length]}, #111)`,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Cover — clickable preview */}
            <div
              onClick={() => router.push(`/comic/${selected.id}`)}
              style={{
                width: "100%", height: 200,
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {selected.cover_url ? (
                <>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `url(${selected.cover_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 0.3s ease",
                  }} />
                  {/* Hover overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = "0";
                    }}
                  >
                    <span style={{
                      color: "white", fontSize: 13, fontWeight: 800,
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      padding: "8px 18px", borderRadius: 999,
                      backdropFilter: "blur(8px)",
                    }}>
                      👁 Preview
                    </span>
                  </div>
                </>
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(135deg, ${colors[selected.id % colors.length]}, #222)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontSize: 80, opacity: 0.15, fontWeight: 900,
                    color: "white", textTransform: "uppercase",
                  }}>
                    {selected.comic_name?.charAt(0)}
                  </span>
                </div>
              )}

              {/* "Click to preview" label at bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "8px 14px",
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                color: "rgba(255,255,255,0.4)",
                fontSize: 11, fontWeight: 600,
                textAlign: "center",
              }}>
                Click to preview →
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "16px 20px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ color: "white", fontWeight: 900, fontSize: 20, margin: 0 }}>
                    {selected.comic_name}
                  </h3>
                  <p style={{ color: "#ff6b35", fontWeight: 700, fontSize: 12, margin: "4px 0 0" }}>
                    by {selected.author}
                  </p>
                </div>
                <button
                  onClick={() => onSelect(null)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                    borderRadius: 999, width: 28, height: 28,
                    cursor: "pointer", fontSize: 12, flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <Tag label={`Issue ${selected.issue}`} color="#ff6b35" />
                <Tag label={new Date(selected.created_at).toLocaleDateString()} color="#888" />
              </div>

              {/* Read Now button → navigates to comic page */}
              <button
                onClick={() => router.push(`/comic/${selected.id}`)}
                style={{
                  marginTop: 14, width: "100%",
                  padding: "10px", borderRadius: 12,
                  background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                  border: "none", color: "white",
                  fontWeight: 800, fontSize: 14,
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(255,107,53,0.3)",
                }}
              >
                Read Now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved label */}
      <div style={{
        color: "rgba(255,255,255,0.3)", fontSize: 11,
        fontWeight: 700, letterSpacing: 2,
        textTransform: "uppercase", marginBottom: 10,
      }}>
        ♥ Saved · {comics.length}
      </div>

      {/* Grid of saved cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 10,
      }}>
        {comics.map((comic) => (
          <SavedCard
            key={comic.id}
            comic={comic}
            isSelected={selectedId === comic.id}
            color={colors[comic.id % colors.length]}
            onClick={() => onSelect(selectedId === comic.id ? null : comic)}
          />
        ))}
      </div>
    </div>
  );
}

function SavedCard({
  comic,
  isSelected,
  color,
  onClick,
}: {
  comic: Card;
  isSelected: boolean;
  color: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.04 : 1, y: hovered ? -3 : 0 }}
      transition={{ duration: 0.15 }}
      style={{
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        border: isSelected
          ? "2px solid #ff6b35"
          : "2px solid rgba(255,255,255,0.06)",
        background: `linear-gradient(145deg, ${color}, #111)`,
        boxShadow: isSelected
          ? "0 8px 30px rgba(255,107,53,0.25)"
          : hovered
          ? "0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Mini cover — shows image if available */}
      <div style={{
        width: "100%", height: 80,
        position: "relative", overflow: "hidden",
      }}>
        {comic.cover_url ? (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${comic.cover_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${color}, #222)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: 32, opacity: 0.2, fontWeight: 900,
              color: "white", textTransform: "uppercase",
            }}>
              {comic.comic_name?.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Label */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div style={{
          color: "white", fontWeight: 800, fontSize: 11,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {comic.comic_name}
        </div>
        <div style={{ color: "#ff6b35", fontSize: 10, marginTop: 3, fontWeight: 700 }}>
          Issue {comic.issue}
        </div>
      </div>
    </motion.div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      color,
    }}>
      {label}
    </span>
  );
}