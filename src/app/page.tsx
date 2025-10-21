import { getDb } from "@/lib/db";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q;

  const db = getDb();

  const albums = await db
    .selectFrom("albums")
    .innerJoin("authors", "albums.author_id", "authors.id")
    .select([
      "albums.id",
      "albums.name",
      "albums.release_date",
      "authors.name as author_name",
    ])
    .execute();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p className="text-4xl font-bold">Spotify</p>
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
                <h2 className="text-3xl font-bold card-title">{album.name}</h2>

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
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>Footer</p>
      </footer>
    </div>
  );
}
