"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Comic {
  id: number;
  comic_name: string;
  author: string;
  issue: number;
  created_at: string;
  cover_url: string | null;
}

export default function ComicReader() {
  const { id } = useParams();
  const router = useRouter();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComic() {
      const { data } = await supabase
        .from("ComicsINDIA")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setComic(data);
      setLoading(false);
    }
    fetchComic();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "3px solid #ff6b35", borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  if (!comic) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,0.3)", fontFamily: "sans-serif",
      }}>
        <div style={{ fontSize: 40 }}>📭</div>
        <div style={{ marginTop: 8 }}>Comic not found</div>
        <button onClick={() => router.back()} style={{
          marginTop: 16, padding: "8px 20px", borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white", cursor: "pointer", fontSize: 13,
        }}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "sans-serif", color: "white",
    }}>
      {/* Top bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white", borderRadius: 999,
            padding: "6px 16px", cursor: "pointer",
            fontSize: 13, fontWeight: 700,
          }}
        >
          ← Back
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>{comic.comic_name}</div>
          <div style={{ color: "#ff6b35", fontSize: 12, fontWeight: 600 }}>
            Issue {comic.issue} · by {comic.author}
          </div>
        </div>

        <div style={{ width: 80 }} />
      </div>

      {/* Comic content */}
      <div style={{
        maxWidth: 800, margin: "0 auto", padding: "32px 16px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      }}>
        {comic.cover_url ? (
          <img
            src={comic.cover_url}
            alt={comic.comic_name}
            style={{
              width: "100%", maxWidth: 720,
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", maxWidth: 720, height: 500,
            borderRadius: 12, background: "#1a1a2e",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(255,255,255,0.1)", fontSize: 80, fontWeight: 900,
          }}>
            {comic.comic_name?.charAt(0)}
          </div>
        )}

        <div style={{
          marginTop: 24, textAlign: "center",
          color: "rgba(255,255,255,0.3)", fontSize: 12,
        }}>
          {new Date(comic.created_at).toLocaleDateString("en-IN", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
