import { Address } from "viem";
import { parseAccount } from "viem/utils";
import { AvalancheAccount } from "../avalancheAccount";

/**
 * Parse an account or address to an AvalancheAccount
 *
 * @param account - The account or address to parse {@link AvalancheAccount}
 * @returns The parsed account {@link AvalancheAccount} or undefined if not provided
 *
 * @example
 * ```ts
 * import { parseAvalancheAccount } from "@avalanche-sdk/client/accounts";
 *
 * const account = parseAvalancheAccount("0xab....");
 * console.log(account);
 *
 * ```
 */
export function parseAvalancheAccount<
  accountOrAddress extends Address | AvalancheAccount | undefined
>(
  account: accountOrAddress
): accountOrAddress extends Address ? AvalancheAccount : accountOrAddress {
  if (typeof account === "string")
    return { evmAccount: parseAccount(account) as any } as any;
  return account as any;
}
