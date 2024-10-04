import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { useTokenContext } from "@/context/tokenContext";
import { TransferForm } from "@/components/transfer-wizard/transfer-form";

vi.mock("@/hooks/useAccountBalance");
vi.mock("@/context/tokenContext");

type TransferFormProps = {
  data: { recipient?: string; amount?: string };
  onClose: () => void;
  onNext: (data: { recipient: string; amount: string }) => void;
};

describe("TransferForm Component", () => {
  const mockOnClose = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    (useAccountBalance as jest.Mock).mockReturnValue({
      formattedBalance: "100,000.00",
      queryKey: [],
      isSuccess: true,
    });

    (useTokenContext as jest.Mock).mockReturnValue({
      tokenSymbol: "BIT",
    });
  });

  const renderComponent = (props?: Partial<TransferFormProps>) => {
    const defaultProps: TransferFormProps = {
      data: { recipient: "", amount: "" },
      onClose: mockOnClose,
      onNext: mockOnNext,
      ...props,
    };

    return render(<TransferForm {...defaultProps} />);
  };

  it("renders the form with default values", () => {
    renderComponent();

    expect(screen.getByLabelText(/Recipient Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You have: 100,000.00 BIT available/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("submits the form successfully with valid data", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "0x1234567890abcdef1234567890abcdef12345678" },
    });

    fireEvent.change(amountInput, {
      target: { value: "50,000" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith({
        recipient: "0x1234567890abcdef1234567890abcdef12345678",
        amount: "50,000",
      });
    });

    expect(
      screen.queryByText(/Recipient address is required/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Amount is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Amount exceeds available balance/i)
    ).not.toBeInTheDocument();
  });

  it("shows validation error when amount exceeds balance", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "0x1234567890abcdef1234567890abcdef12345678" },
    });
    fireEvent.change(amountInput, {
      target: { value: "150,000" }, // Balance is 100,000.00
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount exceeds available balance/i)
      ).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("submits the form with an amount containing commas", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "0x1234567890abcdef1234567890abcdef12345678" },
    });

    fireEvent.change(amountInput, {
      target: { value: "1,000" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith({
        recipient: "0x1234567890abcdef1234567890abcdef12345678",
        amount: "1,000",
      });
    });

    expect(
      screen.queryByText(/Amount must be a positive number/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Amount exceeds available balance/i)
    ).not.toBeInTheDocument();
  });

  it("shows validation error for incorrectly formatted amount with commas", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "0x1234567890abcdef1234567890abcdef12345678" },
    });
    fireEvent.change(amountInput, {
      target: { value: "1,00,0" }, // Incorrectly formatted
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid amount/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid recipient address", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "invalid_address" },
    });
    fireEvent.change(amountInput, {
      target: { value: "50,000" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid Ethereum address/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });
});
