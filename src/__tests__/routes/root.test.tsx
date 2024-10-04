import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Root } from "@/routes/root";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

vi.mock("wagmi", () => ({
  useAccount: vi.fn(),
}));

vi.mock("connectkit", () => ({
  ConnectKitButton: {
    Custom: vi.fn(),
  },
}));

const Dashboard = () => <div>Dashboard Page</div>;
const Login = () => <div>Login Page</div>;

describe("Root Component", () => {
  const mockUseAccount = useAccount as unknown as jest.Mock;

  const MockedConnectKitButtonCustom =
    ConnectKitButton.Custom as unknown as jest.Mock;

  const showMock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    mockUseAccount.mockReturnValue({
      isConnected: false,
      address: "",
    });

    MockedConnectKitButtonCustom.mockImplementation(
      ({ children }: { children: Function }) =>
        children({
          isConnected: false,
          show: showMock,
          address: "",
        })
    );
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders correctly when connected", async () => {
    MockedConnectKitButtonCustom.mockImplementationOnce(
      ({ children }: { children: Function }) =>
        children({
          isConnected: true,
          show: showMock,
          address: "0x1234567890abcdef1234567890abcdef12345678",
        })
    );

    mockUseAccount.mockReturnValue({
      isConnected: true,
      address: "0x1234567890abcdef1234567890abcdef12345678",
    });

    renderWithRouter();

    const connectButton = screen.getByRole("button", {
      name: "0x1234...5678",
    });
    expect(connectButton).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
    });
  });
  it("renders correctly when disconnected", async () => {
    renderWithRouter();

    const connectButton = screen.getByRole("button", {
      name: "Connect Wallet",
    });
    expect(connectButton).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
