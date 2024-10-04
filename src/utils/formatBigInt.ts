import { BigNumberish, ethers } from "ethers";

export function formatBigInt(balance: BigNumberish, decimals: number) {
  let formattedBalance = ethers.formatUnits(balance, decimals);

  const numericBalance = parseFloat(formattedBalance);
  if (isNaN(numericBalance)) {
    return "0";
  }

  formattedBalance = numericBalance.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formattedBalance;
}
