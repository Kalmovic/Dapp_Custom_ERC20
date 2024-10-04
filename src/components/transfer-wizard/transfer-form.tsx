import React, { useMemo } from "react";
import * as Yup from "yup";
import { ethers } from "ethers";
import { Address } from "viem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AnimatePresence, motion } from "framer-motion";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { useTokenContext } from "@/context/tokenContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TransferFormProps = {
  data: { recipient?: Address | string; amount?: string };
  onClose: () => void;
  onNext: (data: { recipient: string; amount: string }) => void;
};

export function TransferForm({ data, onClose, onNext }: TransferFormProps) {
  const { formattedBalance } = useAccountBalance();
  const { tokenSymbol } = useTokenContext();

  const schema = useMemo(() => {
    return Yup.object().shape({
      recipient: Yup.string()
        .required("Recipient address is required")
        .test("is-valid-address", "Invalid Ethereum address", (value) =>
          ethers.isAddress(value || "")
        ),
      amount: Yup.string()
        .required("Amount is required")
        .test(
          "is-positive",
          "Amount must be a positive number",
          (value) => !isNaN(Number(value)) && parseFloat(value || "0") > 0
        )
        .test(
          "is-less-than-balance",
          "Amount exceeds available balance",
          function (value) {
            if (!formattedBalance) {
              return true; // Alternatively, return false to enforce validation
            }
            return parseFloat(value || "0") <= parseFloat(formattedBalance);
          }
        ),
    });
  }, [formattedBalance]);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    register,
  } = useForm<Yup.InferType<typeof schema>>({
    resolver: yupResolver(schema, {
      context: { availableBalance: formattedBalance },
    }),
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      amount: data.amount || "",
      recipient: data.recipient || "",
    },
  });

  const onSubmit = (data: { recipient: string; amount: string }) => {
    // just in case the validation on amount fails to check if theres enough balance
    if (
      parseFloat(data.amount) > parseFloat(formattedBalance) ||
      !formattedBalance
    ) {
      setError("amount", {
        type: "is-less-than-balance",
        message: "Amount exceeds available balance",
      });
      return;
    }
    onNext(data);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Transfer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              {...register("recipient")}
              className="bg-primary-foreground"
            />
            <AnimatePresence mode="popLayout">
              {errors.recipient && (
                <motion.span
                  className="text-destructive text-xs"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.recipient.message}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              {...register("amount")}
              className="bg-primary-foreground"
            />
            <span className="text-xs text-slate-500">
              You have: {formattedBalance} {tokenSymbol} available
            </span>
            <AnimatePresence mode="popLayout">
              {errors.amount && (
                <motion.span
                  className="text-destructive text-xs"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {errors.amount.message}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <motion.div className="flex justify-end space-x-2" layout>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </motion.div>
        </form>
      </CardContent>
    </>
  );
}
