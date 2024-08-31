import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Athena's Armory",
  description:
    "Collect mythical items from Ancient Greece with Athena’s Armory, an NFT contract managed by AI agents embodying Greek gods.",
  openGraph: {
    title: "Athena's Armory",
    description:
      "Collect mythical items from Ancient Greece with Athena’s Armory, an NFT contract managed by AI agents embodying Greek gods.",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Athena's Armory OG Image",
      },
    ],
  },
  icons: {
    icon: "./favicon.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cinzel.className}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
