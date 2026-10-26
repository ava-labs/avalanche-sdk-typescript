# Changelog

## Unreleased

- `@avalanche-sdk/client` - Fix the fee units in `send()` between the P-Chain and the C-Chain

  - The C-Chain import fee in `send()` from the P-Chain to the C-Chain, and the C-Chain export fee in `send()` from the C-Chain to the P-Chain, were in wei but were compared with amounts in nAVAX. With the mainnet base fee of 2.5 gwei, `send()` threw `Transfer amount is too low` for amounts below about 28,000 AVAX. From the P-Chain, it threw after the P-Chain export was accepted

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
