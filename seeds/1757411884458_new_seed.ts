import { DB } from "@/lib/db-types";
import { type Kysely } from "kysely";
import { faker } from "@faker-js/faker";
import { randomInt } from "crypto";

// replace `any` with your database interface.
export async function seed(db: Kysely<DB>): Promise<void> {
  // seed code goes here...
  // note: this function is mandatory. you must implement this function.

  await db.deleteFrom("authors").execute();
  await db.deleteFrom("albums").execute();
  await db.deleteFrom("songs").execute();

  const result = await db
    .insertInto("authors")
    .values(
      Array.from({ length: 10 }).map(() => ({
        name: faker.music.artist(),
      }))
    )
    .returningAll()
    .execute();

  console.log(result);

  const albums = await db
    .insertInto("albums")
    .values(
      Array.from({ length: 10 }).map(() => {
        const randomAuthor = result[randomInt(result.length - 1)];
        return {
          name: faker.music.album(),
          author_id: randomAuthor.id,
          release_date: faker.date.past().getTime(),
        };
      })
    )
    .returningAll()
    .execute();

  console.log(albums);

  const songs = await db
    .insertInto("songs")
    .values(
      Array.from({ length: 10 }).map(() => {
        const randomAlbum = result[randomInt(albums.length - 1)];
        return {
          album_id: randomAlbum.id,
          duration:
            faker.date.soon({ days: 1 }).getTime() -
            new Date(Date.now()).getTime(),
          name: faker.music.songName(),
          release_date: faker.date.past().getTime(),
        };
      })
    )
    .returningAll()
    .execute();

  console.log(songs);
}
