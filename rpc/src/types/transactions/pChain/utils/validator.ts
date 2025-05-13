import { concatBytes } from "@noble/hashes/utils";
import { hexToBuffer } from "../../../../utils/common.js";
import { BigIntPr } from "../../../primitives/bigintpr.js";
import { Bytes } from "../../../primitives/bytes.js";
import { TypeSchema } from "../../typeSchema.js";

export const ValidatorSchema: TypeSchema = [
  { key: "nodeId", type: Bytes, length: 20 },
  { key: "startTime", type: BigIntPr },
  { key: "endTime", type: BigIntPr },
  { key: "weight", type: BigIntPr },
] as const;

export type Validator = {
  value: () => {
    nodeId: Bytes;
    startTime: BigIntPr;
    endTime: BigIntPr;
    weight: BigIntPr;
  };
  toBytes: () => Uint8Array;
  toJSON: () => object;
  toString: () => string;
  valueOf: () => {
    nodeId: Bytes;
    startTime: BigIntPr;
    endTime: BigIntPr;
    weight: BigIntPr;
  };
  [Symbol.toPrimitive](hint: string): string;
};

export const Validator = (json: {
  nodeId: string | Bytes;
  startTime: number | bigint | BigIntPr;
  endTime: number | bigint | BigIntPr;
  weight: number | bigint | BigIntPr;
}): Validator => {
  const nodeId =
    typeof json.nodeId === "string"
      ? Bytes(hexToBuffer(json.nodeId))
      : json.nodeId;
  const startTime =
    typeof json.startTime === "number" || typeof json.startTime === "bigint"
      ? BigIntPr(json.startTime)
      : json.startTime;
  const endTime =
    typeof json.endTime === "number" || typeof json.endTime === "bigint"
      ? BigIntPr(json.endTime)
      : json.endTime;
  const weight =
    typeof json.weight === "number" || typeof json.weight === "bigint"
      ? BigIntPr(json.weight)
      : json.weight;

  return {
    value: () => ({
      nodeId,
      startTime,
      endTime,
      weight,
    }),

    toBytes: () => {
      return concatBytes(
        nodeId.toBytes(),
        startTime.toBytes(),
        endTime.toBytes(),
        weight.toBytes()
      );
    },

    toJSON: () => {
      return {
        nodeId: nodeId.toJSON(),
        startTime: startTime.toJSON(),
        endTime: endTime.toJSON(),
        weight: weight.toJSON(),
      };
    },

    toString: () => {
      return JSON.stringify({
        nodeId: nodeId.toString(),
        startTime: startTime.toString(),
        endTime: endTime.toString(),
        weight: weight.toString(),
      });
    },

    valueOf: () => ({
      nodeId,
      startTime,
      endTime,
      weight,
    }),

    [Symbol.toPrimitive](hint: string) {
      if (hint === "number") throw new Error("Cannot convert to number");
      return this.toString();
    },
  };
};

Validator.fromBytes = (buf: Uint8Array): [Validator, Uint8Array] => {
  let currBuf = buf.slice();
  const json: Record<string, any> = {};

  for (const { key, type, length } of ValidatorSchema) {
    const [value, rest] = type.fromBytes(currBuf, length);
    json[key as keyof typeof json] = value;
    currBuf = rest;
  }

  return [Validator(json as any), currBuf];
};
