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

  useEffect(() => {
    if (!user) { setSavedComics([]); return; }
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
    <div className="min-h-screen bg-[#0f0f0f] relative">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4"
        style={{ background: "rgba(15,15,15,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="bg-red-600 text-white px-4 py-1.5 text-lg font-bold">
          COMICS.India
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-white/50 text-sm font-semibold hover:text-white transition-colors hidden md:block"
          >
            Home
          </button>
          <button
            onClick={() => router.push("/feed")}
            className="text-white/50 text-sm font-semibold hover:text-white transition-colors hidden md:block"
          >
            Browse
          </button>
          <AuthButton />
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <AddButton />
      </div>

      {/* Main content — pushed below top bar */}
      <main className="pt-20 pb-12 px-4 md:px-8 w-full max-w-6xl mx-auto">

        {/* Mobile: stack vertically, Desktop: side by side */}
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">

          {/* LEFT — hidden on mobile unless logged in with saves */}
          <div className="w-full md:flex-1 flex flex-col gap-5">

            {/* Hero text — visible on desktop only */}
            <div className="hidden md:flex flex-col gap-4">
              <p className="text-white font-bold text-4xl leading-snug">
                Where stories <br /> are born.
              </p>
              <p className="text-white/40 text-sm max-w-xs">
                Swipe through India&apos;s best indie comics. Like what you love, skip what you don&apos;t.
              </p>
            </div>

            {/* Saved comics */}
            {user ? (
              <SavedComics
                comics={savedComics}
                selectedId={selectedComic?.id ?? null}
                onSelect={setSelectedComic}
              />
            ) : (
              <div className="hidden md:flex flex-col items-center justify-center gap-2 rounded-2xl p-6"
                style={{
                  border: "1px dashed rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.2)",
                  fontSize: 13, textAlign: "center",
                }}
              >
                <div style={{ fontSize: 28 }}>🔒</div>
                Sign in to save comics across devices
              </div>
            )}
          </div>

          {/* RIGHT — swipe deck, always centered */}
          <div className="w-full md:flex-1 flex flex-col items-center">
            <TinderCards onSave={handleSave} />
          </div>

        </div>
      </main>
    </div>
  );
}