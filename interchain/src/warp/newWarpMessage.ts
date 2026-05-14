import { utils } from "@avalabs/avalanchejs";

import { newAddressedCallPayload } from "./addressedCallPayload";
import { concatBytes, u16, u32 } from "./utils";
import { newWarpUnsignedMessage, WarpUnsignedMessage } from "./warpUnsignedMessage";

const ADDRESSED_CALL_TYPE_ID = 1;

/**
 * Build the canonical AddressedCall byte layout for a *system* source (no sender):
 *   codecID(uint16=0) | typeID(uint32=1) | sourceAddrLen(uint32=0) | payloadLen(uint32) | payload
 *
 * Bypasses `pvmSerial.warp.AddressedCallPayloads.AddressedCall`, which serializes
 * the source address through `Address` (fixed 20 bytes) and would emit 20 zero
 * bytes instead of a true zero-length source address. P-Chain and L1 validators
 * sign the variable-length encoding — the 20-byte version produces a different
 * message hash and the signature aggregator will not converge.
 */
function buildSystemSourceAddressedCallHex(payloadHex: string): string {
    const payloadBytes = utils.hexToBuffer(payloadHex);
    return utils.bufferToHex(
        concatBytes(u16(0), u32(ADDRESSED_CALL_TYPE_ID), u32(0), u32(payloadBytes.length), payloadBytes),
    );
}

/**
 * Convenience helper that wraps a warp message payload in an AddressedCall and
 * then in an UnsignedMessage in one step.
 *
 * @param networkId - The Avalanche network ID (1 for mainnet, 5 for Fuji).
 * @param sourceChainId - The source blockchain ID (base58check encoded).
 * @param sourceAddress - The source address (EVM or Bech32). Pass empty string for
 *                       system-originated messages (no sender) — emits a zero-length
 *                       source address per the canonical Warp encoding.
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
    const addressedCallHex =
        sourceAddress === "" || sourceAddress === "0x"
            ? buildSystemSourceAddressedCallHex(payloadHex)
            : newAddressedCallPayload(sourceAddress, payloadHex).toHex();
    return newWarpUnsignedMessage(networkId, sourceChainId, addressedCallHex);
}
