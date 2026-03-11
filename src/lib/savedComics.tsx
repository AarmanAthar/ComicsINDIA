import { supabase } from "./supabase";

export async function fetchSavedComics(userId: string): Promise<number[]> {
  const { data } = await supabase
    .from("saved_comics")
    .select("comic_id")
    .eq("user_id", userId);
  return data?.map((r) => r.comic_id) ?? [];
}

export async function saveComic(userId: string, comicId: number): Promise<void> {
  await supabase.from("saved_comics").upsert({
    user_id: userId,
    comic_id: comicId,
  });
}

export async function unsaveComic(userId: string, comicId: number): Promise<void> {
  await supabase
    .from("saved_comics")
    .delete()
    .eq("user_id", userId)
    .eq("comic_id", comicId);
}