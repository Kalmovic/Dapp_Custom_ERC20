import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import { ethers } from "ethers";
import { Form, Link, redirect, useActionData } from "react-router-dom";
import tokenAbi from "@/abis/bitso-token-abi.json";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { config } from "@/providers/wallet-provider";
import {
  getAccount,
  getConnectors,
  simulateContract,
  writeContract,
} from "@wagmi/core";
import { useAccount } from "wagmi";
import { sepolia } from "viem/chains";
import { toast } from "sonner";

// Transfer.tsx
export async function transferAction({ request }: { request: Request }) {
  console.log("Transfer action called");
  const formData = await request.formData();
  const recipient = formData.get("recipient") as string;
  const amount = formData.get("amount") as string;

  // validation
  if (!recipient || !amount) {
    return { error: "Recipient address and amount are required." };
  }

  if (!ethers.isAddress(recipient)) {
    return { error: "Invalid recipient address." };
  }

  if (isNaN(parseFloat(amount))) {
    return { error: "Invalid amount." };
  }

  if (parseFloat(amount) <= 0) {
    return { error: "Amount must be greater than 0." };
  }

  try {
    const { address } = getAccount(config);

    // console.log(approve);
    const { request, result } = await simulateContract(config, {
      address: BITSO_TOKEN_ADDRESS,
      account: address,
      abi: tokenAbi,
      functionName: "transfer",
      args: [recipient, ethers.parseUnits(amount.toString(), 0)],
      chainId: sepolia.id,
    });

    console.log(request, result);

    // Optional: Get gas estimate
    // const gasEstimate = result.gas;
    // console.log("Estimated Gas:", gasEstimate.toString());

    // Execute the transaction
    const hash = await writeContract(config, request);

    console.log("Transaction hash:", hash);

    return redirect("/dashboard");
  } catch (error) {
    return { error: "Generic" };
  }
}

export default function Transfer() {
  const actionData = useActionData();

  if (actionData?.error === "Generic") {
    toast("Transaction incomplete.", {
      description:
        "We couldn't complete the transaction at this time, please try again later.",
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          method="post"
          // onSubmit={(e) => {
          //   setFormState("loading");
          // }}
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Address
            </Label>
            <Input type="text" name="recipient" required placeholder="0x..." />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </Label>
            <Input type="number" name="amount" required placeholder="0.00" />
          </div>
          <Input type="hidden" name="_action" value="transfer" />
          <div className="form-actions">
            <Button type="submit">{"Send Tokens"}</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
