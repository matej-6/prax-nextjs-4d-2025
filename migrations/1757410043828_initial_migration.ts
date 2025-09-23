import { sql, type Kysely } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<unknown>): Promise<void> {
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations

  await sql`CREATE TABLE authors (
		id integer primary key autoincrement not null,
		name text not null,
		bio text
	) STRICT`.execute(db);

  await sql`CREATE TABLE albums (
		id integer primary key autoincrement not null,
		name text not null,
		author_id integer not null,
		release_date integer not null,
		foreign key (author_id) references authors (id)
	) STRICT`.execute(db);

  await sql`CREATE TABLE songs (
		id integer primary key autoincrement not null,
		name text not null,
		album_id integer not null,
		release_date integer not null,
		duration integer not null,
		foreign key (album_id) references albums (id)
	) STRICT`.execute(db);
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<unknown>): Promise<void> {
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
