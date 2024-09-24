import { Link, Navigate, Outlet, redirect } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

function Dashboard() {
  const { address, isDisconnected } = useAccount();

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
            <p className="text-2xl font-bold">
              1000 <span className="text-base">BIT</span>
            </p>
          </CardContent>
        </Card>
      )}
      {/* transfer button at the right */}

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
