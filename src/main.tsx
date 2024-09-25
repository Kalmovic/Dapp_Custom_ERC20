import * as ReactDOM from "react-dom/client";
import Dashboard from "./routes/dashboard.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Transfer from "./routes/transfer.tsx";
import { Root } from "./routes/root.tsx";
import { Web3Provider } from "./providers/wallet-provider.tsx";
import { Login } from "./routes/login.tsx";
import { ErrorBoundary } from "./components/error-boundary.tsx";

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
        index: true,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: "transfer",
            element: <Transfer />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <RouterProvider router={router} />
  </Web3Provider>
);
