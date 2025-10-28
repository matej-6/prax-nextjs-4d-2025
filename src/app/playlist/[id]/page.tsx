import { getDb } from "@/lib/db";
import { formatDuration } from "@/lib/time";
import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const validId = parseInt(id);
  if (isNaN(validId)) {
    return notFound();
  }

  const db = getDb();

  const playlist = await db
    .selectFrom("playlists")
    .where("id", "=", validId)
    .selectAll()
    .executeTakeFirst();

  if (!playlist) {
    return notFound();
  }

  const songs = await db
    .selectFrom("playlists_songs")
    .where("playlists_songs.playlist_id", "=", playlist.id)
    .innerJoin("songs", "songs.id", "playlists_songs.song_id")
    .select([
      "songs.id as id",
      "songs.name as name",
      "songs.duration as duration",
    ])
    .execute();

  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-start">
        <h1 className="text-6xl">{playlist.name}</h1>
        <table className="table">
          <thead>
            <tr className="grid grid-cols-[1fr_6fr_2fr]">
              <td>ID</td>
              <td>Title</td>
              <td className="flex items-center gap-1">
                <ClockIcon className="size-4" />
                Duration
              </td>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr
                key={s.id}
                className="grid grid-cols-[1fr_6fr_2fr] hover:bg-base-300"
              >
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{formatDuration(s.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
