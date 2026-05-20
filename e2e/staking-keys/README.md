# Local Network Staking Keys

Vendored from [`ava-labs/avalanchego`](https://github.com/ava-labs/avalanchego/tree/v1.14.0/staking/local) at tag `v1.14.0`.

**These keys are intentionally public.** AvalancheGo ships them with its local-network genesis so anyone can spin up a local 5-node validator set without generating new staking material. They MUST NOT be used on Fuji, mainnet, or any production network.

NodeIDs (in file index order):

| File | NodeID |
| ---- | ------ |
| `staker1.crt` / `staker1.key` / `signer1.key` | `NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg` |
| `staker2.crt` / `staker2.key` / `signer2.key` | `NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ` |
| `staker3.crt` / `staker3.key` / `signer3.key` | `NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN` |
| `staker4.crt` / `staker4.key` / `signer4.key` | `NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu` |
| `staker5.crt` / `staker5.key` / `signer5.key` | `NodeID-P7oB2McjBGgW2NXXWVYjV8JEDFoW9xDE5` |

These NodeIDs are baked into avalanchego's local network genesis as validators with `--sybil-protection-enabled=true`, so a tmpnet that uses these keys gets a real P-Chain validator set — which is what the signature-aggregator binary expects when looking up bootstrap peers.
