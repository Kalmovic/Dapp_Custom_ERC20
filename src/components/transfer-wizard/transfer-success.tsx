import { CardDescription, CardFooter } from "../ui/card";
import { CircleCheck } from "lucide-react";
import { Button } from "../ui/button";

export function TransferSuccess({ onClose }: { onClose: () => void }) {
  return (
    <>
      <CardDescription>
        <div className="flex flex-col items-center space-y-4 p-8">
          <div className="text-2xl text-green-500">
            <CircleCheck size={36} />
          </div>
          <span className="text-lg text-center font-medium">
            Your tokens have been transferred successfully.
          </span>
          <span className="text-md text-center">
            Soon your balance will be updated with the new amount.
          </span>
        </div>
      </CardDescription>
      <CardFooter>
        <Button
          onClick={onClose}
          variant="outline"
          className="flex items-center justify-center w-full"
        >
          Okay!
        </Button>
      </CardFooter>
    </>
  );
}
