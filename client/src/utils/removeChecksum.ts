import { sha256 } from "@noble/hashes/sha256";

export function removeChecksum(dataWithChecksum: Uint8Array): Uint8Array {
  if (dataWithChecksum.length < 4) {
    throw new Error("Data too short — no checksum present");
  }

  // Split data and checksum
  const data = dataWithChecksum.subarray(0, -4);
  const checksum = dataWithChecksum.subarray(-4);

  // Recompute expected checksum
  const expectedChecksum = sha256(data).subarray(-4);

  // Optional: verify checksum
  for (let i = 0; i < 4; i++) {
    if (checksum[i] !== expectedChecksum[i]) {
      throw new Error("Invalid checksum");
    }
  }

  return data;
}
