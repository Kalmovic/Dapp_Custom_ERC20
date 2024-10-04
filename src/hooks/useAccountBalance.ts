import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import { formatBigInt } from "@/utils/formatBigInt";
import { useAccount, useReadContract } from "wagmi";
import tokenAbi from "@/abis/bitso-token-abi.json";

export const useAccountBalance = () => {
  const { address } = useAccount();
  const {
    data: balance,
    queryKey,
    isSuccess,
    ...rest
  } = useReadContract({
    address: BITSO_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
    query: {
      // 5s cache
      staleTime: 5000,
    },
  });

  const formattedBalance =
    isSuccess && !!balance && typeof balance == "bigint"
      ? formatBigInt(balance, 18)
      : "0";

  return {
    formattedBalance,
    queryKey,
    isSuccess,
    ...rest,
  };
};
