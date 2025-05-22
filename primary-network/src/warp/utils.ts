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

export function evmOrBech32AddressToBytes(address: string) {
    let evmAddress = address;
    if (!evmAddress.startsWith('0x')) {
        evmAddress = `0x${evmAddress}`;
    }
    // EVM addresses are 20 bytes (0x + 40 chars)
    if (evmAddress.length === 42) {
        return utils.hexToBuffer(evmAddress);
    }

    // Check if it's a Bech32 address (contains a hyphen)
    if (address.includes('-')) {
        return utils.bech32ToBytes(address);
    }

    // If it's a Bech32 address without chain alias, add P- prefix
    return utils.bech32ToBytes(`P-${address}`);
}
