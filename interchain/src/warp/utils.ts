import { utils } from "@avalabs/avalanchejs";

/**
 * Parses a bech32 address to bytes.
 * @param bech32Address The bech32 address string to parse.
 * @param chainAlias The chain alias to add to the address if it's not already present.
 * @returns The bytes of the address.
 */
export function parseBech32AddressToBytes(bech32Address: string, chainAlias?: string) {
    if (bech32Address.includes('-')) {
        return utils.bech32ToBytes(bech32Address);
    }
    // separator not present, adding chainAlias + '-' if provided
    if (chainAlias) {
        return utils.bech32ToBytes(`${chainAlias}-${bech32Address}`);
    }
    throw new Error(`Invalid address: ${bech32Address}. No chain alias provided.`);
}

export function evmAddressToBytes(address: string) {
    let evmAddress = address;
    if (!evmAddress.startsWith('0x')) {
        evmAddress = `0x${evmAddress}`;
    }
    // EVM addresses are 20 bytes (0x + 40 chars)
    if (evmAddress.length === 42) {
        return utils.hexToBuffer(evmAddress);
    }
    throw new Error(`Invalid EVM address: ${address}`);
}

export function bech32AddressToBytes(address: string) {
    // Check if it's a Bech32 address (contains a hyphen)
    if (address.includes('-')) {
        return utils.bech32ToBytes(address);
    }

    // If it's a Bech32 address without chain alias, add P- prefix
    return utils.bech32ToBytes(`P-${address}`);
}

/**
 * Parses a node ID into its raw 20-byte representation.
 *
 * Accepts any of:
 *   - `NodeID-<base58check>` (canonical Avalanche format)
 *   - `<base58check>` (NodeID without the `NodeID-` prefix)
 *   - `0x<40 hex chars>` (raw hex, as returned by `platform.getTx` over JSON-RPC)
 *
 * @param nodeId - The node ID in any supported format.
 * @returns 20 raw bytes of the node ID.
 */
export function nodeIdToBytes(nodeId: string): Uint8Array {
    if (nodeId.startsWith("0x") || /^[0-9a-fA-F]+$/.test(nodeId)) {
        return utils.hexToBuffer(nodeId.startsWith("0x") ? nodeId : `0x${nodeId}`);
    }
    const stripped = nodeId.startsWith("NodeID-") ? nodeId.slice("NodeID-".length) : nodeId;
    return utils.base58check.decode(stripped);
}

export function evmOrBech32AddressToBytes(address: string) {
    // Empty source address is valid for warp messages that don't have a sender
    // (e.g. system-originated L1 validator messages).
    if (address === "" || address === "0x") {
        return new Uint8Array(0);
    }
    try {
        return evmAddressToBytes(address);
    } catch (error) {
        return bech32AddressToBytes(address);
    }
}
