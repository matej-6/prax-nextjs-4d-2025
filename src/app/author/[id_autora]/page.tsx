import { getDb } from "@/lib/db";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AlbumDetail({
  params,
}: {
  params: Promise<{ id_autora: string }>;
}) {
  const db = getDb();

  const { id_autora } = await params;
  const autorId = parseInt(id_autora);
  if (isNaN(autorId)) {
    return notFound();
  }

  const autorInfo = await db
    .selectFrom("authors")
    .select(["authors.name as name", "authors.bio as bio"])
    .where("authors.id", "=", autorId)
    .executeTakeFirst();

  if (autorInfo === undefined) {
    return notFound();
  }

  const albums = await db
    .selectFrom("albums")
    .select([
      "albums.id as id",
      "albums.name as name",
      "albums.release_date as releaseDate",
      (eb) =>
        eb
          .selectFrom("songs")
          // dokumentacia pre fn.count: https://kysely.dev/docs/examples/select/function-calls
          // pre nested queryes: https://kysely.dev/docs/examples/select/complex-selections
          .select(({ fn }) => [fn.count<number>("songs.id").as("count")])
          .whereRef("songs.album_id", "=", "albums.id")
          .as("songCount"),
    ])
    .where("albums.author_id", "=", autorId)
    .execute();

  // console.log(albums);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-y-8">
          <div className="flex items-center gap-x-4">
            <div className="avatar avatar-placeholder">
              <div className="bg-gradient-to-tr from-emerald-400 to-emerald-500 w-12 rounded-full">
                <span className="text-3xl">{autorInfo.name.charAt(0)}</span>
              </div>
            </div>
            <h1 className="text-5xl">{autorInfo.name}</h1>
          </div>
          {autorInfo.bio && (
            <div className="flex flex-col gap-y-2">
              <h2 className="text-2xl">Biography</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg">
                {autorInfo.bio}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-y-2">
            <h3 className="text-2xl">
              {albums.length > 0 ? "Albums" : "No albums yet"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="card bg-base-100 w-64 card-xl shadow-sm"
                >
                  <div className="card-body">
                    <span className="badge badge-sm bg-emerald-200 text-emerald-800">
                      Pop
                    </span>
                    <h2 className="text-3xl font-bold card-title">
                      {album.name}
                    </h2>

                    <p>ID: {album.id}</p>
                    <p>Number of songs: {album.songCount}</p>
                    <p>
                      Release Date: {new Date(album.releaseDate).toDateString()}
                    </p>
                    <div className="mt-6">
                      <Link
                        className="btn btn-block"
                        href={`/album/${album.id}`}
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
