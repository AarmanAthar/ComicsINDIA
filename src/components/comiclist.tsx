"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Comic {
  id: number;
  created_at: string;
  issue: number;
  comic_name: string;
  author: string;
}

export default function ComicList() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Comic | null>(null);

  useEffect(() => {
    async function fetchComics(): Promise<void> {
      const { data, error } = await supabase
        .from("ComicsINDIA")   // ← exact table name from your screenshot
        .select("*")
        .returns<Comic[]>();

      if (error) console.error("Supabase error:", error.message);
      if (data) setComics(data);
      setLoading(false);
    }
    fetchComics();
  }, []);

  if (loading) return <Spinner />;
  if (comics.length === 0) return <Empty />;

  return (
    <div style={{ fontFamily: "sans-serif", width: "100%" }}>
      {selected && (
        <DetailPanel comic={selected} onClose={() => setSelected(null)} />
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 12,
      }}>
        {comics.map((comic) => (
          <ComicCard
            key={comic.id}
            comic={comic}
            isSelected={selected?.id === comic.id}
            onClick={() => setSelected(selected?.id === comic.id ? null : comic)}
          />
        ))}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 300, gap: 12, flexDirection: "column",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid #ff6b35", borderTopColor: "transparent",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
        Loading comics...
      </span>
    </div>
  );
}

function Empty() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 300, flexDirection: "column", gap: 8,
      color: "rgba(255,255,255,0.2)", fontFamily: "sans-serif",
    }}>
      <span style={{ fontSize: 40 }}>📭</span>
      <span style={{ fontSize: 14 }}>No comics found</span>
    </div>
  );
}

function DetailPanel({
  comic,
  onClose,
}: {
  comic: Comic;
  onClose: () => void;
}) {
  return (
    <div style={{
      marginBottom: 20,
      borderRadius: 20,
      overflow: "hidden",
      background: "linear-gradient(145deg, #1a1a2e, #111)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    }}>
      {/* Cover placeholder using first letter */}
      <div style={{
        width: "100%", height: 180,
        background: "linear-gradient(135deg, #1a1a2e, #222)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 72, opacity: 0.2, fontWeight: 900, color: "white" }}>
          {comic.comic_name?.charAt(0)}
        </span>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: "white", fontWeight: 900, fontSize: 22, margin: 0 }}>
              {comic.comic_name}
            </h2>
            {comic.author && (
              <p style={{ color: "#ff6b35", fontWeight: 700, fontSize: 13, margin: "4px 0 0" }}>
                by {comic.author}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              borderRadius: 999, width: 30, height: 30,
              cursor: "pointer", fontSize: 14, flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <Tag label={`Issue ${comic.issue}`} color="#ff6b35" />
          <Tag label={new Date(comic.created_at).toLocaleDateString()} color="#888" />
        </div>
      </div>
    </div>
  );
}

function ComicCard({
  comic,
  isSelected,
  onClick,
}: {
  comic: Comic;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        border: isSelected
          ? "2px solid #ff6b35"
          : "2px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(145deg, #1a1a2e, #111)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "transform 0.18s ease, border 0.15s ease",
        boxShadow: hovered
          ? "0 12px 30px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.3)",
      }}
    >
      {/* Cover placeholder */}
      <div style={{
        width: "100%", height: 110,
        background: "linear-gradient(135deg, #1a1a2e, #222)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 44, opacity: 0.18, fontWeight: 900, color: "white" }}>
          {comic.comic_name?.charAt(0)}
        </span>
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{
          color: "white", fontWeight: 800, fontSize: 13,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {comic.comic_name}
        </div>
        {comic.author && (
          <div style={{
            color: "rgba(255,255,255,0.35)", fontSize: 11,
            marginTop: 3, fontWeight: 600,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {comic.author}
          </div>
        )}
        <div style={{ color: "#ff6b35", fontSize: 11, marginTop: 5, fontWeight: 700 }}>
          Issue {comic.issue}
        </div>
      </div>
    </div>
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