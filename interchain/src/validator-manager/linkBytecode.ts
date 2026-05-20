/**
 * Solidity library link resolver.
 *
 * The Solidity compiler emits library-using contracts with 40-character
 * placeholders of the form `__$<34 hex>$__` wherever the library address
 * needs to be substituted at deploy time. The 34-hex value is the first
 * 34 chars of keccak256(fullyQualifiedLibraryName).
 *
 * To deploy a linked contract:
 *   1. Deploy the library; capture its address.
 *   2. Replace every placeholder in the contract bytecode with the lowercase
 *      40-char hex form of that address (no leading `0x`).
 *
 * This module is a tiny utility so callers don't have to roll string
 * surgery themselves.
 */

const PLACEHOLDER_RE = /__\$([0-9a-fA-F]{34})\$__/g;

/**
 * Replace all library link placeholders in `bytecode` with `libraryAddress`.
 *
 * @param bytecode - contract creation bytecode containing one or more
 *   `__$<hash>$__` placeholders, with or without the leading `0x`.
 * @param libraryAddress - 0x-prefixed 20-byte address of the deployed library.
 * @returns the linked bytecode, 0x-prefixed.
 * @throws if {@link libraryAddress} is not a valid 20-byte hex string.
 */
export function linkBytecode(
    bytecode: string,
    libraryAddress: `0x${string}`,
): `0x${string}` {
    const stripped = libraryAddress.replace(/^0x/, "").toLowerCase();
    if (stripped.length !== 40 || !/^[0-9a-f]+$/.test(stripped)) {
        throw new Error(`linkBytecode: invalid library address ${libraryAddress}`);
    }
    const body = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;
    const linked = body.replace(PLACEHOLDER_RE, stripped);
    return `0x${linked}`;
}

/**
 * Returns the unique set of library placeholder hashes present in `bytecode`,
 * useful for asserting that all links are resolved before deploy.
 */
export function listUnlinkedLibraries(bytecode: string): string[] {
    const out = new Set<string>();
    for (const m of bytecode.matchAll(PLACEHOLDER_RE)) {
        out.add(m[1]!);
    }
    return Array.from(out);
}
