"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function NavBar() {
  const params = useSearchParams();
  const query = params.get("q");

  const [searchValue, setSearchValue] = useState(query ?? "");

  const searchLinkQuery = searchValue !== "" ? { q: searchValue } : {};

  return (
    <div className="navbar shadow-sm max-w-6xl mx-auto">
      <div className="flex-1 items-center gap-x-2">
        <Link href="/" className="btn btn-ghost text-xl">
          Spotify
        </Link>
        <Link href="/playlists" className="btn btn-link">
          Playlists
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-x-2">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Link
            href={{
              pathname: "/search",
              query: searchLinkQuery,
            }}
            type="submit"
            className="btn text-xl"
          >
            Search
          </Link>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
