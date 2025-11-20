import { expect, test } from "vitest";

import * as exports from "./utils.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "assertCurrentChain",
      "defineChain",
      "extractChain",
      "getChainContractAddress",
    ]
  `);
});
