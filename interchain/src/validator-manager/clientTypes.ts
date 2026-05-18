/**
 * Minimal structural interfaces for the viem `WalletClient` / `PublicClient`
 * shapes the validator-manager orchestrators actually use.
 *
 * WHY: viem's full `WalletClient<...>` / `PublicClient<...>` generics carry a
 * deep type-identity that doesn't unify across separate viem installations
 * (e.g. one viem under `interchain/node_modules/viem`, another under the
 * consumer package's `node_modules/viem`). Callers end up forced to write
 * `walletClient as never` at the boundary. Same instance, same shape,
 * different nominal types.
 *
 * These interfaces ARE the shape viem's clients already expose, just
 * structurally typed without viem's nominal generics. Any viem
 * `WalletClient` / `PublicClient` is structurally assignable to them.
 *
 * In other words: passing your own `WalletClient` to the orchestrators just
 * works without casts, even when viem is doubly installed in your monorepo.
 *
 * Internal callers still cast the params object to `never` when invoking
 * viem's strongly-typed `writeContract` / `simulateContract` — that's a
 * separate viem-generic narrowing issue and not the cross-instance one.
 */

import type { Hex } from "viem";

/** Lifted from viem so the rest of the SDK doesn't import viem types. */
export type AbiArg = unknown;
export type AbiObject = readonly unknown[];

/**
 * Minimal wallet-client shape used by the orchestrators.
 *
 * `writeContract` / `deployContract` are typed loosely (params: any) on
 * purpose — viem's strongly-typed versions don't narrow when the ABI is
 * passed as a value. The orchestrators always pass a fully-shaped params
 * object, so this loosening doesn't reduce call-site safety.
 */
export interface MinimalWalletClient {
    writeContract: (params: any) => Promise<Hex>;
    deployContract: (params: any) => Promise<Hex>;
    readonly chain?: { id?: number } | null | undefined;
    readonly account?: { address: `0x${string}` } | null | undefined;
}

/**
 * Minimal public-client shape used by the orchestrators.
 */
export interface MinimalPublicClient {
    waitForTransactionReceipt: (args: { hash: Hex }) => Promise<any>;
    simulateContract: (params: any) => Promise<any>;
    call: (params: any) => Promise<any>;
    // viem's `request` is a discriminated union over the RPC method name; we
    // accept the broadest shape so any viem PublicClient is structurally
    // assignable.
    request: (args: any) => Promise<any>;
}
