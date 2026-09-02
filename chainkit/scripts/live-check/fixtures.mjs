/**
 * Identifiers lifted from the glacier-api record/replay integration tests, so this
 * harness exercises the same Fuji state the API team asserts against.
 *
 * Source: apps/glacier-api/test/integration/tests/primary-network/p-chain/
 *   transactions.spec.ts, rewards.spec.ts, utxos.spec.ts
 */
export const FIXTURES = {
  // shares 500000 -> half of each cycle's reward is restaked.
  // Used by: address history, listStaking, utxos, pending rewards.
  halfRestakeAddress: "fuji1h8gg0c9dn0xpgg4a94ng35yelra0yhslyfjk3d",
  halfRestakeNodeId: "NodeID-7MAWS9GdGYo7P9xEf1kWg9UQXxw9Nb6e7",

  // shares 1000000 -> everything restaked, withdrawn portion is 0.
  fullRestakeAddress: "fuji13tuwgzkshwd9y0y2mknah7duc9yfylyemsa7pw",

  // Two historical reward rows: a terminal/abort cycle and an intermediate one.
  historicalRewardsAddress: "fuji19j5wc4tue3k9fuy2d5r7f854ldg4h9nu5l9gny",

  // AddAutoRenewedValidatorTx settled by three RewardAutoRenewedValidatorTx rows.
  addAutoRenewedTx: "258CFXhtwDJu3UtuK5M5JjWMxyDhAiJgvqptmw8jSXsGeytEiq",

  // RewardAutoRenewedValidatorTx: validation reward + delegatee commission.
  rewardTxValidationAndCommission: "2ALhzxNtpYoLZdYMx2yQC9jfB5VmR2asmiWUByLoJ7xw7AQyss",

  // RewardAutoRenewedValidatorTx: a single validation reward.
  rewardTxValidationOnly: "29Zn1mv2FRjQacwdUkVEKzwSwgNnX9jKwaSJ4MVmcMVMuu41g7",
};
