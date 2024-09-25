import { BigNumberish, ethers } from "ethers";

export function formatBigInt(balance: BigNumberish, decimals: number) {
  let formattedBalance = ethers.formatUnits(balance, decimals);

  formattedBalance = Intl.NumberFormat().format(parseFloat(formattedBalance));

  return formattedBalance;
}
