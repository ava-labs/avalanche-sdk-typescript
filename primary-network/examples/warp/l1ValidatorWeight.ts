import { L1ValidatorWeightMessage, WarpMessage } from "../../src/warp";

/**
 * Structure of the message:
 * WarpSignedMessage
 *  - WarpUnsignedMessage
 *    - NetworkId
 *    - SourceChainId
 *    - AddressedCallPayload
 *      - SourceAddress
 *      - L1ValidatorWeightMessage
 *  - BitSet Signatures
 */

// Ref: See tx hash (on Fuji - PChain) zphUhqvXtj8dkYxg2BqCdTPDUPWBJUQkb1XTp38u8zDZ9VjMW
const signedWarpMsgHex = '0000000000056b804f574b890cf9e0cb0f0f68591a394bba1696cf62b4e576e793d8509cc88600000058000000000001000000140feedc0de0000000000000000000000000000000000000360000000000038ccf9ef520784d2fa5d97fbf098b8b4e82ff19408ec423c2970a522ab04b3a0400000000000000040000000000000029000000000000000106a8206d76cf3fa7d65fec8464b0311dce9283d05bcf0ca7987cdf03a3a2f764691e01df4f6aaa3ff6b52e5b92fd3291e519f3fb50bad5d9697a39e34e2c3e99ea585f0332e9d13b4b6db7ecc58eee44c7f96e64371b1eebaa6f7c45bbf0937e68';

const signedWarpMsg = WarpMessage.fromHex(signedWarpMsgHex);
console.log(signedWarpMsg);

// Directly extract the L1ValidatorWeightMessage
// `fromHex` static methods accepts:
// - fully signed message
// - addressed call payload
// - L1 validator weight message
const l1ValidatorWeightMsg = L1ValidatorWeightMessage.fromHex(signedWarpMsgHex)
console.log(l1ValidatorWeightMsg);

// Use `.toHex()` method to get back the hex bytes
console.log(l1ValidatorWeightMsg.toHex());
