import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "buildGenesis",
      "getAllBalances",
      "getAssetDescription",
      "getBalance",
      "getBlock",
      "getBlockByHeight",
      "getHeight",
      "getTx",
      "getTxFee",
      "getTxStatus",
      "getUTXOs",
      "issueTx",
    ]
  `);
});
