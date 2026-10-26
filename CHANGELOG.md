# Changelog

## Unreleased

- `@avalanche-sdk/client` - Stop calling AvalancheGo RPC methods that are deprecated and will be removed

  - `send()` from the P-Chain no longer calls `platform.getBalance`. The transaction builder already throws `Insufficient funds` when the UTXOs cannot pay the amount and the fee. `send()` from the P-Chain to the C-Chain now spends the UTXOs of `account`, like `send()` from the P-Chain to the P-Chain
  - `waitForTxn` with `chainAlias: "X"` polls `avm.getTx` instead of `avm.getTxStatus`. The transaction is accepted when `avm.getTx` returns it
  - `waitForTxn` throws HTTP errors other than 429 at once, and adds the last polling error as the `cause` of `Transaction status not found`

## 2026-09-02

- Update `@avalanche-sdk/chainkit@v0.3.14` - Align the P-Chain models with the Helicon (ACP-236 auto-renewed validator) release of the Data API

  - Add `PChainBalance.restakedRewards`, returned by `GET /v1/networks/{network}/blockchains/p-chain/balances` on current-balance queries
  - Add `stakingType` to validator details (active, completed, pending, removed) and to pending/historical rewards
  - Add `autoRenew` (`AutoRenewDetails`) to active and completed validator details, and to staking transactions
  - Add `period`, `autoCompoundRewardShares` and `validatorAuthority` to `PChainTransaction`
  - Add `AddAutoRenewedValidatorTx`, `SetAutoRenewedValidatorConfigTx` and `RewardAutoRenewedValidatorTx` to `PChainTransactionType` and `PrimaryNetworkTxType`. Without these, every response containing one of these transactions failed response validation
  - Add `data.primaryNetwork.listAutoRenewedValidatorCycles()` for `GET /v1/networks/{network}/validators/{nodeId}/cycles`
  - Point `transactions:listStaking` at the new `ListPChainStakingTransactionsResponse`, whose transactions carry `autoRenew`

## 2025-08-13

Initial release with multiple packages in monorepo structure:

- Add `@avalanche-sdk/client@v0.0.4-alpha.12` package - Core RPC client with C-Chain, P-Chain, and X-Chain support
- Add `@avalanche-sdk/interchain@v0.0.1-alpha.2` package - ICM/ICTT messaging and Teleporter integration
- Add `@avalanche-sdk/chainkit@v0.3.0-alpha.0` package - Data, Metrics and Webhooks API support
