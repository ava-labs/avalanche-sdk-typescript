import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../utils/common.js";
import { Bytes } from "../primitives/bytes.js";
import { Int } from "../primitives/int.js";
import { VariableLengthArray } from "../primitives/variablelengtharray.js";
import { TypeSchema } from "../transactions/typeSchema.js";
import { PChainTransactionTypeSymbols } from "../typeSymbols.js";

export const SECP256K1CredentialSchema: TypeSchema = [
  { key: "typeId", type: Int },
  { key: "signatures", type: Bytes, isArray: true, elemByteLen: 65 },
] as const;

export type SECP256K1Credential = {
  _type: PChainTransactionTypeSymbols.SECP256K1Credential;
  value: () => {
    typeId: Int;
    signatures: VariableLengthArray;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    typeId: Int;
    signatures: VariableLengthArray;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const SECP256K1Credential = (json: {
  typeId?: number | Int | undefined;
  signatures: string[] | Bytes[] | VariableLengthArray;
}): SECP256K1Credential => {
  const typeId = !json.typeId
    ? Int(9)
    : typeof json.typeId === "number"
    ? Int(json.typeId)
    : json.typeId;

  const signatures = Array.isArray(json.signatures)
    ? VariableLengthArray(
        json.signatures.map((sig) =>
          typeof sig === "string" ? hexToBuffer(sig) : sig.toBytes()
        )
      )
    : json.signatures;

  return {
    _type: PChainTransactionTypeSymbols.SECP256K1Credential,
    value: () => ({
      typeId,
      signatures,
    }),

    toBytes: () => {
      return concatBytes(typeId.toBytes(), signatures.toBytes());
    },

    toJSON: () => {
      return {
        typeId: typeId.toJSON(),
        signatures: signatures.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        typeId: typeId.toString(),
        signatures: signatures.toString(),
      });
    },

    valueOf: () => ({
      typeId,
      signatures,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

SECP256K1Credential.fromBytes = (
  buf: Uint8Array
): [SECP256K1Credential, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, isArray, elemByteLen } of SECP256K1CredentialSchema) {
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
  return [SECP256K1Credential(json as any), currBuf];
};

SECP256K1Credential.typeId = "9";
