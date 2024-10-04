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
      formattedBalance: "100.00",
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
      screen.getByText(/You have: 100.00 BIT available/i)
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
      target: { value: "50" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith({
        recipient: "0x1234567890abcdef1234567890abcdef12345678",
        amount: "50",
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

  it("shows validation error for empty recipient address", async () => {
    renderComponent();

    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(amountInput, {
      target: { value: "50" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Recipient address is required/i)
      ).toBeInTheDocument();
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
      target: { value: "50" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid Ethereum address/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("shows validation error for empty amount", async () => {
    renderComponent();

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(recipientInput, {
      target: { value: "0x1234567890abcdef1234567890abcdef12345678" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Amount is required/i)).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("shows validation error for non-numeric amount", async () => {
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
      target: { value: "abc" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount must be a positive number/i)
      ).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("shows validation error for negative amount", async () => {
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
      target: { value: "-10" },
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount must be a positive number/i)
      ).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
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
      target: { value: "150" }, // Balance is 100.00
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount exceeds available balance/i)
      ).toBeInTheDocument();
    });

    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel button is clicked", async () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });

    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles initial default values correctly", () => {
    const initialData = {
      recipient: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      amount: "25",
    };

    renderComponent({ data: initialData });

    const recipientInput = screen.getByLabelText(
      /Recipient Address/i
    ) as HTMLInputElement;
    const amountInput = screen.getByLabelText(/Amount/i) as HTMLInputElement;

    expect(recipientInput.value).toBe(
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    );
    expect(amountInput.value).toBe("25");
  });

  it("shows '0' as balance when formattedBalance is not available", () => {
    (useAccountBalance as jest.Mock).mockReturnValueOnce({
      formattedBalance: "0",
      queryKey: [],
      isSuccess: false,
    });

    renderComponent();

    expect(screen.getByText(/You have: 0 BIT available/i)).toBeInTheDocument();
  });
});
