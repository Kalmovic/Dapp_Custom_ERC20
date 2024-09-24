import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import { useAccount } from "wagmi";

export function Login() {
  const { isConnected } = useAccount();

  return !isConnected ? (
    <div className="w-full max-w-md p-4 space-y-4" style={{ margin: "0 auto" }}>
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            In order to use Bitso Token, you need to connect your wallet
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  ) : (
    <Navigate to="/dashboard" replace={true} />
  );
}
