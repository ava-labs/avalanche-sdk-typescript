import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common";
import { Bytes } from "../../../primitives/bytes";
import { PChainTransactionTypeSymbols } from "../../../typeSymbols";
import { parseBufferToOutputTypedSchema } from "../../parseTypedSchema";
import { TypeSchema } from "../../typeSchema.js";
import { PChainOutputOwners } from "./outputOwners.js";
import {
  PChainTransferOutput,
  PChainTransferOutputSchema,
} from "./transferOutput.js";

const PChainTransferableOutputSchema: TypeSchema = [
  { key: "assetId", type: Bytes, length: 32 },
  { key: "output", type: PChainTransferOutputSchema },
];

export type PChainTransferableOutput = {
  _type: PChainTransactionTypeSymbols.TransferableOutput;
  value: () => {
    assetId: Bytes;
    output: PChainTransferOutput | PChainOutputOwners;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    assetId: Bytes;
    output: PChainTransferOutput | PChainOutputOwners;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const PChainTransferableOutput = (json: {
  assetId: string | Bytes;
  output: PChainTransferOutput | PChainOutputOwners;
}) => {
  const assetId =
    typeof json.assetId === "string"
      ? Bytes(hexToBuffer(json.assetId))
      : json.assetId;
  return {
    _type: PChainTransactionTypeSymbols.TransferableOutput,
    value: () => ({
      assetId,
      output: json.output,
    }),

    toBytes: () => {
      return concatBytes(assetId.toBytes(), json.output.toBytes());
    },

    toJSON: () => {
      return {
        assetId: assetId.toJSON(),
        output: json.output.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        assetId: assetId.toString(),
        output: json.output.toString(),
      });
    },

    valueOf: () => {
      return {
        assetId,
        output: json.output,
      };
    },

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

PChainTransferableOutput.fromBytes = (
  buf: Uint8Array
): [PChainTransferableOutput, Uint8Array] => {
  let currBuf = buf.slice();
  let json: Record<string, Bytes | PChainTransferOutput | PChainOutputOwners> =
    {};

  for (const { key, type, length } of PChainTransferableOutputSchema) {
    if (key !== "output") {
      const [value, rest] = type.fromBytes(currBuf, length);
      json[key as keyof typeof json] = value;
      currBuf = rest;
    } else {
      const [value, rest] = parseBufferToOutputTypedSchema(currBuf);
      json[key as keyof typeof json] = value as
        | PChainTransferOutput
        | PChainOutputOwners;
      currBuf = rest;
    }
    console.log("currBuf", json[key]);
  }

  return [PChainTransferableOutput(json as any) as any, currBuf];
};
