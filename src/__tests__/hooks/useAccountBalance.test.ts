import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import * as wagmi from "wagmi";

vi.mock("@/utils/formatBigInt", () => ({
  formatBigInt: (value: bigint, decimals: number) => {
    return (Number(value) / 10 ** decimals).toFixed(2);
  },
}));

vi.mock("wagmi", async () => {
  const actual = await vi.importActual<typeof wagmi>("wagmi");
  return {
    ...actual,
    useAccount: vi.fn(),
    useReadContract: vi.fn(),
  };
});

describe("Account Balance Hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890abcdef1234567890abcdef12345678",
      isDisconnected: false,
    });

    (wagmi.useReadContract as jest.Mock).mockReturnValue({
      data: BigInt("1000000000000000000"), // Example: 1 token with 18 decimals
      queryKey: ["balanceOf", "0x1234567890abcdef1234567890abcdef12345678"],
      isSuccess: true,
    });
  });

  it("should return the formatted account balance", () => {
    const { result } = renderHook(() => useAccountBalance());

    expect(result.current.formattedBalance).toBe("1.00");
    expect(result.current.queryKey).toEqual([
      "balanceOf",
      "0x1234567890abcdef1234567890abcdef12345678",
    ]);
    expect(result.current.isSuccess).toBe(true);
  });

  it("should return '0' when balance is not available", () => {
    (wagmi.useReadContract as jest.Mock).mockReturnValueOnce({
      data: null,
      queryKey: ["balanceOf", "0x1234567890abcdef1234567890abcdef12345678"],
      isSuccess: false,
    });

    const { result } = renderHook(() => useAccountBalance());

    expect(result.current.formattedBalance).toBe("0");
    expect(result.current.queryKey).toEqual([
      "balanceOf",
      "0x1234567890abcdef1234567890abcdef12345678",
    ]);
    expect(result.current.isSuccess).toBe(false);
  });
});
