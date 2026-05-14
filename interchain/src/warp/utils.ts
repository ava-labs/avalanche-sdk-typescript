import { utils } from "@avalabs/avalanchejs";

// ---------------------------------------------------------------------------
// Big-endian primitive encoders / decoders.
//
// Used by the canonical Avalanche warp byte layout, where every multi-byte
// integer is big-endian-packed and length prefixes are 4 bytes.
// ---------------------------------------------------------------------------

export function u16(n: number): Uint8Array {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n, false);
    return b;
}

export function u32(n: number): Uint8Array {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, false);
    return b;
}

export function u64(n: bigint): Uint8Array {
    const b = new Uint8Array(8);
    new DataView(b.buffer).setBigUint64(0, n, false);
    return b;
}

export function readU16(b: Uint8Array, o: number): number {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getUint16(o, false);
}

export function readU32(b: Uint8Array, o: number): number {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(o, false);
}

export function readU64(b: Uint8Array, o: number): bigint {
    return new DataView(b.buffer, b.byteOffset, b.byteLength).getBigUint64(o, false);
}

/** Concatenate Uint8Arrays into one. */
export function concatBytes(...parts: Uint8Array[]): Uint8Array {
    const len = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(len);
    let off = 0;
    for (const p of parts) {
        out.set(p, off);
        off += p.length;
    }
    return out;
}

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
 *   - `<40 hex chars>` (raw hex without the `0x` prefix)
 *
 * Hex detection requires the `0x` prefix OR exactly 40 hex characters — the length guard
 * disambiguates the (rare but real) case of a base58check NodeID that happens to contain
 * only `[0-9a-fA-F]`.
 *
 * @param nodeId - The node ID in any supported format.
 * @returns 20 raw bytes of the node ID.
 */
export function nodeIdToBytes(nodeId: string): Uint8Array {
    if (nodeId.startsWith("0x")) {
        return utils.hexToBuffer(nodeId);
    }
    if (nodeId.length === 40 && /^[0-9a-fA-F]+$/.test(nodeId)) {
        return utils.hexToBuffer(`0x${nodeId}`);
    }
    const stripped = nodeId.startsWith("NodeID-") ? nodeId.slice("NodeID-".length) : nodeId;
    return utils.base58check.decode(stripped);
}

/**
 * Parses an EVM or Bech32 address to bytes.
 *
 * NOTE: Returns an empty `Uint8Array(0)` for `''` or `'0x'` — these represent the
 * system source for warp messages that don't have a sender (e.g. P-Chain-originated
 * L1 validator messages). Previously this case threw; callers that depended on the
 * throw must guard the empty string themselves.
 */
export function evmOrBech32AddressToBytes(address: string) {
    if (address === "" || address === "0x") {
        return new Uint8Array(0);
    }
    try {
        return evmAddressToBytes(address);
    } catch (error) {
        return bech32AddressToBytes(address);
    }
}
