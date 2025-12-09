/**
 * Encodes a non-negative integer into Protobuf Variant format.
 * @param value - The non-negative integer to encode.
 * @returns A Uint8Array containing the Variant bytes.
 */
export function encodeVariant(value: number): Uint8Array {
  const bytes: number[] = [];
  while (value >= 0x80) {
    bytes.push((value & 0x7f) | 0x80);
    value >>>= 7; // Use unsigned right shift
  }
  bytes.push(value);
  return new Uint8Array(bytes);
}

/**
 * Converts a non-negative integer (up to 32 bits) to a 4-byte Big Endian Uint8Array.
 * @param value - The number to convert.
 * @returns A 4-byte Uint8Array.
 */
export function uint32ToBigEndianBytes(value: number): Uint8Array {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value, 0);
  return new Uint8Array(buffer);
}

/**
 * Appends a uint32 index to a byte array (typically a SubnetID) to compute a derived ID.
 * This mimics the Go `ids.ID.Append(uint32)` logic used for bootstrap validator IDs.
 * @param baseIDBytes - The base ID bytes (e.g., SubnetID).
 * @param index - The uint32 index to append.
 * @returns The combined ID bytes.
 */
export function computeDerivedID(
  baseIDBytes: Uint8Array,
  index: number
): Uint8Array {
  const indexBytes = uint32ToBigEndianBytes(index);
  const combined = new Uint8Array(baseIDBytes.length + indexBytes.length);
  combined.set(baseIDBytes, 0);
  combined.set(indexBytes, baseIDBytes.length);
  return combined;
}

/**
 * Manually marshals the ConvertSubnetToL1TxData justification protobuf.
 * L1ValidatorRegistrationJustification {
 *   oneof preimage {
 *     // Field 1
 *     SubnetIDIndex convert_subnet_to_l1_tx_data = 1;
 *     // Field 2
 *     bytes register_l1_validator_message = 2;
 *   }
 * }
 * SubnetIDIndex {
 *   bytes subnet_id = 1; // wire type 2
 *   uint32 index = 2;   // wire type 0 (varint)
 * }
 *
 * @param subnetIDBytes - The raw bytes of the subnet ID.
 * @param index - The bootstrap index.
 * @returns The marshalled L1ValidatorRegistrationJustification bytes.
 */
export function marshalConvertSubnetToL1TxDataJustification(
  subnetIDBytes: Uint8Array,
  index: number
): Uint8Array {
  // Marshal Inner SubnetIDIndex message
  // Field 1: subnet_id (bytes)
  const subnetIdTag = new Uint8Array([0x0a]); // Field 1, wire type 2
  const subnetIdLen = encodeVariant(subnetIDBytes.length);
  // Field 2: index (uint32, varint)
  const indexTag = new Uint8Array([0x10]); // Field 2, wire type 0
  const indexVarint = encodeVariant(index);

  const innerMsgLength =
    subnetIdTag.length +
    subnetIdLen.length +
    subnetIDBytes.length +
    indexTag.length +
    indexVarint.length;
  const innerMsgBytes = new Uint8Array(innerMsgLength);
  let offset = 0;
  innerMsgBytes.set(subnetIdTag, offset);
  offset += subnetIdTag.length;
  innerMsgBytes.set(subnetIdLen, offset);
  offset += subnetIdLen.length;
  innerMsgBytes.set(subnetIDBytes, offset);
  offset += subnetIDBytes.length;
  innerMsgBytes.set(indexTag, offset);
  offset += indexTag.length;
  innerMsgBytes.set(indexVarint, offset);

  // Marshal Outer L1ValidatorRegistrationJustification message
  // Field 1: convert_subnet_to_l1_tx_data (message)
  const outerTag = new Uint8Array([0x0a]); // Field 1, wire type 2
  const outerLen = encodeVariant(innerMsgBytes.length);

  const justificationBytes = new Uint8Array(
    outerTag.length + outerLen.length + innerMsgBytes.length
  );
  offset = 0;
  justificationBytes.set(outerTag, offset);
  offset += outerTag.length;
  justificationBytes.set(outerLen, offset);
  offset += outerLen.length;
  justificationBytes.set(innerMsgBytes, offset);

  return justificationBytes;
}

/**
 * Marshals the payload bytes into a RegisterL1ValidatorMessage justification format.
 * This creates a protobuf-encoded field 2 (register_l1_validator_message) with the payload bytes.
 *
 * L1ValidatorRegistrationJustification {
 *   oneof preimage {
 *     // Field 1
 *     SubnetIDIndex convert_subnet_to_l1_tx_data = 1;
 *     // Field 2
 *     bytes register_l1_validator_message = 2;
 *   }
 * }
 *
 * @param payloadBytes - The payload bytes to marshal (RegisterL1ValidatorMessage bytes).
 * @returns The marshalled justification bytes with protobuf field tag and length.
 */
export function marshalRegisterL1ValidatorMessageJustification(
  payloadBytes: Uint8Array
): Uint8Array {
  const tag = new Uint8Array([0x12]); // Field 2, wire type 2
  const lengthVarint = encodeVariant(payloadBytes.length);
  const marshalledJustification = new Uint8Array(
    tag.length + lengthVarint.length + payloadBytes.length
  );

  marshalledJustification.set(tag, 0);
  marshalledJustification.set(lengthVarint, tag.length);
  marshalledJustification.set(payloadBytes, tag.length + lengthVarint.length);

  return marshalledJustification;
}
