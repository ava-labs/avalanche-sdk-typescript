import { describe, expect, test } from "bun:test";
import { utils } from "@avalabs/avalanchejs";

import {
    extractL1ValidatorWeightMessageFromPChainTx,
    extractRegisterL1ValidatorMessageFromPChainTx,
    extractSubnetToL1ConversionDataFromPChainTx,
} from "../src/validator-manager/extractFromPChainTx.ts";
import { P_CHAIN_BLOCKCHAIN_ID } from "../src/warp/constants.ts";
import { newL1ValidatorWeightMessage } from "../src/warp/addressedCallMessages/l1ValidatorWeightMessage.ts";
import { newRegisterL1ValidatorMessage } from "../src/warp/addressedCallMessages/registerL1ValidatorMessage.ts";
import { newWarpMessage } from "../src/warp/newWarpMessage.ts";

const SUBNET_ID_B58 = "BDfW7SyeCh9Puiw1EBWrx653xQnzGtUrV9k83rAodqiCMViXZ";
const VALIDATION_ID_B58 = "11111111111111111111111111111111LpoYY"; // 32 zero bytes
const CHAIN_ID_B58 = "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM";
const NODE_ID = "NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg";
const BLS_PUB =
    "0x933320c54cdb8159038d9a90df5601a80f206a08c4a8a81c7f0f139bb64d7cfb43bbfd88e47e970e84114649c616ab85";
// The 20-byte EWOQ hash re-encoded as a P-local bech32 string.
const EWOQ_P_BYTES = new Uint8Array([
    0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a, 0x0e, 0xbd,
    0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68, 0x61, 0xe1, 0xb2, 0x9c,
]);
const EWOQ_P_LOCAL = `P-${utils.formatBech32("local", EWOQ_P_BYTES)}`;
const P_CHAIN_OWNER = {
    threshold: 1,
    addresses: [EWOQ_P_LOCAL],
};

const FUJI_NETWORK_ID = 5;
const FAKE_RPC_URL = "https://test.invalid/ext/bc/P";
const FAKE_TX_ID = "fake-tx-id-only-used-as-passthrough";

/**
 * Build a Fetch-compatible mock that returns the given `unsignedTx` shape
 * as the result of a single `platform.getTx` call.
 */
function mockGetTx(unsignedTx: Record<string, unknown>): typeof fetch {
    return (async () => {
        return new Response(
            JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                result: { tx: { unsignedTx } },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    }) as unknown as typeof fetch;
}

describe("extractRegisterL1ValidatorMessageFromPChainTx", () => {
    test("decodes round-tripped fields", async () => {
        const expiry = 1_700_000_000n;
        const weight = 50n;
        const inner = newRegisterL1ValidatorMessage(
            SUBNET_ID_B58,
            NODE_ID,
            BLS_PUB,
            expiry,
            P_CHAIN_OWNER,
            P_CHAIN_OWNER,
            weight,
        );
        // P-Chain wraps the payload with system source on its own blockchain id.
        const unsignedWarp = newWarpMessage(FUJI_NETWORK_ID, P_CHAIN_BLOCKCHAIN_ID, "", inner.toHex());

        const result = await extractRegisterL1ValidatorMessageFromPChainTx({
            txId: FAKE_TX_ID,
            pChainRpcUrl: FAKE_RPC_URL,
            fetchFn: mockGetTx({ message: unsignedWarp.toHex() }),
        });

        expect(result.expiry).toBe(expiry);
        expect(result.weight).toBe(weight);
        expect(result.blsPublicKey).toBe(BLS_PUB as `0x${string}`);
        expect(result.subnetIdHex).toBe(
            utils.bufferToHex(utils.base58check.decode(SUBNET_ID_B58)) as `0x${string}`,
        );
        // nodeId should be the 20-byte hash from `NodeID-...`
        expect(result.nodeIdHex.length).toBe(2 + 20 * 2);
        // The inner messageHex round-trips through `newRegisterL1ValidatorMessage(...).toHex()`.
        expect(result.messageHex).toBe(inner.toHex() as `0x${string}`);
    });

    test("throws when the tx has no warp message", async () => {
        await expect(
            extractRegisterL1ValidatorMessageFromPChainTx({
                txId: FAKE_TX_ID,
                pChainRpcUrl: FAKE_RPC_URL,
                fetchFn: mockGetTx({ subnetID: SUBNET_ID_B58 /* missing `message` */ }),
            }),
        ).rejects.toThrow(/does not carry a warp message/);
    });

    test("throws when the RPC returns an error body", async () => {
        const errFetch = (async () =>
            new Response(
                JSON.stringify({ jsonrpc: "2.0", id: 1, error: { message: "tx not found" } }),
                { status: 200, headers: { "Content-Type": "application/json" } },
            )) as unknown as typeof fetch;
        await expect(
            extractRegisterL1ValidatorMessageFromPChainTx({
                txId: FAKE_TX_ID,
                pChainRpcUrl: FAKE_RPC_URL,
                fetchFn: errFetch,
            }),
        ).rejects.toThrow(/P-Chain RPC error: tx not found/);
    });
});

describe("extractL1ValidatorWeightMessageFromPChainTx", () => {
    test("decodes round-tripped fields", async () => {
        const nonce = 42n;
        const weight = 100n;
        const inner = newL1ValidatorWeightMessage(VALIDATION_ID_B58, nonce, weight);
        const unsignedWarp = newWarpMessage(FUJI_NETWORK_ID, P_CHAIN_BLOCKCHAIN_ID, "", inner.toHex());

        const result = await extractL1ValidatorWeightMessageFromPChainTx({
            txId: FAKE_TX_ID,
            pChainRpcUrl: FAKE_RPC_URL,
            fetchFn: mockGetTx({ message: unsignedWarp.toHex() }),
        });

        expect(result.nonce).toBe(nonce);
        expect(result.weight).toBe(weight);
        expect(result.validationIdHex).toBe(
            utils.bufferToHex(utils.base58check.decode(VALIDATION_ID_B58)) as `0x${string}`,
        );
        expect(result.messageHex).toBe(inner.toHex() as `0x${string}`);
    });
});

describe("extractSubnetToL1ConversionDataFromPChainTx", () => {
    test("builds the unsigned warp message and justification from tx fields", async () => {
        const managerAddress = "0xfacade0000000000000000000000000000000000" as `0x${string}`;
        const validators = [
            {
                nodeID: NODE_ID,
                weight: 100,
                balance: 1000,
                signer: { publicKey: BLS_PUB, proofOfPossession: BLS_PUB },
                remainingBalanceOwner: { threshold: 1, addresses: [EWOQ_P_LOCAL] },
                deactivationOwner: { threshold: 1, addresses: [EWOQ_P_LOCAL] },
            },
        ];

        const result = await extractSubnetToL1ConversionDataFromPChainTx({
            txId: FAKE_TX_ID,
            pChainRpcUrl: FAKE_RPC_URL,
            networkId: FUJI_NETWORK_ID,
            fetchFn: mockGetTx({
                subnetID: SUBNET_ID_B58,
                chainID: CHAIN_ID_B58,
                address: managerAddress,
                blockchainID: CHAIN_ID_B58,
                validators,
            }),
        });

        expect(result.subnetId).toBe(SUBNET_ID_B58);
        expect(result.blockchainId).toBe(CHAIN_ID_B58);
        expect(result.managerAddress).toBe(managerAddress);
        expect(result.validators).toEqual(validators);
        // conversionIdHex is a 32-byte 0x-hex string.
        expect(result.conversionIdHex.length).toBe(2 + 32 * 2);
        // Aggregator justification MUST be the 32-byte subnetID (NOT the
        // ConversionData preimage). avalanchego's signature-request verifier
        // looks up the conversion locally by subnetID; handing it the full
        // preimage yields "invalid hash length: expected 32 bytes but got 174"
        // and the validator silently refuses to sign.
        expect(result.justificationHex.length).toBe(2 + 32 * 2);
        expect(result.justificationHex).toBe(
            utils.bufferToHex(utils.base58check.decode(SUBNET_ID_B58)) as `0x${string}`,
        );
        // conversionDataHex is the full preimage (variable length, depends on
        // the validator set). Sanity: sha256(conversionDataHex) === conversionIdHex.
        expect(result.conversionDataHex.startsWith("0x")).toBe(true);
        expect(result.conversionDataHex.length).toBeGreaterThan(2 + 32 * 2);
        expect(result.unsignedMessageHex.startsWith("0x")).toBe(true);
        expect(result.unsignedMessageHex.length).toBeGreaterThan(2);
    });

    test("throws on missing required fields", async () => {
        await expect(
            extractSubnetToL1ConversionDataFromPChainTx({
                txId: FAKE_TX_ID,
                pChainRpcUrl: FAKE_RPC_URL,
                networkId: FUJI_NETWORK_ID,
                fetchFn: mockGetTx({ subnetID: SUBNET_ID_B58 /* missing chainID etc. */ }),
            }),
        ).rejects.toThrow(/missing required ConvertSubnetToL1Tx fields/);
    });
});
