"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TinderCards, { type Card } from "@/components/comicUI";
import AddButton from "@/components/uploadButton";
import SavedComics from "@/components/savedComics";
import AuthButton from "@/components/Authbutton";
import { useAuth } from "@/lib/auth";
import { saveComic, fetchSavedComics } from "@/lib/savedComics";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedComics, setSavedComics] = useState<Card[]>([]);
  const [selectedComic, setSelectedComic] = useState<Card | null>(null);

  // Load saved comics from Supabase when user logs in
  useEffect(() => {
    if (!user) {
      setSavedComics([]);
      return;
    }
    fetchSavedComics(user.id).then((ids) => {
      if (ids.length === 0) return;
      supabase
        .from("ComicsINDIA")
        .select("*")
        .in("id", ids)
        .then(({ data }) => {
          if (data) setSavedComics(data as Card[]);
        });
    });
  }, [user]);

  const handleSave = (card: Card) => {
    setSavedComics((prev) =>
      prev.some((c) => c.id === card.id) ? prev : [...prev, card]
    );
    if (user) saveComic(user.id, card.id);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-8 relative">

      {/* Auth button — top right */}
      <div className="fixed top-6 right-8 z-50">
        <AuthButton />
      </div>

      <div className="fixed bottom-8 right-20 z-50">
        <AddButton />
      </div>

      <main className="w-full max-w-6xl flex flex-col md:flex-row items-start gap-16">

        {/* LEFT */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-block bg-red-600 text-white px-10 py-3 text-2xl font-bold self-start">
            COMICS.India
          </div>
          <p className="text-white font-bold text-4xl leading-snug">
            Where stories <br /> are born.
          </p>
          <p className="text-white/40 text-sm max-w-xs">
            Swipe through India&apos;s best indie comics. Like what you love, skip what you don&apos;t.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-white/60 text-sm font-semibold hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/feed")}
              className="text-white/60 text-sm font-semibold hover:text-white transition-colors"
            >
              Browse
            </button>
          </div>

          {/* Show saved comics only when logged in */}
          {user ? (
            <SavedComics
              comics={savedComics}
              selectedId={selectedComic?.id ?? null}
              onSelect={setSelectedComic}
            />
          ) : (
            <div style={{
              padding: "20px",
              borderRadius: 16,
              border: "1px dashed rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "sans-serif",
              fontSize: 13,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
              Sign in to save comics across devices
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-center">
          <TinderCards onSave={handleSave} />
        </div>

      </main>
    </div>
  );
}