import { AddressedCall, L1ValidatorWeightMessage, WarpUnsignedMessage } from "../../../src/warp";

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

// parsing L1 validator weight message from the signed warp message hex
const parsedL1ValidatorWeightMsg = L1ValidatorWeightMessage.fromHex(signedWarpMsgHex)

// re-building the same message using values
const newL1ValidatorWeightMsg = L1ValidatorWeightMessage.fromValues(
    '251q44yFiimeVSHaQbBk69TzoeYqKu9VagGtLVqo92LphUxjmR',
    4n,
    41n,
)
console.log(newL1ValidatorWeightMsg);
console.log('This should be true:', parsedL1ValidatorWeightMsg.toHex() === newL1ValidatorWeightMsg.toHex());

// now, let's build an unsgined message from the above newL1ValidatorWeightMsg
const addressedCallPayload = AddressedCall.fromValues(
    '0x35F884853114D298D7aA8607f4e7e0DB52205f07',
    newL1ValidatorWeightMsg.toHex()
)
console.log(addressedCallPayload);

// now, let's build a WarpUnsignedMessage from the above addressed call payload
const warpUnsignedMessage = WarpUnsignedMessage.fromValues(
    1,
    '251q44yFiimeVSHaQbBk69TzoeYqKu9VagGtLVqo92LphUxjmR',
    addressedCallPayload.toHex()
)
console.log(warpUnsignedMessage);

// We can sign the above unsgined message by sending it's hex value using .toHex() method
