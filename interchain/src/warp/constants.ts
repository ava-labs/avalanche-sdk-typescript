/**
 * Wire-format constants for the canonical Avalanche Warp byte layouts.
 *
 * Every numeric literal that corresponds to a codec ID, typeID, byte offset,
 * or fixed payload length lives here, so the file referencing it documents
 * the source instead of carrying a magic number.
 */

/**
 * Codec ID prefix used by every warp-codec'd message.
 * Matches `pvmSerial.warp.codec` major version 0.
 */
export const WARP_CODEC_ID = 0;

/** AddressedCall typeID when wrapped inside an UnsignedMessage. */
export const ADDRESSED_CALL_TYPE_ID = 1;

/**
 * typeIDs for the AddressedCall payloads we support. These match
 * `pvmSerial.warp.AddressedCallPayloads.*` registered IDs in avalanchejs and
 * are what the L1 / P-Chain signers commit to.
 *
 * Note: `SubnetToL1Conversion` and `ValidationUptime` both use typeID 0.
 * Context (which precompile / signer wraps them) disambiguates.
 */
export const ADDRESSED_CALL_PAYLOAD_TYPE_ID = {
    SubnetToL1Conversion: 0,
    RegisterL1Validator: 1,
    L1ValidatorRegistration: 2,
    L1ValidatorWeight: 3,
    ValidationUptime: 0,
} as const;

/**
 * ValidationUptimeMessage is fixed-size:
 *   codec(2) + typeID(4) + validationID(32) + uptime(8) = 46 bytes.
 */
export const VALIDATION_UPTIME_PAYLOAD_LENGTH = 46;

/**
 * Byte offsets within an UnsignedMessage:
 *   codec(2) | networkID(4) | sourceChainID(32) | msgLen(4) | msg(N)
 * Used by raw byte readers that bypass avalanchejs's unpack.
 */
export const UNSIGNED_MESSAGE_OFFSETS = {
    NETWORK_ID: 2,
    SOURCE_CHAIN_ID: 6,
    MSG_LEN: 38,
    MSG_START: 42,
} as const;

/**
 * Byte offsets within an AddressedCall:
 *   codec(2) | typeID(4) | srcAddrLen(4) | srcAddr(N) | payloadLen(4) | payload(M)
 * `PAYLOAD_LEN` / `PAYLOAD_START` are dynamic (srcAddrLen-dependent) and live
 * in the reader implementation.
 */
export const ADDRESSED_CALL_OFFSETS = {
    CODEC: 0,
    TYPE_ID: 2,
    SRC_ADDR_LEN: 6,
    SRC_ADDR: 10,
} as const;

/**
 * P-Chain blockchain ID — 32 zero bytes, base58check-encoded.
 *
 * Used as the `sourceChainID` on every warp UnsignedMessage signed by the
 * P-Chain (SubnetToL1Conversion, L1ValidatorRegistration, L1ValidatorWeight).
 */
export const P_CHAIN_BLOCKCHAIN_ID = "11111111111111111111111111111111LpoYY" as const;

/** Default knobs for `getRegistrationJustification`'s scan logic. */
export const JUSTIFICATION_DEFAULTS = {
    BOOTSTRAP_SEARCH_LIMIT: 1000,
    LOG_CHUNK_SIZE: 2000,
    MAX_LOG_CHUNKS: 100,
} as const;
