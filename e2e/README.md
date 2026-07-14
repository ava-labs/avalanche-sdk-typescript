# @avalanche-sdk/e2e

End-to-end integration tests for `@avalanche-sdk/*` against a local **tmpnet** AvalancheGo network.

This package is **not published**. It exists only to verify the SDK against real AvalancheGo wire bytes — the kind of bug where signature aggregation silently rejects malformed warp messages with `Failed to process signature aggregation request`.

The tmpnet driver and signature-aggregator wrapper are ported from [`ava-labs/avalanche-ai`](https://github.com/ava-labs/avalanche-ai) (`src/lib/tmpnet`, `src/lib/signature-aggregator`).

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.1.38
- An `avalanchego` binary on `$PATH` or under `~/.avalanche-cli/bin/<version>/avalanchego` (the driver will download one if missing)
- macOS / Linux (the tmpnet process management uses POSIX `lsof` / `pgrep`)

## Running

```bash
bun install
bun test                  # unit-shaped tests only
bun run test:integration  # boots a real tmpnet — takes minutes
```

Set `SKIP_INTEGRATION=true` to skip integration tests in shared environments.

ACP-236 auto-renewed validator E2E is opt-in until the default CI AvalancheGo
binary includes those transaction types:

```bash
ACP236_AVALANCHEGO_PATH=/path/to/acp236/avalanchego bun run test:integration:acp236
```

That test boots tmpnet and spends only local genesis funds.

## Layout

- `src/tmpnet/` — TypeScript driver for AvalancheGo tmpnet (boot / nodes / L1 ops / locking)
- `src/signature-aggregator/` — wrapper for the `signature-aggregator` binary (downloaded, not yet wired into tests)
- `src/utils/` — minimal logger, async-mutex, fs helpers required by the ports
- `test/` — vitest-style integration tests using `bun:test`

## CI

`.github/workflows/e2e.yml` runs the integration suite on push to `main` and via `workflow_dispatch`. PR opens do not trigger it (too slow). The workflow caches all binaries (avalanchego, subnet-evm, signature-aggregator, icm-relayer) keyed by version.
