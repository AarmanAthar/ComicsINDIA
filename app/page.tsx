"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TinderCards, { type Card } from "@/components/comicUI";
import AddButton from "@/components/uploadButton";
import SavedComics from "@/components/savedComics";

export default function Home() {
  const router = useRouter();
  const [savedComics, setSavedComics] = useState<Card[]>([]);
  const [selectedComic, setSelectedComic] = useState<Card | null>(null);

  const handleSave = (card: Card) => {
    setSavedComics((prev) =>
      prev.some((c) => c.id === card.id) ? prev : [...prev, card]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-8 relative">

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

          <SavedComics
            comics={savedComics}
            selectedId={selectedComic?.id ?? null}
            onSelect={setSelectedComic}
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-center">
          <TinderCards onSave={handleSave} />
        </div>

      </main>
    </div>
  );
}
