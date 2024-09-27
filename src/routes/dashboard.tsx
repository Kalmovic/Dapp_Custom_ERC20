import { useState } from "react";
import { useAccount } from "wagmi";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { useAccountBalance } from "@/hooks/useAccountBalance";

function Dashboard() {
  const queryClient = useQueryClient();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { isDisconnected } = useAccount();
  const { tokenSymbol } = useTokenContext();
  const { formattedBalance, isLoading, queryKey } = useAccountBalance();

  const handleClose = async () => {
    // Invalidate the balance query to refetch the new balance
    await queryClient.invalidateQueries({
      queryKey,
    });
    setIsTransferOpen(false);
  };

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
                <TextShimmer width="150px" />
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
