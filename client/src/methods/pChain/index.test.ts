import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "getCurrentValidators",
      "getBalance",
      "getBlock",
      "getBlockByHeight",
      "getBlockchains",
      "getFeeConfig",
      "getHeight",
      "getL1Validator",
      "getMinStake",
      "getProposedHeight",
      "getRewardUTXOs",
      "getStake",
      "getCurrentSupply",
      "getBlockchainStatus",
      "getFeeState",
      "getStakingAssetID",
      "getSubnet",
      "getSubnets",
      "getTimestamp",
      "getTotalStake",
      "getTx",
      "getTxStatus",
      "getUTXOs",
      "getAllValidatorsAt",
      "getValidatorsAt",
      "issueTx",
      "sampleValidators",
      "validates",
      "validatedBy",
    ]
  `);
});
