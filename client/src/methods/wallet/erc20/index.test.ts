import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "erc20ABI",
      "erc20Bytecode",
      "deployErc20",
    ]
  `);
});
