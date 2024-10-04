import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import React, { createContext, useContext } from "react";
import { useReadContract } from "wagmi";
import tokenAbi from "@/abis/bitso-token-abi.json";

interface TokenContextType {
  tokenSymbol: string;
  data: ReturnType<typeof useReadContract>;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const result = useReadContract({
    address: BITSO_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "symbol",
  });

  const tokenSymbol = result.data as string;

  return (
    <TokenContext.Provider value={{ tokenSymbol, data: result }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};
