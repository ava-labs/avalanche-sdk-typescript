import { describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";
import { bytesToHex } from "viem";

import {
    evmOrBech32AddressToBytes,
    nodeIdToBytes,
    parseBech32AddressToBytes,
} from "../src/warp/utils.ts";

/**
 * Address-parsing helpers in warp/utils.ts get exercised implicitly through
 * the integration suite, but the input-format matrix is wider than the e2e
 * uses (multiple NodeID encodings, EVM vs bech32, etc.). These tests pin
 * the parsing contract.
 */

const NODE_ID_BASE58 = "7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg";
const NODE_ID_FULL = `NodeID-${NODE_ID_BASE58}`;
const NODE_ID_HEX_LOWER = bytesToHex(utils.base58check.decode(NODE_ID_BASE58));

describe("nodeIdToBytes", () => {
    test("accepts NodeID-<base58check>", () => {
        const out = nodeIdToBytes(NODE_ID_FULL);
        expect(out.length).toBe(20);
        expect(bytesToHex(out)).toBe(NODE_ID_HEX_LOWER);
    });

    test("accepts bare base58check (no NodeID- prefix)", () => {
        const out = nodeIdToBytes(NODE_ID_BASE58);
        expect(out.length).toBe(20);
        expect(bytesToHex(out)).toBe(NODE_ID_HEX_LOWER);
    });

    test("accepts 0x-prefixed 20-byte hex", () => {
        const out = nodeIdToBytes(NODE_ID_HEX_LOWER);
        expect(bytesToHex(out)).toBe(NODE_ID_HEX_LOWER);
    });

    test("accepts bare 40-char hex (no 0x prefix)", () => {
        const stripped = NODE_ID_HEX_LOWER.slice(2);
        const out = nodeIdToBytes(stripped);
        expect(bytesToHex(out)).toBe(NODE_ID_HEX_LOWER);
    });
});

describe("parseBech32AddressToBytes", () => {
    const EWOQ_P_BYTES = new Uint8Array([
        0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a, 0x0e, 0xbd,
        0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68, 0x61, 0xe1, 0xb2, 0x9c,
    ]);
    const EWOQ_P_LOCAL = `P-${utils.formatBech32("local", EWOQ_P_BYTES)}`;

    test("decodes a P-<hrp>1... bech32 address", () => {
        const out = parseBech32AddressToBytes(EWOQ_P_LOCAL);
        expect(out.length).toBe(20);
        expect(bytesToHex(out)).toBe(bytesToHex(EWOQ_P_BYTES));
    });

    test("prepends a chain alias when input has no '-' separator", () => {
        const noPrefix = utils.formatBech32("local", EWOQ_P_BYTES);
        const out = parseBech32AddressToBytes(noPrefix, "P");
        expect(bytesToHex(out)).toBe(bytesToHex(EWOQ_P_BYTES));
    });

    test("throws when no chain alias is provided for an unprefixed address", () => {
        const noPrefix = utils.formatBech32("local", EWOQ_P_BYTES);
        expect(() => parseBech32AddressToBytes(noPrefix)).toThrow(/No chain alias/);
    });
});

describe("evmOrBech32AddressToBytes", () => {
    test("decodes a 0x-prefixed EVM address", () => {
        const out = evmOrBech32AddressToBytes("0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC");
        expect(out.length).toBe(20);
    });

    test("decodes a bech32 P-Chain address", () => {
        const EWOQ_P_BYTES = new Uint8Array([
            0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a, 0x0e, 0xbd,
            0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68, 0x61, 0xe1, 0xb2, 0x9c,
        ]);
        const EWOQ_P_LOCAL = `P-${utils.formatBech32("local", EWOQ_P_BYTES)}`;
        const out = evmOrBech32AddressToBytes(EWOQ_P_LOCAL);
        expect(out.length).toBe(20);
        expect(bytesToHex(out)).toBe(bytesToHex(EWOQ_P_BYTES));
    });

    test("returns empty bytes for system-source ('' or '0x')", () => {
        // The system-source convention for outgoing warp messages with no
        // sender. Callers (newWarpMessage) check for this and emit a
        // zero-length source address — the BLS-signature path depends on
        // exactly that variable-length encoding.
        expect(evmOrBech32AddressToBytes("").length).toBe(0);
        expect(evmOrBech32AddressToBytes("0x").length).toBe(0);
    });
});
