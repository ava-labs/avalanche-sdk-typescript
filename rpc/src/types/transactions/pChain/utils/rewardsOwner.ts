import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common.js";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Bytes } from "../../../primitives/bytes.js";
import { Int } from "../../../primitives/int.js";
import { VariableLengthArray } from "../../../primitives/variablelengtharray.js";
import { TypeSchema } from "../../typeSchema.js";

export const RewardsOwnerSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "locktime", type: BigIntPr },
  { key: "threshold", type: Int },
  { key: "addresses", type: Bytes, isArray: true, elemByteLen: 20 },
] as const;

export type RewardsOwner = {
  value: () => {
    typeId: Int;
    locktime: BigIntPr;
    threshold: Int;
    addresses: VariableLengthArray;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    locktime: BigIntPr;
    threshold: Int;
    addresses: VariableLengthArray;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const RewardsOwner = (json: {
  typeId?: number | Int;
  locktime: number | bigint | BigIntPr;
  threshold: number | Int;
  addresses: string[] | Bytes[] | VariableLengthArray;
}): RewardsOwner => {
  const typeId = !json.typeId
    ? Int(11)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;
  const locktime =
    typeof json.locktime === "number" || typeof json.locktime === "bigint"
      ? BigIntPr(json.locktime)
      : json.locktime;
  const threshold =
    typeof json.threshold === "number" ? Int(json.threshold) : json.threshold;
  const addresses = Array.isArray(json.addresses)
    ? VariableLengthArray(
        json.addresses.map((addr) =>
          typeof addr === "string"
            ? Bytes(hexToBuffer(addr)).toBytes()
            : addr.toBytes()
        )
      )
    : json.addresses;

  // Validate threshold <= addresses.length
  if (
    addresses.value().length > 0 &&
    threshold.value() > addresses.value().length
  ) {
    throw new Error(
      "Threshold must be less than or equal to the number of addresses"
    );
  }
  if (addresses.value().length === 0 && threshold.value() !== 0) {
    throw new Error("Threshold must be 0 when there are no addresses");
  }

  return {
    value: () => ({
      typeId,
      locktime,
      threshold,
      addresses,
    }),

    toBytes: () => {
      return concatBytes(
        typeId.toBytes(),
        locktime.toBytes(),
        threshold.toBytes(),
        addresses.toBytes()
      );
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        locktime: locktime.toJSON(),
        threshold: threshold.toJSON(),
        addresses: addresses.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        locktime: locktime.toString(),
        threshold: threshold.toString(),
        addresses: addresses.toString(),
      });
    },

    valueOf: () => ({
      typeId,
      locktime,
      threshold,
      addresses,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

RewardsOwner.fromBytes = (buf: Uint8Array): [RewardsOwner, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, isArray, elemByteLen } of RewardsOwnerSchema) {
    if (isArray && elemByteLen !== undefined) {
      const [value, rest] = VariableLengthArray.fromBytes(currBuf, elemByteLen);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    } else {
      const [value, rest] = type.fromBytes(currBuf);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    }
  }

  return [RewardsOwner(json as any), currBuf];
};
