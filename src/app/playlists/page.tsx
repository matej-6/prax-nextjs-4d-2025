import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function PlaylistsPage() {
  const db = getDb();
  const playlists = await db
    .selectFrom("playlists")
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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-6xl">Playlists</h1>
        <table className="table">
          <thead>
            <tr className="grid grid-cols-[2fr_6fr_3fr_2fr]">
              <td>ID</td>
              <td>Name</td>
              <td>Number of Songs</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            {playlists.map((p) => (
              <tr
                key={p.id}
                className="grid grid-cols-[2fr_6fr_3fr_2fr] hover:bg-base-300 items-center"
              >
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{songCount.get(p.id)}</td>
                <td>
                  <Link
                    href={`/playlist/${p.id}`}
                    className="btn btn-block btn-sm"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
