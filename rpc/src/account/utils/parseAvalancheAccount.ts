import { Address } from "viem";
import { parseAccount } from "viem/utils";
import { AvalancheAccount } from "../avalancheAccount";

export function parseAvalancheAccount<
  accountOrAddress extends Address | AvalancheAccount
>(
  account: accountOrAddress
): accountOrAddress extends Address ? AvalancheAccount : accountOrAddress {
  if (typeof account === "string")
    return { evmAccount: parseAccount(account) as any } as any;
  return account as any;
}
