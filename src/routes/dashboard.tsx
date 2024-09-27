import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatBigInt } from "@/utils/formatBigInt";
import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import tokenAbi from "@/abis/bitso-token-abi.json";
import { TransferWizard } from "@/components/transfer-wizard/transfer-wizard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/text-shimmer";
import { useTokenContext } from "@/context/token-context";
import { useQueryClient } from "@tanstack/react-query";

function Dashboard() {
  const queryClient = useQueryClient();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { address, isDisconnected } = useAccount();
  const { tokenSymbol } = useTokenContext();
  const {
    data: balance,
    queryKey,
    isSuccess,
    isLoading,
  } = useReadContract({
    address: BITSO_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const handleClose = async () => {
    // Invalidate the balance query to refetch the new balance
    await queryClient.invalidateQueries({
      queryKey,
    });
    setIsTransferOpen(false);
  };

  const formattedBalance =
    isSuccess && !!balance && typeof balance == "bigint"
      ? formatBigInt(balance, 18)
      : "0";

  return (
    <div className="w-full max-w-md p-4 space-y-4 mx-auto">
      {isDisconnected ? (
        <Navigate to="/login" replace />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Token Balance</CardTitle>
            <CardDescription>
              Your current balance on Bitso Token
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-end">
                <TextShimmer width="80px" />
              </div>
            ) : (
              <div className="flex justify-end items-baseline">
                <p className="text-2xl font-bold">{formattedBalance}</p>
                <p className="text-base font-bold ml-1">
                  {tokenSymbol ?? <TextShimmer width="40px" />}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {!isTransferOpen ? (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTransferOpen(true)}
              className="w-full flex justify-end relative"
            >
              <Button variant="default">
                <motion.span>Transfer</motion.span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              style={{ borderRadius: 12 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative bottom-0"
            >
              <TransferWizard onClose={handleClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;
