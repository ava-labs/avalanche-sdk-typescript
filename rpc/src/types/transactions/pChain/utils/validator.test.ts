import { expect, test } from "vitest";
import { bufferToHex, hexToBuffer } from "../../../../utils/common.js";
import { Validator } from "./validator.js";

test("Validator", () => {
  // Example from documentation
  const testHex =
    "0xe9094f73698002fd52c90819b457b9fbc866ab80000000005f21f31d000000005f497dc6000000000000d431";

  const [validator, rest] = Validator.fromBytes(hexToBuffer(testHex));

  expect(validator.toJSON()).toEqual({
    nodeId: "0xe9094f73698002fd52c90819b457b9fbc866ab80",
    startTime: 1596060445n,
    endTime: 1598651846n,
    weight: 54321n,
  });

  expect(rest.length).toEqual(0);
  expect(bufferToHex(validator.toBytes())).toEqual(testHex);

  // Test creating from JSON
  const validatorFromJson = Validator({
    nodeId: "0xaa18d3991cf637aa6c162f5e95cf163f69cd8291",
    startTime: 1643068824n,
    endTime: 1644364767n,
    weight: 54321n,
  });

  expect(validatorFromJson.toJSON()).toEqual({
    nodeId: "0xaa18d3991cf637aa6c162f5e95cf163f69cd8291",
    startTime: 1643068824n,
    endTime: 1644364767n,
    weight: 54321n,
  });
});
