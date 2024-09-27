import * as ReactDOM from "react-dom/client";
import Dashboard from "./routes/dashboard.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/root.tsx";
import { Web3Provider } from "./providers/wallet-provider.tsx";
import { Login } from "./routes/login.tsx";
import { ErrorBoundary } from "./components/error-boundary.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { PrivateRoute } from "./routes/private-route.tsx";
import { TokenProvider } from "./context/token-context.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "login",
        element: <Login />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "dashboard",
        element: <PrivateRoute />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <TokenProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
      <Toaster />
    </TokenProvider>
  </Web3Provider>
);
