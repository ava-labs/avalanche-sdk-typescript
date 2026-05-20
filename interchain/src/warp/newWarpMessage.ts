import { newAddressedCallPayload } from "./addressedCallPayload";
import { newWarpUnsignedMessage, WarpUnsignedMessage } from "./warpUnsignedMessage";

/**
 * Convenience helper that wraps a warp message payload in an AddressedCall and
 * then in an UnsignedMessage in one step.
 *
 * @param networkId - The Avalanche network ID (1 for mainnet, 5 for Fuji).
 * @param sourceChainId - The source blockchain ID (base58check encoded).
 * @param sourceAddress - The source address (EVM or Bech32). Pass `""` or
 *                       `"0x"` for system-originated messages (no sender) —
 *                       {@link newAddressedCallPayload} handles the canonical
 *                       zero-length-source encoding so the resulting warp
 *                       message hash matches what P-Chain and L1 validators
 *                       sign.
 * @param payloadHex - The inner AddressedCall payload as a hex string (e.g. from
 *                     `newL1ValidatorWeightMessage(...).toHex()`).
 * @returns A WarpUnsignedMessage ready to be signed/aggregated. Call `.toHex()` to serialize.
 */
export function newWarpMessage(
    networkId: number,
    sourceChainId: string,
    sourceAddress: string,
    payloadHex: string,
): WarpUnsignedMessage {
    const addressedCallHex = newAddressedCallPayload(sourceAddress, payloadHex).toHex();
    return newWarpUnsignedMessage(networkId, sourceChainId, addressedCallHex);
}
