import * as Yup from "yup";
import { ethers } from "ethers";
import { Address } from "viem";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TransferFormProps = {
  data: { recipient?: Address | string; amount?: string };
  onClose: () => void;
  onNext: (data: { recipient: string; amount: string }) => void;
};

const schema = Yup.object().shape({
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
    ),
});

export function TransferForm({ data, onClose, onNext }: TransferFormProps) {
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<Yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: {
      amount: data.amount || "",
      recipient: data.recipient || "",
    },
  });

  const onSubmit = (data: { recipient: string; amount: string }) => {
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
              type="text"
              placeholder="0x..."
              {...register("recipient")}
              className="bg-primary-foreground"
            />
            {errors.recipient && (
              <span className="text-destructive text-xs">
                {errors.recipient.message}
              </span>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="text"
              placeholder="0.00"
              {...register("amount")}
              className="bg-primary-foreground"
            />
            {errors.amount && (
              <span className="text-destructive text-xs">
                {errors.amount.message}
              </span>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </>
  );
}
