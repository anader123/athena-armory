import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row border-b border-gray-400 p-4">
      <Link
        href="/"
        className="w-full flex flex-row flex-start items-center gap-2 hover:opacity-70"
      >
        <Image
          className="rounded-full h-auto border border-gray-400"
          src="/logo2.png"
          alt="logo"
          width={40}
          height={40}
        />
        <h2 className="text-xl text-gray-100 font-light sm:inline hidden">
          {"Athena's Armory"}
        </h2>
      </Link>
      <div>
        <div className="w-full flex font-open-sans flex-row flex-start gap-4 items-center text-gray-100 font-light">
          <Link className="hover:underline hover:opacity-70" href="/about">
            About
          </Link>
          <Link className="hover:underline hover:opacity-70" href="/gallery">
            Gallery
          </Link>
          <ConnectKitButton />
        </div>
      </div>
    </div>
  );
}
