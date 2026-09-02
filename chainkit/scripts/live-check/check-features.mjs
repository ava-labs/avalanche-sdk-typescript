/**
 * Exercises the cross-cutting SDK machinery on the operation added for
 * ACP-236 cycles: pagination, error mapping, retries, per-call server and
 * network overrides, the standalone function, and the model JSON helpers.
 *
 * check.mjs asks "does the deployed API still match the schemas". This asks
 * "does the hand-written operation behave like a generated one".
 *
 * Retries and the server override run against a local mock rather than the
 * real API, so failure injection is deterministic.
 */
import { createServer } from "node:http";
import { Avalanche } from "@avalanche-sdk/chainkit";
import { AvalancheCore } from "@avalanche-sdk/chainkit/core.js";
import { dataPrimaryNetworkListAutoRenewedValidatorCycles } from "@avalanche-sdk/chainkit/funcs/dataPrimaryNetworkListAutoRenewedValidatorCycles.js";
import * as errors from "@avalanche-sdk/chainkit/models/errors";
import {
  autoRenewDetailsFromJSON,
  autoRenewDetailsToJSON,
  autoRenewedCycleFromJSON,
  autoRenewedCycleToJSON,
  currentAutoRenewedCycleToJSON,
  listAutoRenewedCyclesResponseToJSON,
  pChainStakingTransactionToJSON,
} from "@avalanche-sdk/chainkit/models/components";
import { FIXTURES as F } from "./fixtures.mjs";

const avalanche = new Avalanche({ network: "fuji" });

let pass = 0;
const failures = [];

async function check(name, fn) {
  try {
    const detail = await fn();
    pass++;
    console.log(`  PASS  ${name}\n          ${detail}`);
  } catch (e) {
    const kind = e?.constructor?.name ?? "Error";
    const msg = (e instanceof Error ? e.message : String(e)).split("\n")[0];
    failures.push(name);
    console.log(`  FAIL  ${name}\n          ${kind}: ${msg}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Call through the SDK object. Like every generated method, this one reads
// `this`, so pulling it off the client and calling it bare would lose the
// client reference.
const cycles = (request, options) =>
  avalanche.data.primaryNetwork.listAutoRenewedValidatorCycles(request, options);

/* ------------------------------------------------------------------ */
console.log("\nPagination (hand-written cursor iterator)\n");

await check("walks every page and terminates", async () => {
  const pages = await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 2 });
  let pageCount = 0;
  const seen = [];
  const currentCycleOnPage = [];
  for await (const page of pages) {
    pageCount++;
    seen.push(...page.result.cycles.map((c) => c.cycleIndex));
    currentCycleOnPage.push(Boolean(page.result.currentCycle));
    assert(pageCount < 50, "iterator did not terminate within 50 pages");
  }
  assert(pageCount > 1, `only ${pageCount} page(s); cannot prove paging works`);
  assert(new Set(seen).size === seen.length,
    `duplicate cycleIndex across pages: ${seen.join(",")}`);
  return `pages=${pageCount} cycleIndexes=[${seen.join(",")}] currentCycle-per-page=[${currentCycleOnPage.join(",")}]`;
});

await check("paged total matches a single large page", async () => {
  const one = await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 100 });
  const { value: firstPage } = await one[Symbol.asyncIterator]().next();
  const single = firstPage.result.cycles.length;

  const many = await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 2 });
  let paged = 0;
  for await (const page of many) paged += page.result.cycles.length;

  assert(single === paged, `pageSize=100 gave ${single}, paging gave ${paged}`);
  return `${single} settled cycles either way`;
});

await check("currentCycle only on the first page", async () => {
  const pages = await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 2 });
  const flags = [];
  for await (const page of pages) flags.push(Boolean(page.result.currentCycle));
  assert(flags[0], "currentCycle missing from the first page");
  const laterPagesClean = flags.slice(1).every((f) => !f);
  assert(laterPagesClean, `currentCycle leaked onto a later page: [${flags.join(",")}]`);
  return `first=${flags[0]} later=[${flags.slice(1).join(",")}] as the contract states`;
});

/* ------------------------------------------------------------------ */
console.log("\nQuery parameters\n");

await check("txHash restricts to one position", async () => {
  const pages = await cycles({
    nodeId: F.halfRestakeNodeId,
    txHash: F.addAutoRenewedTx,
    pageSize: 100,
  });
  const { value } = await pages[Symbol.asyncIterator]().next();
  const hashes = new Set(value.result.cycles.map((c) => c.stakingTxHash));
  assert(hashes.size === 1, `expected 1 stakingTxHash, got ${hashes.size}`);
  assert(hashes.has(F.addAutoRenewedTx), `unexpected stakingTxHash ${[...hashes]}`);
  return `cycles=${value.result.cycles.length} all from ${F.addAutoRenewedTx.slice(0, 12)}...`;
});

await check("sortOrder=asc flips the ordering", async () => {
  const read = async (sortOrder) => {
    const pages = await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 100, sortOrder });
    const { value } = await pages[Symbol.asyncIterator]().next();
    return value.result.cycles.map((c) => c.cycleIndex);
  };
  const asc = await read("asc");
  const desc = await read("desc");
  const isAsc = asc.every((v, i) => i === 0 || asc[i - 1] <= v);
  const isDesc = desc.every((v, i) => i === 0 || desc[i - 1] >= v);
  assert(isAsc, `asc not ascending: [${asc.join(",")}]`);
  assert(isDesc, `desc not descending: [${desc.join(",")}]`);
  return `asc=[${asc.join(",")}] desc=[${desc.join(",")}]`;
});

await check("per-call network override beats the client default", async () => {
  const mainnetClient = new Avalanche({ network: "mainnet" });
  const res = await mainnetClient.data.primaryNetwork.balances.listByAddresses({
    blockchainId: "p-chain",
    addresses: F.halfRestakeAddress,
    network: "fuji",
  });
  assert(res.chainInfo.network === "fuji",
    `chainInfo.network=${res.chainInfo.network}, expected fuji`);
  return `mainnet client + network:"fuji" -> chainInfo.network=${res.chainInfo.network}`;
});

/* ------------------------------------------------------------------ */
console.log("\nError mapping\n");

await check("pageSize below the minimum maps to BadRequestError", async () => {
  try {
    await cycles({ nodeId: F.halfRestakeNodeId, pageSize: 0 });
  } catch (e) {
    assert(e instanceof errors.BadRequestError,
      `threw ${e?.constructor?.name}, expected BadRequestError`);
    return `BadRequestError, statusCode=${e.data$?.statusCode ?? e.statusCode ?? "?"}`;
  }
  throw new Error("no error thrown for pageSize=0");
});

await check("malformed nodeId maps to BadRequestError", async () => {
  try {
    await cycles({ nodeId: "NodeID-bogus" });
  } catch (e) {
    assert(e instanceof errors.BadRequestError,
      `threw ${e?.constructor?.name}, expected BadRequestError`);
    return `BadRequestError, message="${String(e.message).slice(0, 60)}"`;
  }
  throw new Error("no error thrown for a malformed nodeId");
});

/* ------------------------------------------------------------------ */
console.log("\nStandalone function (AvalancheCore, Result-returning)\n");

await check("standalone function returns ok on success", async () => {
  const core = new AvalancheCore({ network: "fuji" });
  const res = await dataPrimaryNetworkListAutoRenewedValidatorCycles(core, {
    nodeId: F.halfRestakeNodeId,
    pageSize: 2,
  });
  assert(res.ok, `res.ok=false: ${res.error?.message}`);
  // The returned object is both the first page's Result and the page iterator.
  // res.value is that first page's body, not something iterable.
  assert(typeof res[Symbol.asyncIterator] === "function", "result is not async-iterable");
  assert(Array.isArray(res.value.result.cycles), "res.value is not the first page body");
  let pages = 0;
  for await (const _page of res) pages++;
  return `ok=true, first page cycles=${res.value.result.cycles.length}, iterated ${pages} page(s)`;
});

await check("standalone function returns an error instead of throwing", async () => {
  const core = new AvalancheCore({ network: "fuji" });
  const res = await dataPrimaryNetworkListAutoRenewedValidatorCycles(core, {
    nodeId: "NodeID-bogus",
  });
  assert(!res.ok, "res.ok=true for a malformed nodeId");
  assert(res.error instanceof errors.BadRequestError,
    `error is ${res.error?.constructor?.name}, expected BadRequestError`);
  return `ok=false, error=${res.error.constructor.name}`;
});

/* ------------------------------------------------------------------ */
console.log("\nRetries and server override (local mock, deterministic failures)\n");

const MOCK_BODY = {
  cycles: [{
    cycleIndex: 1,
    rewardTxHash: "vu36Rv1E8DqbXqhNR2s8ohvXXT4hMP8neG1EUodpfdzZn1Kxv",
    stakingTxHash: "gcuYVzYGXwzFnB355WRxVdZoHwkag2uj1N2ieEUQMcat3ytL",
    startTimestamp: 1786653163,
    endTimestamp: 1786739563,
    weightAtCycleStart: "1000000000",
    grossValidationReward: "1274832",
    withdrawnValidationReward: "956124",
    compoundedValidationReward: "318708",
    grossDelegateeReward: "0",
    withdrawnDelegateeReward: "0",
    compoundedDelegateeReward: "0",
    autoCompoundSharePercent: 25,
    outcome: "renewed",
    delegatorCount: 0,
    amountDelegated: "0",
  }],
};

/** Serves `failures` x 503, then 200. Resolves with the request count. */
async function withMock(failures, fn) {
  let hits = 0;
  const paths = [];
  const server = createServer((req, res) => {
    hits++;
    paths.push(req.url);
    if (hits <= failures) {
      res.writeHead(503, { "content-type": "application/json" });
      // Shaped like ServiceUnavailableError: message, statusCode and error are
      // all required, and a body missing any of them is a validation failure
      // rather than a mapped error.
      res.end(JSON.stringify({
        message: "mock unavailable",
        statusCode: 503,
        error: "Service Unavailable",
      }));
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(MOCK_BODY));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    return { result: await fn(url), hits, paths };
  } finally {
    server.close();
  }
}

const FAST_RETRY = {
  strategy: "backoff",
  backoff: { initialInterval: 1, maxInterval: 10, exponent: 1.1, maxElapsedTime: 2000 },
  retryConnectionErrors: false,
};

await check("retries a 503 and then succeeds", async () => {
  const { result, hits, paths } = await withMock(2, async (serverURL) => {
    const pages = await cycles(
      { nodeId: F.halfRestakeNodeId, pageSize: 2 },
      { serverURL, retries: FAST_RETRY },
    );
    const { value } = await pages[Symbol.asyncIterator]().next();
    return value.result.cycles.length;
  });
  assert(hits === 3, `expected 3 requests (2 failed + 1 ok), got ${hits}`);
  assert(result === 1, `expected 1 cycle from the mock, got ${result}`);
  return `requests=${hits}, path=${paths[0]}`;
});

await check("per-call serverURL is honoured", async () => {
  const { hits, paths } = await withMock(0, async (serverURL) => {
    const pages = await cycles({ nodeId: F.halfRestakeNodeId }, { serverURL });
    await pages[Symbol.asyncIterator]().next();
  });
  assert(hits === 1, `expected 1 request to the mock, got ${hits}`);
  const expected = `/v1/networks/fuji/validators/${F.halfRestakeNodeId}/cycles`;
  assert(paths[0].startsWith(expected), `requested ${paths[0]}, expected ${expected}?...`);
  return `hit the mock at ${paths[0].slice(0, 72)}...`;
});

await check("no retry when the strategy is none", async () => {
  const { hits } = await withMock(99, async (serverURL) => {
    try {
      const pages = await cycles(
        { nodeId: F.halfRestakeNodeId },
        { serverURL, retries: { strategy: "none" } },
      );
      await pages[Symbol.asyncIterator]().next();
    } catch {
      // a 503 is expected here; we only care about the request count
    }
  });
  assert(hits === 1, `expected exactly 1 request with retries off, got ${hits}`);
  return "1 request, no retry";
});

await check("a persistent 503 surfaces as ServiceUnavailableError", async () => {
  const { result } = await withMock(99, async (serverURL) => {
    try {
      const pages = await cycles(
        { nodeId: F.halfRestakeNodeId },
        { serverURL, retries: { strategy: "none" } },
      );
      await pages[Symbol.asyncIterator]().next();
      return "no error";
    } catch (e) {
      return e?.constructor?.name;
    }
  });
  assert(result === "ServiceUnavailableError",
    `got ${result}, expected ServiceUnavailableError`);
  return result;
});

/* ------------------------------------------------------------------ */
console.log("\nModel JSON helpers (offline)\n");

const AUTO_RENEW_DETAILS = {
  state: "renewing",
  nextPeriodSeconds: 604800,
  autoCompoundSharePercent: 90,
  compoundedWeight: "5028049283",
  accruedValidationRewards: "28049283",
  accruedDelegateeRewards: "0",
  validationRewardAddresses: [F.halfRestakeAddress],
  delegationRewardAddresses: [F.halfRestakeAddress],
  exitReason: null,
  endedAtTimestamp: null,
};

await check("AutoRenewDetails round-trips through JSON", async () => {
  const parsed = autoRenewDetailsFromJSON(JSON.stringify(AUTO_RENEW_DETAILS));
  assert(parsed.ok, `fromJSON failed: ${parsed.error?.message}`);
  const again = JSON.parse(autoRenewDetailsToJSON(parsed.value));
  assert(JSON.stringify(again) === JSON.stringify(AUTO_RENEW_DETAILS),
    `round-trip changed the payload:\n${JSON.stringify(again)}`);
  return "identical in and out, nulls preserved";
});

await check("AutoRenewDetails keeps a populated exit", async () => {
  const exited = {
    ...AUTO_RENEW_DETAILS,
    state: "aborted",
    exitReason: "uptime_not_met",
    endedAtTimestamp: 1786771046,
  };
  const parsed = autoRenewDetailsFromJSON(JSON.stringify(exited));
  assert(parsed.ok, `fromJSON failed: ${parsed.error?.message}`);
  assert(parsed.value.endedAtTimestamp === 1786771046,
    `endedAtTimestamp=${parsed.value.endedAtTimestamp}`);
  return `exitReason=${parsed.value.exitReason} endedAtTimestamp=${parsed.value.endedAtTimestamp}`;
});

await check("AutoRenewedCycle round-trips through JSON", async () => {
  const cycle = MOCK_BODY.cycles[0];
  const parsed = autoRenewedCycleFromJSON(JSON.stringify(cycle));
  assert(parsed.ok, `fromJSON failed: ${parsed.error?.message}`);
  const again = JSON.parse(autoRenewedCycleToJSON(parsed.value));
  assert(JSON.stringify(again) === JSON.stringify(cycle), "round-trip changed the payload");
  return "identical in and out";
});

await check("outbound schemas reject a bad enum", async () => {
  try {
    autoRenewedCycleToJSON({ ...MOCK_BODY.cycles[0], outcome: "not-an-outcome" });
  } catch {
    return "AutoRenewedCycle.outcome rejected an unknown value";
  }
  throw new Error("toJSON accepted an invalid outcome");
});

await check("the remaining new components serialise", async () => {
  const current = {
    cycleIndex: 9,
    stakingTxHash: MOCK_BODY.cycles[0].stakingTxHash,
    startTimestamp: 1786739563,
    endTimestamp: 1786825963,
    weightAtCycleStart: "1000318708",
    projectedValidationReward: "1275238",
    accruedDelegateeReward: "0",
    autoCompoundSharePercent: 25,
    state: "renewing",
    delegatorCount: 0,
    amountDelegated: "0",
  };
  currentAutoRenewedCycleToJSON(current);
  listAutoRenewedCyclesResponseToJSON({ ...MOCK_BODY, currentCycle: current });
  pChainStakingTransactionToJSON({
    txHash: F.addAutoRenewedTx,
    txType: "AddAutoRenewedValidatorTx",
    blockTimestamp: 1785314783,
    blockNumber: "1",
    blockHash: "0x0",
    consumedUtxos: [],
    emittedUtxos: [],
    value: [],
    amountBurned: [],
    amountStaked: [],
    amountL1ValidatorBalanceBurned: [],
    period: 172800,
    autoCompoundRewardShares: 500000,
    autoRenew: AUTO_RENEW_DETAILS,
  });
  return "CurrentAutoRenewedCycle, ListAutoRenewedCyclesResponse, PChainStakingTransaction";
});

const total = pass + failures.length;
console.log(`\n${pass}/${total} passed`);
if (failures.length) {
  console.log(`failed: ${failures.join("; ")}`);
  process.exit(1);
}
