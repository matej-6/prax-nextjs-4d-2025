"use client";

import { formatDuration } from "@/lib/time";
import { ClockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type SearchClientProps = {
  albums: {
    name: string;
    id: number;
    release_date: number;
    author_name: string;
  }[];
  songs: {
    name: string;
    duration: number;
    id: number;
    albumName: string;
    albumId: number;
  }[];
  authors: {
    id: number;
    name: string;
    bio: string | null;
  }[];
};

export function SearchClient({ albums, authors, songs }: SearchClientProps) {
  const [selected, setSelected] = useState<"albums" | "songs" | "authors">(
    "albums"
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between max-w-xs w-full mx-auto">
        <button
          className={
            selected === "albums"
              ? "btn bg-green-500 hover:bg-green-600"
              : "btn"
          }
          onClick={() => setSelected("albums")}
        >
          Albums
        </button>
        <button
          className={
            selected === "songs" ? "btn bg-green-500 hover:bg-green-600" : "btn"
          }
          onClick={() => setSelected("songs")}
        >
          Songs
        </button>
        <button
          className={
            selected === "authors"
              ? "btn bg-green-500 hover:bg-green-600"
              : "btn"
          }
          onClick={() => setSelected("authors")}
        >
          Authors
        </button>
      </div>
      {selected === "albums" ? (
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
      ) : selected === "songs" ? (
        <div className="space-y-8">
          <h2 className="text-4xl">
            {songs.length > 0 ? "Songs" : "No songs found"}
          </h2>
          {songs && (
            <table className="table max-w-6xl">
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
      ) : (
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
      )}
    </div>
  );
}
