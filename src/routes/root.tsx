import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";

export function Root() {
  const { isConnected } = useAccount();
  return (
    <div className="w-full space-y-4" style={{ margin: "0 auto" }}>
      <div className="w-full p-4 bg-white shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Bitso Token</h1>
          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => {
              return (
                <Button
                  onClick={show}
                  variant={!!isConnected && !!address ? "outline" : "default"}
                  className="ml-auto px-4 py-2 rounded-lg"
                >
                  {!!isConnected && !!address
                    ? address.slice(0, 6) + "..." + address.slice(-4)
                    : "Connect Wallet"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
      {isConnected ? (
        <Navigate to="dashboard" replace={true} />
      ) : (
        <Navigate to="login" replace={true} />
      )}
      <Outlet />
    </div>
  );
}
