# Changelog

## Unreleased

- `@avalanche-sdk/client` - Stop calling AvalancheGo RPC methods that are deprecated and will be removed

  - `send()` from the P-Chain no longer calls `platform.getBalance`. The transaction builder already throws `Insufficient funds` when the UTXOs cannot pay the amount and the fee. `send()` from the P-Chain to the C-Chain now spends the UTXOs of `account`, like `send()` from the P-Chain to the P-Chain
  - `waitForTxn` with `chainAlias: "X"` polls `avm.getTx` instead of `avm.getTxStatus`. The transaction is accepted when `avm.getTx` returns it
  - `waitForTxn` throws HTTP errors other than 429 at once, and adds the last polling error as the `cause` of `Transaction status not found`

- `@avalanche-sdk/client` - Fix the fee units in `send()` between the P-Chain and the C-Chain

  - The C-Chain import fee in `send()` from the P-Chain to the C-Chain, and the C-Chain export fee in `send()` from the C-Chain to the P-Chain, were in wei but were compared with amounts in nAVAX. With the mainnet base fee of 2.5 gwei, `send()` threw `Transfer amount is too low` for amounts below about 28,000 AVAX. From the P-Chain, it threw after the P-Chain export was accepted

- `@avalanche-sdk/client` - Mark the wrappers of deprecated AvalancheGo RPC methods as deprecated

  - Add `@deprecated` to `pChain.getStake`, `getSubnets`, `getBlockchains` and `getRewardUTXOs`, and to `xChain.getBalance`, `getAllBalances` and `getTxStatus`. Each note names the replacement
  - The React balance example gets the P-Chain balance from `platform.getUTXOs` instead of `platform.getBalance`

- `@avalanche-sdk/client` - `pChain.getBalance` reads the balance from `platform.getUTXOs`

  - `pChain.getBalance` no longer calls `platform.getBalance`, which AvalancheGo deprecated and will remove. It reads all UTXOs of the addresses with `platform.getUTXOs`, one request for each 1024 UTXOs, and adds them up with the rules of `platform.getBalance`. It gets the AVAX asset ID with `platform.getStakingAssetID`. Callers do not change their code
  - The return type now declares the per-asset maps `balances`, `unlockeds`, `lockedStakeables` and `lockedNotStakeables`, which `platform.getBalance` also returned
  - `utxoIDs` is `[]`, not `null`, when no UTXO is found

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
