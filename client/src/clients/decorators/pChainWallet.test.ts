import { expect, test } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../createAvalancheWalletCoreClient.js";
import { pChainWalletActions } from "./pChainWallet.js";

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const pChainWalletClient = pChainWalletActions(client);

test("default", async () => {
  expect(pChainWalletClient).toMatchInlineSnapshot(`{
  "prepareAddPermissionlessDelegatorTxn": [Function],
  "prepareAddPermissionlessValidatorTxn": [Function],
  "prepareAddSubnetValidatorTxn": [Function],
  "prepareBaseTxn": [Function],
  "prepareConvertSubnetToL1Txn": [Function],
  "prepareCreateChainTxn": [Function],
  "prepareCreateSubnetTxn": [Function],
  "prepareDisableL1ValidatorTxn": [Function],
  "prepareExportTxn": [Function],
  "prepareImportTxn": [Function],
  "prepareIncreaseL1ValidatorBalanceTxn": [Function],
  "prepareRegisterL1ValidatorTxn": [Function],
  "prepareRemoveSubnetValidatorTxn": [Function],
  "prepareSetL1ValidatorWeightTxn": [Function],
}`);
});
