import { expect, test } from "vitest";

import * as exports from "./index.js";

test("exports", () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "getEnsAddress",
      "getEnsAvatar",
      "getEnsName",
      "getEnsResolver",
      "getEnsText",
      "labelhash",
      "namehash",
      "normalize",
      "packetToBytes",
      "parseAvatarRecord",
      "toCoinType",
    ]
  `);
});
