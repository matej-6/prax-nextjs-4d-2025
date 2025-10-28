import { getDb } from "@/lib/db";
import { formatDuration } from "@/lib/time";
import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchClient } from "./search-client";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q;

  if (typeof query !== "string") {
    notFound();
  }

  const db = getDb();

  const albums = await db
    .selectFrom("albums")
    .where("albums.name", "like", `%${query}%`)
    .innerJoin("authors", "albums.author_id", "authors.id")
    .select([
      "albums.id",
      "albums.name",
      "albums.release_date",
      "authors.name as author_name",
    ])
    .execute();

  const songs = await db
    .selectFrom("songs")
    .where("songs.name", "like", `%${query}%`)
    .innerJoin("albums", "albums.id", "songs.album_id")
    .select([
      "songs.name as name",
      "songs.duration as duration",
      "songs.id as id",
      "albums.name as albumName",
      "albums.id as albumId",
    ])
    .execute();

  const authors = await db
    .selectFrom("authors")
    .where("authors.name", "like", `%${query}%`)
    .selectAll()
    .execute();

  const playlists = await db
    .selectFrom("playlists")
    .where("playlists.name", "like", `%${query}%`)
    .select(["playlists.id as id", "playlists.name as name"])
    .execute();

  const songCount = new Map();
  for (const playlist of playlists) {
    const songs = await db
      .selectFrom("playlists_songs")
      .where("playlists_songs.playlist_id", "=", playlist.id)
      .select(["song_id"])
      .execute();

    songCount.set(playlist.id, songs.length);
  }

  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-start">
        <SearchClient
          albums={albums}
          authors={authors}
          songs={songs}
          playlists={playlists.map((p) => ({
            ...p,
            songCount: songCount.get(p.id),
          }))}
        />
      </main>
    </div>
  );
}
