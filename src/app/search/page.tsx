import { getDb } from "@/lib/db";
import { formatDuration } from "@/lib/time";
import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl">
            {albums.length > 0 ? "Albums" : "No albums found"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="card bg-base-100 w-80 card-xl shadow-sm"
              >
                <div className="card-body">
                  <span className="badge badge-sm bg-emerald-200 text-emerald-800">
                    Pop
                  </span>
                  <h2 className="text-3xl font-bold card-title">
                    {album.name}
                  </h2>

                  <p>ID: {album.id}</p>
                  <p>
                    Release Date: {new Date(album.release_date).toDateString()}
                  </p>
                  <div className="mt-6">
                    <Link className="btn btn-block" href={`/album/${album.id}`}>
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl">
            {songs.length > 0 ? "Songs" : "No songs found"}
          </h2>
          {songs && (
            <table className="table">
              <thead>
                <tr className="grid grid-cols-[6fr_2fr_2fr]">
                  <td>Title</td>
                  <td className="flex items-center gap-1">
                    <ClockIcon className="size-4" />
                    Duration
                  </td>
                  <td>Album</td>
                </tr>
              </thead>
              <tbody>
                {songs.map((s) => (
                  <tr
                    key={s.id}
                    className="grid grid-cols-[6fr_2fr_2fr] hover:bg-base-300"
                  >
                    <td>{s.name}</td>
                    <td>{formatDuration(s.duration)}</td>
                    <td>
                      <Link
                        className="hover:underline"
                        href={"/album/" + s.albumId}
                      >
                        {s.albumName}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl">
            {authors.length > 0 ? "Authors" : "No authors found"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="card bg-base-100 w-80 card-xl shadow-sm"
              >
                <div className="card-body">
                  <h2 className="text-3xl font-bold card-title">
                    {author.name}
                  </h2>

                  <p>ID: {author.id}</p>
                  <div className="mt-6">
                    <Link
                      className="btn btn-block"
                      href={`/author/${author.id}`}
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
