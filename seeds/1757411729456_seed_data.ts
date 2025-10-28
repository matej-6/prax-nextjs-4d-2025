import { DB } from "@/lib/db-types";
import { faker } from "@faker-js/faker";
import type { Kysely } from "kysely";

export async function seed(db: Kysely<DB>): Promise<void> {
  await db.deleteFrom("playlists_songs").execute();
  await db.deleteFrom("playlists").execute();
  await db.deleteFrom("songs").execute();
  await db.deleteFrom("albums").execute();
  await db.deleteFrom("authors").execute();

  for (let i = 0; i < 20; i += 1) {
    const numBioParagraphs = faker.number.int({ min: 0, max: 5 });

    const bio =
      numBioParagraphs !== 0 ? faker.lorem.paragraph(numBioParagraphs) : null;

    await db
      .insertInto("authors")
      .values({
        name: faker.music.artist(),
        bio,
      })
      .execute();
  }

  const authors = await db.selectFrom("authors").selectAll().execute();

  for (const author of authors) {
    const numAlbums = faker.number.int({ min: 0, max: 10 });

    for (let i = 0; i < numAlbums; i += 1) {
      await db
        .insertInto("albums")
        .values({
          author_id: author.id,
          name: faker.music.album(),
          release_date: faker.date.past().getTime(),
        })
        .execute();
    }
  }

  const albums = await db.selectFrom("albums").selectAll().execute();

  for (const album of albums) {
    const typeOfAlbum = faker.number.int({ min: 0, max: 9 });

    let numSongs = 1;

    if (typeOfAlbum < 2) {
      numSongs = 1;
    } else if (typeOfAlbum < 5) {
      numSongs = faker.number.int({ min: 4, max: 6 });
    } else {
      numSongs = faker.number.int({ min: 10, max: 20 });
    }

    console.log(album.name, numSongs);

    for (let i = 0; i < numSongs; i += 1) {
      await db
        .insertInto("songs")
        .values({
          album_id: album.id,
          name: faker.music.songName(),
          duration: faker.number.int({ min: 90, max: 240 }),
        })
        .execute();
    }
  }

  const songs = await db
    .selectFrom("songs")
    .select(["songs.id as id"])
    .execute();

  for (let i = 0; i < 20; i++) {
    const playlist = await db
      .insertInto("playlists")
      .values({
        name: faker.lorem.words({ min: 1, max: 9 }),
      })
      .returning(["playlists.id as id"])
      .execute();

    const numSongs = faker.number.int({
      min: 1,
      max: Math.min(50, songs.length), // pre safety som dal Math.min(50, songs.length), ak by neexistovalo 50 songov
    });
    let availableSongs = songs;
    for (let j = 0; j < numSongs; j++) {
      const songIndex = faker.number.int({
        min: 0,
        max: availableSongs.length - 1,
      });
      const song = availableSongs[songIndex];
      availableSongs = availableSongs.filter((s) => s.id !== song.id);

      await db
        .insertInto("playlists_songs")
        .values({
          playlist_id: playlist[0].id,
          song_id: song.id,
        })
        .execute();
    }
  }
}
