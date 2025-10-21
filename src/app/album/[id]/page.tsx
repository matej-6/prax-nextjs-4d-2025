import { getDb } from "@/lib/db";
import { formatDuration } from "@/lib/time";
import { ArrowUpRight, ClockIcon } from "lucide-react";
import Link from "next/link";



export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const db = getDb();

  const { id } = await params;

  console.log("Album detail id:", id);

  const albumId = parseInt(id);

  if (isNaN(albumId)) {
    return <div>Invalid Album id</div>;
  }

  const album = await db
    .selectFrom("albums")
    .innerJoin("authors", "authors.id", "albums.author_id")
    .select([
      "albums.name",
      "albums.release_date",
      "authors.name as author_name",
      "authors.id as author_id",
    ])
    .where("albums.id", "=", albumId)
    .executeTakeFirst();

  // if (album == null)
  if (album === null || album === undefined) {
    // throw new Error("Not Found");
    return <div>Album not found</div>;
  }

  const songs = await db
    .selectFrom("songs")
    .selectAll()
    .where("album_id", "=", albumId)
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-y-8">
          <h1 className="text-5xl">{album.name}</h1>
          <div className="flex items-center gap-x-2">
            {/* https://daisyui.com/components/avatar/#avatar-placeholder */}
            <div className="avatar avatar-placeholder">
              <div className="bg-gradient-to-tr from-emerald-400 to-emerald-500 w-8 rounded-full">
                <span className="text-lg">{album.author_name.charAt(0)}</span>
              </div>
            </div>
            <div className="flex gap-0.5">
              By
              <Link
                className="underline flex gap-x-0.5 items-center hover:text-emerald-500 transition-colors duration-150"
                href={`/author/${album.author_id}`}
              >
                <span>{album.author_name}</span>
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr className="grid grid-cols-[1fr_6fr_2fr]">
                <td>#</td>
                <td>Title</td>
                <td className="flex items-center gap-1">
                  <ClockIcon className="size-4" />
                  Duration
                </td>
              </tr>
            </thead>
            <tbody>
              {songs.map((s, i) => (
                <tr
                  key={s.id}
                  className="grid grid-cols-[1fr_6fr_2fr] hover:bg-base-300"
                >
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{formatDuration(s.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
