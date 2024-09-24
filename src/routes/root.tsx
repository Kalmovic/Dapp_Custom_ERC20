import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { Outlet } from "react-router-dom";

export function Root() {
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
                  variant="secondary"
                  className="ml-auto px-4 py-2 rounded-lg text-black"
                >
                  {isConnected && address
                    ? address.slice(0, 6) + "..." + address.slice(-4)
                    : "Connect Wallet"}
                </Button>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
