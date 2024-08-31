"use client";

import Header from "@/components/Header";
import Minter from "@/components/Minter";
import Votes from "@/components/Votes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Minter />
      <Votes />
    </main>
  );
}
