import React from "react";
import { getAccount, simulateContract, writeContract } from "@wagmi/core";
import { ethers } from "ethers";
import { sepolia } from "viem/chains";
import { encodeFunctionData } from "viem";
import { useEstimateGas, useGasPrice } from "wagmi";
import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import { config } from "@/providers/wallet-provider";
import { AnimatePresence, motion } from "framer-motion";
import tokenAbi from "@/abis/bitso-token-abi.json";
import { toast } from "sonner";
import { Info, Loader, LoaderCircle } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useTokenContext } from "@/context/tokenContext";
import { TextShimmer } from "../text-shimmer";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TransferConfirmProps {
  data: {
    recipient: string;
    amount: string;
  };
  onBack: () => void;
  onNext: () => void;
}

export function TransferConfirm({
  data,
  onBack,
  onNext,
}: TransferConfirmProps) {
  // no error to be displayed in the form
  // the error will be displayed in the toast
  const [formStatus, setFormStatus] = React.useState<
    "idle" | "loading" | "success"
  >("idle");

  const { tokenSymbol } = useTokenContext();

  const ethersUnitsToBeParsed = data.amount.replace(/,/g, "");

  const parsedAmount = ethers.parseUnits(ethersUnitsToBeParsed, 18);

  const dataField = encodeFunctionData({
    abi: tokenAbi,
    functionName: "transfer",
    args: [data.recipient, parsedAmount],
  });

  // Fetch the estimated gas for the transaction
  const { data: estimateGas } = useEstimateGas({
    to: BITSO_TOKEN_ADDRESS,
    data: dataField,
    chainId: sepolia.id,
  });

  // Fetch the current gas price
  const { data: gasPriceData } = useGasPrice({
    chainId: sepolia.id,
  });

  // Buffer for the gas fee
  const buffer = BigInt(12) / BigInt(10);

  // Calculate the estimated gas fee
  const estimatedGasFee =
    estimateGas && gasPriceData
      ? BigInt(estimateGas) * BigInt(gasPriceData) * buffer
      : null;

  const formattedEstimatedGasFee = estimatedGasFee
    ? ethers.formatEther(estimatedGasFee).slice(0, 8)
    : null;

  const handleConfirm = async () => {
    setFormStatus("loading");
    try {
      const { address } = getAccount(config);
      const parsedAmount = ethers.parseUnits(ethersUnitsToBeParsed, 18);

      const { request: txRequest } = await simulateContract(config, {
        address: BITSO_TOKEN_ADDRESS,
        account: address,
        abi: tokenAbi,
        functionName: "transfer",
        args: [data.recipient, parsedAmount],
        chainId: sepolia.id,
      });

      await writeContract(config, txRequest);

      setTimeout(() => {
        setFormStatus("success");
        onNext();
      }, 2000);
    } catch (error) {
      console.error(error);
      toast("Transaction incomplete.", {
        description:
          "We couldn't complete the transaction at this time, please try again later.",
        icon: <Info size={16} className="mr-4" />,
        style: {
          border: "1px solid #EBEDF0",
        },
      });
      setFormStatus("idle");
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Confirm Transfer
        </CardTitle>
        <CardDescription>
          Carefully review the details before confirming the transfer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 p-4 border border-primary-border rounded-lg bg-slate-50">
          <p className="flex items-center space-x-2">
            <span className="text-sm font-medium leading-none">Recipient:</span>
            <span className="px-1 py-0.5 text-sm font-medium leading-none">
              {data.recipient.slice(0, 6) + "..." + data.recipient.slice(-4)}
            </span>
          </p>
          <hr />
          <p className="flex items-center space-x-2">
            <span className="text-sm font-medium leading-none">Amount:</span>
            <span className="px-1 py-0.5 text-sm font-medium leading-none flex flex-row">
              {data.amount}{" "}
              <span className="ml-1 font-bold">{tokenSymbol}</span>
            </span>
          </p>
          <hr />
          <p className="flex items-center space-x-2">
            <span className="text-sm font-medium leading-none">
              Estimated Gas Fee:
            </span>
            {formattedEstimatedGasFee ? (
              <div className="flex justify-center space-x-1 items-center">
                <span className="px-1 py-0.5 text-sm font-medium flex justify-center space-x-2 align-middle">
                  ${formattedEstimatedGasFee} ETH
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LoaderCircle
                      size={12}
                      className="animate-spin stroke-slate-300"
                    />
                  </TooltipTrigger>
                  <TooltipContent>Updating gas fee...</TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <TextShimmer width="114px" className="px-1 py-0.5 text-sm" />
            )}
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={formStatus === "loading"}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={formStatus === "loading"}
            className="min-w-[87.49px]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                transition={{
                  type: "spring",
                  duration: 0.3,
                  bounce: 0,
                }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 25 }}
                key={formStatus}
              >
                {formStatus === "loading" ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <span>Confirm</span>
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </CardContent>
    </>
  );
}
