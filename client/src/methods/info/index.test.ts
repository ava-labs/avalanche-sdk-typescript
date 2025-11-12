import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "acps",
      "getBlockchainID",
      "getNetworkID",
      "getNetworkName",
      "getNodeID",
      "getNodeIP",
      "getNodeVersion",
      "getTxFee",
      "getVMs",
      "isBootstrapped",
      "peers",
      "upgrades",
      "uptime",
    ]
  `);
});
