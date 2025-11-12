import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  // window/index.ts only has type declarations, so it may have no runtime exports
  // This test verifies the module can be imported without errors
  expect(exports).toBeDefined();
  expect(Object.keys(exports)).toMatchInlineSnapshot(`[]`);
});
