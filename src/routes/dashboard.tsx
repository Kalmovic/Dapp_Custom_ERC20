import { Link, Navigate, Outlet, redirect } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import tokenAbi from "@/abis/bitso-token-abi.json";
import { BITSO_TOKEN_ADDRESS } from "@/constants/addresses";
import { useAccount, useReadContract } from "wagmi";
import { Suspense } from "react";
import { formatBigInt } from "@/utils/formatBigInt";
import { TextShimmer } from "@/components/text-shimmer";
import { BigNumberish } from "ethers";

function Loader() {
  return (
    <div className="flex flex-row justify-end">
      <TextShimmer width="80px" />
    </div>
  );
}

function Dashboard() {
  const { address, isDisconnected } = useAccount();
  const {
    data: balance,
    isLoading,
  }: {
    data: undefined | BigNumberish;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  } = useReadContract({
    address: BITSO_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <div className="w-full max-w-md p-4 space-y-4" style={{ margin: "0 auto" }}>
      {isDisconnected ? (
        <Navigate to="/login" replace={true} />
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
              <Loader />
            ) : (
              <Suspense fallback={<Loader />}>
                <div className="flex flex-row justify-end align-center items-baseline">
                  <p className="text-2xl font-bold">
                    {balance ? formatBigInt(balance, 0) : "0"}{" "}
                  </p>
                  <p className="text-base font-bold ml-1">BIT</p>
                </div>
              </Suspense>
            )}
          </CardContent>
        </Card>
      )}
      <Link to="transfer" className="w-full flex justify-end">
        <Button
          variant="outline"
          className="flex justify-center items-center text-black"
        >
          Transfer
        </Button>
      </Link>
      <Outlet />
    </div>
  );
}

export default Dashboard;
