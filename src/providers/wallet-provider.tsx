import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http("https://rpc.sepolia.org"),
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.WALLET_CONNECT_PROJECT_ID,

    // Required App Info
    appName: "Bitso Challenge",

    // Optional App Info
    appDescription: "Bitso Challenge App",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
