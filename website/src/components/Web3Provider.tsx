"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    appName: "Athena's Armory",

    // Optional App Info
    appDescription:
      "Collect mythical items from Ancient Greece with Athena’s Armory, an NFT contract managed by AI agents embodying Greek gods.",
    appUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`, // your app's url
    appIcon: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`, // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
