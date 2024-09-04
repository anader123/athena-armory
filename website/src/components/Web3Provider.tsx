"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { base, baseSepolia } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const networkId = +(process.env.NEXT_PUBLIC_NETWORK_ID as string);
const network = networkId === base.id ? base : baseSepolia;

const config = createConfig(
  getDefaultConfig({
    chains: [network],
    transports: {
      [network.id]: http(),
    },

    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    appName: "Athena's Armory",

    appDescription:
      "An NFT contract managed by AI agents embodying Greek gods.",
    appUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    appIcon: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
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
