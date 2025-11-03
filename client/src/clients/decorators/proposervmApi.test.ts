import { expect, test } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheCoreClient } from "../createAvalancheCoreClient.js";
import { proposervmAPIActions } from "./proposervmApi.js";

const client = createAvalancheCoreClient({
  chain: avalanche,
  transport: { type: "http" },
} as any);

const proposervmApiClient = proposervmAPIActions(client);

test("default", async () => {
  expect(proposervmApiClient).toMatchInlineSnapshot(`{
  "getCurrentEpoch": [Function],
  "getProposedHeight": [Function],
}`);
});
