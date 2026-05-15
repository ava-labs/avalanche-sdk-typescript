import { describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";

import {
    newConversionData,
    newL1ValidatorRegistrationMessage,
    newL1ValidatorWeightMessage,
    newRegisterL1ValidatorMessage,
    newSubnetToL1ConversionMessage,
    newValidationUptimeMessage,
    parseConversionData,
    parseL1ValidatorRegistrationMessage,
    parseL1ValidatorWeightMessage,
    parseRegisterL1ValidatorMessage,
    parseSubnetToL1ConversionMessage,
    parseValidationUptimeMessage,
} from "../../../interchain/src/warp/index.ts";

/**
 * Round-trip serialization tests for every AddressedCall message type the
 * SDK ships. Each `new...` builder feeds into the matching `parse...` and
 * the resulting field values must equal the originals byte-for-byte (after
 * accounting for the codec layer).
 *
 * These tests pin the wire format so any silent shift in avalanchejs's
 * codec or in our `toHex()` implementations gets caught immediately
 * (without needing a 9-minute e2e run).
 */

const SUBNET_ID_B58 = "BDfW7SyeCh9Puiw1EBWrx653xQnzGtUrV9k83rAodqiCMViXZ";
const VALIDATION_ID_B58 = "11111111111111111111111111111111LpoYY"; // 32 zero bytes
const NODE_ID = "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg";
const BLS_PUB =
    "0x933320c54cdb8159038d9a90df5601a80f206a08c4a8a81c7f0f139bb64d7cfb43bbfd88e47e970e84114649c616ab85" as const;
// Re-encode the 20-byte EWOQ hash as a P-local bech32 string. Keeps the
// test independent of a wallet client — we just need a syntactically
// valid bech32 P-address that parseBech32AddressToBytes will accept.
const EWOQ_P_BYTES = new Uint8Array([
    0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a, 0x0e, 0xbd,
    0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68, 0x61, 0xe1, 0xb2, 0x9c,
]);
const EWOQ_P_LOCAL = `P-${utils.formatBech32("local", EWOQ_P_BYTES)}`;
const P_CHAIN_OWNER = {
    threshold: 1,
    addresses: [EWOQ_P_LOCAL],
};

describe("warp AddressedCall messages — round-trip", () => {
    test("SubnetToL1ConversionMessage", () => {
        const msg = newSubnetToL1ConversionMessage(SUBNET_ID_B58);
        const parsed = parseSubnetToL1ConversionMessage(msg.toHex());
        expect(utils.bufferToHex(parsed.conversionId.toBytes())).toBe(
            utils.bufferToHex(utils.base58check.decode(SUBNET_ID_B58)),
        );
    });

    test("L1ValidatorRegistrationMessage(true)", () => {
        const msg = newL1ValidatorRegistrationMessage(VALIDATION_ID_B58, true);
        const parsed = parseL1ValidatorRegistrationMessage(msg.toHex());
        expect((parsed.registered as { value(): boolean }).value()).toBe(true);
        expect(utils.bufferToHex(parsed.validationId.toBytes())).toBe(
            utils.bufferToHex(utils.base58check.decode(VALIDATION_ID_B58)),
        );
    });

    test("L1ValidatorRegistrationMessage(false)", () => {
        const msg = newL1ValidatorRegistrationMessage(VALIDATION_ID_B58, false);
        const parsed = parseL1ValidatorRegistrationMessage(msg.toHex());
        expect((parsed.registered as { value(): boolean }).value()).toBe(false);
    });

    test("L1ValidatorWeightMessage", () => {
        const nonce = 42n;
        const weight = 100n;
        const msg = newL1ValidatorWeightMessage(VALIDATION_ID_B58, nonce, weight);
        const parsed = parseL1ValidatorWeightMessage(msg.toHex());
        expect((parsed.nonce as { value(): bigint }).value()).toBe(nonce);
        expect((parsed.weight as { value(): bigint }).value()).toBe(weight);
    });

    test("RegisterL1ValidatorMessage", () => {
        const expiry = 1_700_000_000n;
        const weight = 50n;
        const msg = newRegisterL1ValidatorMessage(
            SUBNET_ID_B58,
            NODE_ID,
            BLS_PUB,
            expiry,
            P_CHAIN_OWNER,
            P_CHAIN_OWNER,
            weight,
        );
        const parsed = parseRegisterL1ValidatorMessage(msg.toHex());
        expect(utils.bufferToHex(parsed.subnetId.toBytes())).toBe(
            utils.bufferToHex(utils.base58check.decode(SUBNET_ID_B58)),
        );
        expect((parsed.expiry as { value(): bigint }).value()).toBe(expiry);
        expect((parsed.weight as { value(): bigint }).value()).toBe(weight);
    });

    test("ValidationUptimeMessage", () => {
        const uptime = 12345n;
        const msg = newValidationUptimeMessage(VALIDATION_ID_B58, uptime);
        const parsed = parseValidationUptimeMessage(msg.toHex());
        expect(parsed.uptime).toBe(uptime);
        // validationId is the raw 32 bytes
        expect(parsed.validationId.length).toBe(32);
    });

    test("ConversionData — canonical bytes are sha256-stable", () => {
        const validators = [
            {
                nodeId: NODE_ID,
                blsPublicKey: BLS_PUB,
                weight: 100n,
            },
        ];
        const a = newConversionData(
            SUBNET_ID_B58,
            VALIDATION_ID_B58, // any 32-byte ID works as a blockchain ID for this test
            "0xfacade0000000000000000000000000000000000",
            validators,
        );
        const b = newConversionData(
            SUBNET_ID_B58,
            VALIDATION_ID_B58,
            "0xfacade0000000000000000000000000000000000",
            validators,
        );
        expect(a.toHex()).toBe(b.toHex());
        expect(a.getConversionId()).toBe(b.getConversionId());
    });

    test("ConversionData validators are sorted by raw nodeID bytes", () => {
        // Avalanche canonical encoding requires nodeID-ascending order.
        // Construct with reversed input and confirm the encoded bytes still
        // match the canonical ordering.
        const nodeA = "NodeID-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // unlikely real value
        const nodeB = "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg";
        const forward = newConversionData(
            SUBNET_ID_B58,
            VALIDATION_ID_B58,
            "0xfacade0000000000000000000000000000000000",
            [
                { nodeId: nodeB, blsPublicKey: BLS_PUB, weight: 10n },
                { nodeId: nodeA, blsPublicKey: BLS_PUB, weight: 20n },
            ],
        );
        const reversed = newConversionData(
            SUBNET_ID_B58,
            VALIDATION_ID_B58,
            "0xfacade0000000000000000000000000000000000",
            [
                { nodeId: nodeA, blsPublicKey: BLS_PUB, weight: 20n },
                { nodeId: nodeB, blsPublicKey: BLS_PUB, weight: 10n },
            ],
        );
        // Both input orders should produce the same canonical bytes.
        expect(forward.toHex()).toBe(reversed.toHex());
    });

    test("parseConversionData round-trip is broken (FOLLOWUP guard)", () => {
        // FOLLOWUP: parseConversionData uses avalanchejs's generic unpack,
        // which expects an extra 4-byte length prefix on the validators
        // array that the canonical Avalanche encoding does NOT include.
        // The parse silently drops the validators rather than throwing —
        // worse than a clean failure. This test pins the current broken
        // behavior so we notice when avalanchejs ships a fix.
        const cd = newConversionData(
            SUBNET_ID_B58,
            VALIDATION_ID_B58,
            "0xfacade0000000000000000000000000000000000",
            [{ nodeId: NODE_ID, blsPublicKey: BLS_PUB, weight: 100n }],
        );
        const hex = cd.toHex();
        const parsed = parseConversionData(hex);
        // Currently fails (parsed validators dropped → shorter bytes). When
        // this assertion starts passing, the upstream is fixed — flip to
        // toEqual(hex) and remove this comment.
        expect(parsed.toHex()).not.toBe(hex);
    });
});
