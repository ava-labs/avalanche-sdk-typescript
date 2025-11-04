import { utils } from "@avalabs/avalanchejs";
import { expect } from "vitest";
import type {
  Output,
  StakeableOutputFull,
  TransferableOutputFull,
} from "../types/common";

export function checkOutputs(
  expectedOutputs: Output[],
  actualOutputs: (TransferableOutputFull | StakeableOutputFull)[]
) {
  expect(
    actualOutputs.length,
    "expected and actual outputs length mismatch"
  ).toBe(expectedOutputs.length);
  expectedOutputs.forEach((expected, index) => {
    const actual = actualOutputs[index]?.output;

    // check amount
    expect(
      actual?.amount().valueOf(),
      `output amount did not match for index ${index}`
    ).toBe(expected.amount);

    // check owners
    const expectedOwners = expected.addresses.map((address) =>
      address.replace("P-", "").replace("X-", "")
    );
    let actualOwners: string[] = [];
    if (actual) {
      if (utils.isTransferOut(actual)) {
        actualOwners = actual?.outputOwners?.addrs?.map((owner) =>
          owner.toString("fuji")
        );
        expect(
          new Set(actualOwners),
          `output owners did not match for index ${index}`
        ).toEqual(new Set(expectedOwners));
      } else if (utils.isStakeableLockOut(actual)) {
        actualOwners = actual
          ?.getOutputOwners()
          ?.addrs?.map((owner) => owner.toString("fuji"));
        expect(
          new Set(actualOwners),
          `stakeable lock output owners did not match for index ${index}`
        ).toEqual(new Set(expectedOwners));
      } else {
        throw new Error(`unknown output type for index ${index}`);
      }
    }
  });
}
