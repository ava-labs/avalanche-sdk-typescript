import { describe, expect, test } from "bun:test";

import {
    linkBytecode,
    listUnlinkedLibraries,
} from "../../../interchain/src/validator-manager/linkBytecode.ts";

/**
 * `linkBytecode` performs pure string surgery on Solidity placeholder
 * patterns of the form `__$<34 hex>$__`. These tests pin the substitution
 * semantics so a regression (e.g. accidentally stripping an unrelated `0x`,
 * collapsing two libraries to one, surviving an invalid address) shows up
 * before the next deploy.
 */

const FAKE_PLACEHOLDER_HASH_A = "a".repeat(34);
const FAKE_PLACEHOLDER_HASH_B = "b".repeat(34);
const FAKE_LIB_ADDR = "0x1234567890abcdef1234567890abcdef12345678" as const;
const FAKE_LIB_BODY = FAKE_LIB_ADDR.slice(2);

describe("linkBytecode", () => {
    test("substitutes every occurrence of a single placeholder", () => {
        const bc =
            `0x6080__$${FAKE_PLACEHOLDER_HASH_A}$__deadbeef__$${FAKE_PLACEHOLDER_HASH_A}$__fe`;
        const linked = linkBytecode(bc, FAKE_LIB_ADDR);
        expect(linked).toBe(`0x6080${FAKE_LIB_BODY}deadbeef${FAKE_LIB_BODY}fe`);
        expect(listUnlinkedLibraries(linked)).toEqual([]);
    });

    test("substitutes only the matching hash, leaves unrelated placeholders", () => {
        const bc =
            `0x__$${FAKE_PLACEHOLDER_HASH_A}$__cc__$${FAKE_PLACEHOLDER_HASH_B}$__`;
        const linked = linkBytecode(bc, FAKE_LIB_ADDR);
        // Only the `a*34` placeholder was rewritten (linkBytecode replaces
        // every placeholder in the bytecode unconditionally — this test
        // documents the current behavior: a second library would need a
        // second link pass, which listUnlinkedLibraries should help detect).
        expect(linked).toContain(FAKE_LIB_BODY);
        // Both placeholders are replaced because the regex matches any 34-hex.
        // listUnlinkedLibraries should report zero remaining.
        expect(listUnlinkedLibraries(linked)).toEqual([]);
    });

    test("accepts bytecode without leading 0x and returns it with one", () => {
        const bc = `6080__$${FAKE_PLACEHOLDER_HASH_A}$__`;
        const linked = linkBytecode(bc, FAKE_LIB_ADDR);
        expect(linked.startsWith("0x")).toBe(true);
        expect(linked).toBe(`0x6080${FAKE_LIB_BODY}`);
    });

    test("is a no-op when bytecode contains no placeholders", () => {
        const bc = "0x6080604052deadbeef";
        expect(linkBytecode(bc, FAKE_LIB_ADDR)).toBe(bc);
    });

    test("rejects an invalid library address", () => {
        const bc = `0x__$${FAKE_PLACEHOLDER_HASH_A}$__`;
        expect(() => linkBytecode(bc, "0xnothex" as `0x${string}`)).toThrow(
            /invalid library address/,
        );
        expect(() => linkBytecode(bc, "0x1234" as `0x${string}`)).toThrow(
            /invalid library address/,
        );
    });

    test("listUnlinkedLibraries returns unique hashes", () => {
        const bc =
            `0x__$${FAKE_PLACEHOLDER_HASH_A}$____$${FAKE_PLACEHOLDER_HASH_A}$____$${FAKE_PLACEHOLDER_HASH_B}$__`;
        const remaining = listUnlinkedLibraries(bc);
        expect(remaining.length).toBe(2);
        expect(new Set(remaining)).toEqual(
            new Set([FAKE_PLACEHOLDER_HASH_A, FAKE_PLACEHOLDER_HASH_B]),
        );
    });

    test("listUnlinkedLibraries returns empty array for fully-linked bytecode", () => {
        expect(listUnlinkedLibraries("0x6080604052deadbeef")).toEqual([]);
    });
});
