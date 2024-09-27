import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "wagmi";

export function PrivateRoute() {
  const { isConnected } = useAccount(); // use isConnected to determine login state

  return isConnected ? <Outlet /> : <Navigate to="/login" replace />;
}
