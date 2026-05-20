import { decodeAbiParameters, type TransactionReceipt } from "viem";

/** Address of the Warp precompile on every Avalanche EVM chain. */
export const WARP_PRECOMPILE_ADDRESS = "0x0200000000000000000000000000000000000005" as const;

/** keccak256("SendWarpMessage(address,bytes32,bytes)") — the topic0 of the warp send event. */
export const WARP_MESSAGE_TOPIC = "0x56600c567728a800c0aa927500f831cb451df66a7af570eb4df4dfbf4674887d" as const;

/**
 * Extracts the unsigned warp message bytes from an EVM transaction receipt.
 *
 * Locates the `SendWarpMessage` event emitted by the Warp precompile and decodes its
 * `bytes message` data parameter.
 *
 * @param receipt - The EVM transaction receipt to scan.
 * @returns The unsigned warp message as a 0x-prefixed hex string.
 * @throws If no `SendWarpMessage` event from the Warp precompile is present.
 */
export function extractWarpMessageFromReceipt(receipt: TransactionReceipt): `0x${string}` {
    if (!receipt.logs || receipt.logs.length === 0) {
        throw new Error("No logs in transaction receipt — cannot extract warp message.");
    }

    const warpEvent = receipt.logs.find((log) =>
        log?.address?.toLowerCase() === WARP_PRECOMPILE_ADDRESS.toLowerCase() &&
        log?.topics?.[0]?.toLowerCase() === WARP_MESSAGE_TOPIC.toLowerCase()
    );
    if (!warpEvent?.data) {
        throw new Error(
            `Could not locate SendWarpMessage event from ${WARP_PRECOMPILE_ADDRESS} in transaction receipt.`,
        );
    }
    const [decoded] = decodeAbiParameters([{ type: "bytes", name: "message" }], warpEvent.data);
    return decoded as `0x${string}`;
}

/**
 * Packs a warp message into an EVM access list entry targeting the Warp precompile.
 *
 * The Warp precompile reads its input from the transaction's access list rather than calldata.
 * This helper chunks the message into 32-byte storage keys with a 0xFF terminator byte and
 * trailing zero padding to a 32-byte boundary, then returns a single-entry access list ready
 * to pass to viem's `writeContract` / `prepareTransactionRequest`.
 *
 * @param warpMessageBytes - The full unsigned (or signed) warp message bytes.
 * @returns A single-entry access list pinned to {@link WARP_PRECOMPILE_ADDRESS}.
 */
export function packWarpIntoAccessList(warpMessageBytes: Uint8Array): [
    {
        address: `0x${string}`;
        storageKeys: `0x${string}`[];
    },
] {
    const CHUNK_SIZE = 32;
    const padded = Array.from(warpMessageBytes);
    padded.push(0xff);
    const padLen = (CHUNK_SIZE - (padded.length % CHUNK_SIZE)) % CHUNK_SIZE;
    for (let i = 0; i < padLen; i++) padded.push(0);

    const storageKeys: `0x${string}`[] = [];
    for (let i = 0; i < padded.length; i += CHUNK_SIZE) {
        const chunk = padded.slice(i, i + CHUNK_SIZE);
        const hex = chunk.map((b) => b.toString(16).padStart(2, "0")).join("");
        storageKeys.push(`0x${hex}` as `0x${string}`);
    }

    return [{ address: WARP_PRECOMPILE_ADDRESS, storageKeys }];
}
