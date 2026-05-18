# `@avalanche-sdk/interchain/validator-manager`

End-to-end SDK for the **ACP-77 validator-manager** contract on an Avalanche L1
(formerly "subnet"). Wraps the EVM calls, the P-Chain transactions, and the
warp-message dance between them.

Read this if you're:
- Building a console / dashboard that converts subnets to L1s, registers
  validators, adjusts their weight, or removes them.
- Adding tests against a tmpnet AvalancheGo network.
- Trying to figure out **who signs what** in the cross-chain handshake.

## Lifecycle at a glance

```
                                                                          ┌──────────────────────┐
                                                                          │  P-Chain validators  │
┌──────────────────┐                                                      │     (primary net)    │
│   tmpnet boot    │ ─── ConvertSubnetToL1Tx ────────────────────────────►│ committed to L1's    │
│  + create subnet │                                                      │  initial set         │
│  + create chain  │                                                      └─────┬────────────────┘
└──────────────────┘                                                            │
                                                                                ▼
                                                                       ┌──────────────────────┐
┌──────────────────┐    deploy + upgradeProxy + initialize     ┌──────►│  ValidatorManager    │
│  L1 EVM (subnet- │                                            │      │  proxy @ 0xfacade... │
│  evm), genesis   │ ──────────────────────────────────────────►│      │                      │
│  pre-deploys     │                                            │      │  ┌────────────────┐  │
│  proxy + admin   │                                            │      │  │ _validation    │  │
└──────────────────┘                                            │      │  │  Periods       │  │
                                                                │      │  │ _registered    │  │
                                          initializeValidatorSet│      │  │  Validators    │  │
                                          (signed bootstrap     │◄─────┤  └────────────────┘  │
                                          ConversionData)       │      │                      │
                                                                │      │  initiate→ACK→complete│
                                                                └─────►│  for register / weight│
                                                                       │  / remove             │
                                                                       └──────────────────────┘
```

Two sources of truth must stay in sync:
1. **P-Chain state** — `state.GetL1Validator(validationID)` records the
   canonical weight, balance, and active/inactive status.
2. **Contract state** — `_validationPeriods[validationID]` records the
   contract's view (`Active` / `PendingAdded` / `PendingRemoved` / `Completed`).

The orchestrators in this package keep both in sync. The one path that
breaks the invariant is **`DisableL1ValidatorTx` on P-Chain directly** — see
[Force-disable below](#force-disable-direct-p-chain).

## Setup: from "subnet" to "L1 with deployed VM"

Three steps, one-shot, in this order:

```ts
import {
  deployValidatorManager,
  initializeValidatorManager,
  upgradeProxyToValidatorManager,
  buildValidatorManagerGenesisAlloc,
  VALIDATOR_MANAGER_PROXY_ADDRESS,
} from '@avalanche-sdk/interchain/validator-manager';
```

### 1. Pre-deploy the proxy in the L1's genesis

`ConvertSubnetToL1Tx` bakes `validatorManagerAddress` into the canonical
conversion-data hash. That address has to exist BEFORE the L1 has any
deployable state. Solution: merge a pre-allocated proxy + ProxyAdmin into
the L1's subnet-evm genesis `alloc` field:

```ts
const genesisData = {
  config: { /* chain config */ },
  alloc: {
    [deployerAddress.slice(2)]: { balance: '0x...' },
    ...buildValidatorManagerGenesisAlloc({ proxyAdminOwner: deployerAddress }),
  },
  // ...
};
```

This places a `TransparentUpgradeableProxy` at `0xfacade0000000000000000000000000000000000`
and a `ProxyAdmin` at `0xdad0000000000000000000000000000000000000`.

### 2. Convert the subnet to an L1 (P-Chain)

```ts
await walletClient.pChain.prepareConvertSubnetToL1Txn({
  subnetId, blockchainId,
  managerContractAddress: VALIDATOR_MANAGER_PROXY_ADDRESS,
  validators: bootstrapValidators,
  subnetAuth: [0],
});
```

### 3. Upgrade the proxy at a real ValidatorManager (EVM)

```ts
await upgradeProxyToValidatorManager(l1WalletClient, l1PublicClient, {
  initSettings: {
    admin: deployerAddress,
    subnetID: subnetIdHex,
    churnPeriodSeconds: 0n,
    maximumChurnPercentage: 20,
  },
});
```

This deploys the implementation (`ICMInitializable.Disallowed` so it can't
be initialized directly), then calls `ProxyAdmin.upgradeAndCall(proxy, impl,
initialize-calldata)` atomically — the proxy is now backed by a fully
initialized ValidatorManager.

### 4. Hand over the bootstrap set to the contract (EVM warp)

```ts
await initializeValidatorSet(l1WalletClient, l1PublicClient, {
  contractAddress, networkId, subnetId, blockchainId,
  validators: bootstrapValidators,
  aggregateSignatures: sigAggCallback,
});
```

The contract verifies the supplied `ConversionData` hashes to the same
`conversionID` the P-Chain committed in step 2, and writes the bootstrap
set into `_validationPeriods`.

## Validator lifecycle operations

After setup, three orchestrators handle the day-to-day:

| Orchestrator | What it does | EVM tx ×2 | P-Chain tx ×1 | Warp aggregations ×2 |
|---|---|:-:|:-:|:-:|
| `registerL1Validator` | Add a validator | `initiate` → `complete` | `RegisterL1ValidatorTx` | outgoing + ACK |
| `setL1ValidatorWeight` | Change weight | `initiate` → `complete` | `SetL1ValidatorWeightTx` | outgoing + ACK |
| `disableL1Validator` | Remove a validator | `initiate` → `complete` | `SetL1ValidatorWeightTx (weight=0)` | outgoing + ACK |

All three follow the same shape:

```
  EVM initiate ──► warp msg (L1 source) ──► sigagg ──► P-Chain tx ──► state change
                                                                            │
       ◄──── EVM complete ◄── warp ACK (P-Chain source) ◄── sigagg ◄───────┘
```

### Signing-subnet & justification cheat-sheet

This is the most error-prone part. There's a comment in
`subnet-evm/precompile/contracts/warp/config.go::VerifyPredicate` that
documents why:

> The primary network validator set is never required when verifying
> messages from the P-chain because the P-chain is always synced.

So even though the messages come **from P-Chain**, you sign them with the
**L1's own subnet validators**. Always.

| Direction | Source chain | Signing subnet | Justification |
|---|---|---|---|
| L1 → P-Chain (outgoing register / weight / remove) | L1 | L1 subnet | empty (`"0x"`) |
| P-Chain → L1 (`L1ValidatorRegistrationMessage` ACK, `true`) | P-Chain | **L1 subnet** | `RegisterL1ValidatorMessage` raw payload |
| P-Chain → L1 (`L1ValidatorRegistrationMessage` ACK, `false`) | P-Chain | **L1 subnet** | **protobuf-wrapped** `RegisterL1ValidatorMessage` (use `getRegistrationJustification`) |
| P-Chain → L1 (`L1ValidatorWeightMessage` ACK) | P-Chain | **L1 subnet** | 32-byte validation ID |

If you pick the wrong signing subnet, sigagg succeeds but the L1's warp
predicate rejects the message with `InvalidWarpMessage` and the EVM tx
reverts with no obvious reason. Use `assertSuccessOrReplay` (already wired
into the orchestrators) to get the abi-decoded revert.

### Required callbacks

Every orchestrator takes the same kinds of callbacks so the SDK package
doesn't depend on `@avalanche-sdk/client` for the P-Chain wallet:

```ts
{
  aggregateSignatures: AggregateSignaturesFn,    // wraps your sig-aggregator HTTP API
  submitPChainXxxTx: SubmitPChainXxxTxFn,        // your P-Chain wallet client builds + sends
  // register-only:
  getBlsProofOfPossession: GetBlsProofOfPossessionFn,
}
```

See `interchain/src/validator-manager/registerL1Validator.ts` for the
canonical wiring; the e2e test `warp-l1-flow.integration.test.ts` is a
working reference implementation against tmpnet.

## Force-disable (direct P-Chain)

```ts
await walletClient.pChain.prepareDisableL1ValidatorTxn({
  validationId, disableAuth: [0],
});
```

A separate path: authorized by the validator's `disableOwner` credentials,
no warp messages exchanged, no contract participation. P-Chain refunds the
remaining balance and marks the L1 validator inactive — **but the
contract's `_validationPeriods` entry stays `Active` until reconciled.**

Reconciliation pattern:
1. (Optional) `IncreaseL1ValidatorBalanceTx` to reactivate on P-Chain.
2. `disableL1Validator` (contract flow) to drive the contract through its
   normal `PendingRemoved → Completed` transitions.

Steps 12–14 of the e2e suite exercise this exact admin-recovery pattern.

## Common gotchas

- **ACP-181 epoch trap.** The L1's first warp messages are verified at
  epoch 1's `pChainHeight=0` — every signature check returns "unknown
  validator." Roll the L1 past epoch 1 with two warm-up self-transfers
  separated by `GraniteEpochDuration` (30s local / 5min mainnet) before
  the first `initializeValidatorSet` and again after each P-Chain state
  change. The e2e's `rollL1PastFirstEpoch` helper does this.
- **P-Chain `GetMinimumHeight` lag.** A fresh local network's P-Chain warp
  verifier reads validator sets at a height that lags behind the tip.
  Before submitting `RegisterL1ValidatorTx` / `SetL1ValidatorWeightTx`,
  advance P-Chain with two self-transfers + a 30s sleep.
- **Quorum mismatch.** EVM warpConfig defaults to `quorumNumerator: 67`
  and avalanchego hard-codes `WarpQuorumNumerator: 67`. Your
  sig-aggregator's `quorum-percentage` request param must be ≥67 or ACK
  messages from multi-signer subnets won't reach quorum.
- **`completeValidatorRemoval` ACK shape.** It expects
  `L1ValidatorRegistrationMessage(validationID, false)`, NOT a weight-update
  message — even though the underlying P-Chain tx is a `SetL1ValidatorWeightTx`.
  The orchestrators handle this; if you're doing it manually, beware.
- **`NodeAlreadyRegistered` after completion.** `completeValidatorRemoval`
  clears `_registeredValidators[nodeID]`, so you CAN re-register the same
  NodeID later. Only the bootstrap-validator nodeIDs stay reserved as long
  as those validators are active.

## Public surface

```ts
// Setup
deployValidatorManager, initializeValidatorManager, deployPoAManager,
upgradeProxyToValidatorManager, buildValidatorManagerGenesisAlloc,
linkBytecode, listUnlinkedLibraries,
VALIDATOR_MANAGER_PROXY_ADDRESS, VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS

// Lifecycle orchestrators
initializeValidatorSet, registerL1Validator, setL1ValidatorWeight,
disableL1Validator

// Per-orchestrator initiate/complete pieces (for custom flows)
initiateValidatorRegistration, completeValidatorRegistration,
initiateValidatorWeightUpdate, completeValidatorWeightUpdate,
initiateValidatorRemoval, completeValidatorRemoval

// Shared EVM helpers
deployAndAwait, base58checkToBytes32Hex, assertSuccessOrReplay

// Artifacts (raw ABIs + bytecode)
ValidatorManagerAbi, ValidatorManagerBytecode,
ValidatorMessagesAbi, ValidatorMessagesBytecode,
PoAManagerAbi, PoAManagerBytecode,
ProxyAdminAbi, ProxyAdminBytecode, ProxyAdminDeployedBytecode,
TransparentUpgradeableProxyAbi, TransparentUpgradeableProxyBytecode,
TransparentUpgradeableProxyDeployedBytecode

// Types
ValidatorManagerSettings, ICMInitializable,
DeployValidatorManagerArgs, DeployValidatorManagerResult,
UpgradeProxyToValidatorManagerArgs, UpgradeProxyToValidatorManagerResult,
InitializeValidatorSetArgs, InitializeValidatorSetResult, InitialValidator,
AggregateSignaturesFn,
RegisterL1ValidatorArgs, RegisterL1ValidatorResult, RegisterValidatorParams,
EvmPChainOwner, GetBlsProofOfPossessionFn, SubmitPChainRegisterTxFn,
SetL1ValidatorWeightArgs, SetL1ValidatorWeightResult, SubmitPChainSetWeightTxFn,
DisableL1ValidatorArgs, DisableL1ValidatorResult,
GenesisAllocEntry
```
