import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "createSiweMessage",
      "generateSiweNonce",
      "parseSiweMessage",
      "SiweInvalidMessageFieldError",
      "validateSiweMessage",
      "verifySiweMessage",
    ]
  `);
});
