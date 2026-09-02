/**
 * Consumer-side check of @avalanche-sdk/chainkit against the deployed Fuji Data API.
 *
 * Runs against whatever is installed in ./node_modules, so the same file can be
 * pointed at the published release (baseline) or the npm-linked local build.
 */
import { Avalanche } from "@avalanche-sdk/chainkit";
import { createRequire } from "node:module";
import { FIXTURES as F } from "./fixtures.mjs";

const require = createRequire(import.meta.url);
const { version } = require("@avalanche-sdk/chainkit/package.json");

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

/** First page of a paginated result. */
async function firstPage(iterator) {
  const { value } = await iterator[Symbol.asyncIterator]().next();
  assert(value, "no page returned");
  return value.result;
}

console.log(`\n@avalanche-sdk/chainkit@${version} vs. https://data-api.avax.network (fuji)\n`);

console.log("P-Chain balances");

await check("restakedRewards present on a current-balance query", async () => {
  const res = await avalanche.data.primaryNetwork.balances.listByAddresses({
    blockchainId: "p-chain",
    addresses: F.halfRestakeAddress,
  });
  const { restakedRewards } = res.balances;
  assert(typeof restakedRewards === "string",
    `restakedRewards is ${typeof restakedRewards}, expected string`);
  return `restakedRewards="${restakedRewards}"`;
});

await check("restakedRewards omitted on a historical query", async () => {
  const res = await avalanche.data.primaryNetwork.balances.listByAddresses({
    blockchainId: "p-chain",
    addresses: F.halfRestakeAddress,
    blockTimestamp: 1786000000,
  });
  const { restakedRewards } = res.balances;
  assert(restakedRewards === undefined,
    `expected undefined for a historical query, got ${JSON.stringify(restakedRewards)}`);
  return "undefined, as the contract specifies for blockTimestamp > 0";
});

console.log("\nP-Chain transactions (the ACP-236 tx types)");

await check("AddAutoRenewedValidatorTx by hash", async () => {
  const tx = await avalanche.data.primaryNetwork.transactions.get({
    blockchainId: "p-chain",
    txHash: F.addAutoRenewedTx,
  });
  assert(tx.txType === "AddAutoRenewedValidatorTx", `txType=${tx.txType}`);
  assert(tx.period !== undefined, "period missing");
  assert(tx.autoCompoundRewardShares !== undefined, "autoCompoundRewardShares missing");
  return `${tx.txType} period=${tx.period}s shares=${tx.autoCompoundRewardShares}`;
});

await check("RewardAutoRenewedValidatorTx by hash (validation + commission)", async () => {
  const tx = await avalanche.data.primaryNetwork.transactions.get({
    blockchainId: "p-chain",
    txHash: F.rewardTxValidationAndCommission,
  });
  assert(tx.txType === "RewardAutoRenewedValidatorTx", `txType=${tx.txType}`);
  return `${tx.txType} emittedUtxos=${tx.emittedUtxos.length} stakingTxHash=${tx.stakingTxHash?.slice(0, 12)}...`;
});

await check("RewardAutoRenewedValidatorTx by hash (validation only)", async () => {
  const tx = await avalanche.data.primaryNetwork.transactions.get({
    blockchainId: "p-chain",
    txHash: F.rewardTxValidationOnly,
  });
  assert(tx.txType === "RewardAutoRenewedValidatorTx", `txType=${tx.txType}`);
  return `${tx.txType} emittedUtxos=${tx.emittedUtxos.length} estimatedReward=${tx.estimatedReward}`;
});

await check("address history for an auto-renewed owner", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.transactions.listLatest({
    blockchainId: "p-chain",
    addresses: F.halfRestakeAddress,
  }));
  const types = [...new Set(body.transactions.map((t) => t.txType))];
  return `txs=${body.transactions.length} types=[${types.join(", ")}]`;
});

await check("transactions:listStaking carries autoRenew", async () => {
  const body = await firstPage(
    await avalanche.data.primaryNetwork.transactions.listActiveStakingTransactions({
      blockchainId: "p-chain",
      addresses: F.halfRestakeAddress,
    }),
  );
  const arv = body.transactions.find((t) => t.txType === "AddAutoRenewedValidatorTx");
  assert(arv, "no AddAutoRenewedValidatorTx on the first page");
  assert(arv.autoRenew, "autoRenew missing from the staking transaction");
  return `state=${arv.autoRenew.state} share=${arv.autoRenew.autoCompoundSharePercent}% weight=${arv.autoRenew.compoundedWeight}`;
});

console.log("\nValidators and cycles");

await check("listValidators exposes stakingType + autoRenew", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.listValidators({
    nodeIds: F.halfRestakeNodeId,
  }));
  const v = body.validators[0];
  assert(v, "no validator returned");
  assert(v.stakingType === "autoRenewed", `stakingType=${JSON.stringify(v.stakingType)}`);
  assert(v.autoRenew, "autoRenew missing");
  return `stakingType=${v.stakingType} state=${v.autoRenew.state} nextPeriod=${v.autoRenew.nextPeriodSeconds}s`;
});

await check("listAutoRenewedValidatorCycles (new operation)", async () => {
  const fn = avalanche.data.primaryNetwork.listAutoRenewedValidatorCycles;
  assert(typeof fn === "function", "method not present on this version");
  const body = await firstPage(await avalanche.data.primaryNetwork
    .listAutoRenewedValidatorCycles({ nodeId: F.halfRestakeNodeId, pageSize: 5 }));
  const c = body.cycles[0];
  assert(c, "no settled cycles returned");
  return `cycles=${body.cycles.length} cycle${c.cycleIndex}{outcome=${c.outcome} gross=${c.grossValidationReward} compounded=${c.compoundedValidationReward} share=${c.autoCompoundSharePercent}%} current=${body.currentCycle?.state ?? "absent"}`;
});

console.log("\nRewards");

await check("historical rewards carry stakingType", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.rewards
    .listHistoricalRewards({ addresses: F.historicalRewardsAddress }));
  const r = body.historicalRewards[0];
  assert(r, "no historical rewards returned");
  assert(r.stakingType !== undefined, "stakingType missing");
  const amounts = body.historicalRewards.map((x) => x.amountStaked).join(", ");
  return `rows=${body.historicalRewards.length} stakingType=${r.stakingType} amountStaked=[${amounts}]`;
});

await check("pending rewards carry stakingType (half restake)", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.rewards
    .listPendingRewards({ addresses: F.halfRestakeAddress }));
  const r = body.pendingRewards[0];
  assert(r, "no pending rewards returned");
  assert(r.stakingType !== undefined, "stakingType missing");
  return `stakingType=${r.stakingType} estimatedReward=${r.estimatedReward.amount} ${r.estimatedReward.symbol} (withdrawn portion only)`;
});

// The full-restake fixture has no live pending position any more — glacier-api
// replays a recorded cassette, so its copy of this case still passes. An empty
// page is a real parse either way.
await check("pending rewards, empty page still parses (full restake)", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.rewards
    .listPendingRewards({ addresses: F.fullRestakeAddress }));
  assert(Array.isArray(body.pendingRewards), "pendingRewards is not an array");
  return `rows=${body.pendingRewards.length} (fixture has drifted since glacier-api recorded it)`;
});

console.log("\nUTXOs");

await check("p-chain utxos for an auto-renewed owner", async () => {
  const body = await firstPage(await avalanche.data.primaryNetwork.utxos.listByAddresses({
    blockchainId: "p-chain",
    addresses: F.halfRestakeAddress,
  }));
  const staked = body.utxos.filter((u) => u.staked);
  return `utxos=${body.utxos.length} staked=${staked.length}`;
});

const total = pass + failures.length;
console.log(`\n${pass}/${total} passed`);
if (failures.length) {
  console.log(`failed: ${failures.join("; ")}`);
  process.exit(1);
}
