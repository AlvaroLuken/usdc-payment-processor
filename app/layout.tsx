"use client";
import Navbar from "@common/nav/Navbar";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { Metadata } from "next";
import { arbitrumGoerli } from "viem/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "./globals.css";

const metadata: Metadata = {
  title: "$USDC Merchant",
  description:
    "Web app to facilitate revelation of secrets in exchange for $USDC payments.",
};

const { chains, publicClient } = configureChains(
  [arbitrumGoerli],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID!,

    // Required
    appName: "You Create Web3 Dapp",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png",
    chains,
  })
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <body>
            <Navbar />
            {children}
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
