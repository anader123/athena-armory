import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center border-b border-gray-400 p-4">
      <Link
        href="/"
        className="flex flex-row items-center gap-2 hover:opacity-70"
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
      <div className="flex flex-row gap-4 items-center">
        <Link className="hover:underline hover:opacity-70" href="/about">
          About
        </Link>
        <Link
          className="hover:underline hover:opacity-70"
          target="_blank"
          rel="noopener noreferrer"
          href="https://zora.co/collect/base:0x2e19b870c16efe1e346e8fc15bc91cd322b1513d"
        >
          Gallery
        </Link>
        <Link
          className="hover:underline hover:opacity-70"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/anader123/athena-armory"
        >
          Github
        </Link>
        <ConnectKitButton />
      </div>
    </div>
  );
}
