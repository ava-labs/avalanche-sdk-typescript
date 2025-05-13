import { expect, test } from "vitest";
import { hexToBuffer } from "../../../../utils/common";
import { PChainTransferInput } from "./transferInput";
test("PChainTransferInput", () => {
  const [transferInput] = PChainTransferInput.fromBytes(
    hexToBuffer("0x0000000500000000ee6b28000000000100000000")
  );
  expect(transferInput.toJSON()).toEqual({
    signatureIndices: [0],
    amount: 4000000000n,
    typeId: 5,
  });
});
