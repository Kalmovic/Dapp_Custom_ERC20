import React from "react";
import { CardDescription } from "../ui/card";

export function TransferSuccess({ onClose }: { onClose: () => void }) {
  // close the modal after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <>
      <CardDescription>
        <div className="flex flex-col items-center space-y-4 p-8">
          <div className="text-2xl text-green-500">🎉</div>
          <span className="text-md text-center">
            Your tokens have been transferred successfully.
          </span>
          <span>Soon your balance will be updated with the new amount.</span>
        </div>
      </CardDescription>
    </>
  );
}
