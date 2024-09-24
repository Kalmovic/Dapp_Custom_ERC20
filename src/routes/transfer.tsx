import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Transfer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <span>Transfer Token</span>
            <Link to="/" className="ml-auto text-black hover:text-gray-600">
              Cancel
            </Link>
          </div>
        </CardTitle>
        <CardDescription>
          Transfer your Bitso Token to another user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          1000 <span className="text-base">BIT</span>
        </p>
      </CardContent>
    </Card>
  );
}
