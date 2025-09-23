import SpotifyLogo from "@/../public/spotify.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1>Spotify</h1>
      <Image src={SpotifyLogo} alt="logo" />
    </div>
  );
}
