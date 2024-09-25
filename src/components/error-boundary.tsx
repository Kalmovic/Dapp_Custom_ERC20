import { CircleAlert } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function ErrorBoundary() {
  return (
    <div className="w-full max-w-md p-4 space-y-4" style={{ margin: "0 auto" }}>
      <Card className="border border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex flex-row items-center space-x-1">
            <CircleAlert size={16} />
            <span>An error has occured</span>
          </CardTitle>
          <CardDescription>
            Our engineers are working on it. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
