import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "prepareAddPermissionlessDelegatorTx",
      "prepareAddPermissionlessValidatorTxn",
      "prepareAddSubnetValidatorTxn",
      "prepareBaseTxn",
      "prepareConvertSubnetToL1Txn",
      "prepareCreateChainTxn",
      "prepareCreateSubnetTxn",
      "prepareDisableL1ValidatorTxn",
      "prepareExportTxn",
      "prepareImportTxn",
      "prepareIncreaseL1ValidatorBalanceTxn",
      "prepareRegisterL1ValidatorTxn",
      "prepareRemoveSubnetValidatorTxn",
      "prepareSetL1ValidatorWeightTxn",
    ]
  `);
});
