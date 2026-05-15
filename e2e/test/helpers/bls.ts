import { readFileSync } from "fs";

import { bls } from "@avalabs/avalanchejs";
import { bls12_381 } from "@noble/curves/bls12-381";
import { bytesToHex, type Hex } from "viem";

/**
 * BLS material for a validator we control end-to-end (we own the secret
 * scalar, can produce signatures, and know the matching public key + PoP).
 */
export interface ValidatorBlsKeypair {
    /** 32-byte raw BLS12-381 secret scalar, big-endian. */
    secretKeyBytes: Uint8Array;
    /** 48-byte compressed G1 public key, 0x-hex. */
    publicKey: Hex;
    /** 96-byte BLS proof-of-possession over the public key, 0x-hex. */
    proofOfPossession: Hex;
}

/**
 * Load an Avalanche staking-signer key file (32 raw bytes) and derive the
 * matching public key + proof-of-possession.
 *
 * Use this when the node owns the BLS material (e.g. a tmpnet L1 node where
 * avalanchego auto-generated the signer at `${data-dir}/staking/signer.key`)
 * and you need the secret scalar in-hand to sign on the node's behalf —
 * specifically for the `RegisterL1ValidatorMessage` BLS signature that
 * `RegisterL1ValidatorTx` requires.
 */
export function loadValidatorBlsKeypair(signerKeyPath: string): ValidatorBlsKeypair {
    const secretKeyBytes = readFileSync(signerKeyPath);
    if (secretKeyBytes.length !== 32) {
        throw new Error(
            `expected 32-byte BLS signer key at ${signerKeyPath}, got ${secretKeyBytes.length}`,
        );
    }
    const sk = bls.secretKeyFromBytes(secretKeyBytes);
    const pk = bls12_381.G1.ProjectivePoint.BASE.multiply(sk);
    const publicKeyBytes = bls.publicKeyToBytes(pk);
    const proofOfPossessionBytes = bls.signProofOfPossession(publicKeyBytes, sk);
    return {
        secretKeyBytes: new Uint8Array(secretKeyBytes),
        publicKey: bytesToHex(publicKeyBytes),
        proofOfPossession: bytesToHex(proofOfPossessionBytes),
    };
}

