import type { Hex } from "viem";

import { SignatureAggregatorManager } from "../../src/signature-aggregator/index.ts";

type AggregateSignaturesArgs = {
  unsignedMessageHex: Hex;
  signingSubnetId: string;
  justificationHex: Hex;
};

export type AggregateSignaturesFn = (args: AggregateSignaturesArgs) => Promise<Hex>;

/**
 * Wrap a {@link SignatureAggregatorManager} as the `aggregateSignatures`
 * callback expected by @avalanche-sdk/interchain's
 * {@link import("@avalanche-sdk/interchain").initializeValidatorSet}.
 *
 * Retries on "no signatures" / "failed to collect a threshold" — sig-aggregator
 * needs P2P warmup time after /health reports up before it can actually
 * collect signatures from peers. Errors outside that pattern fail fast.
 */
export function buildAggregateSignaturesFn(
  sigagg: SignatureAggregatorManager,
  opts: { timeoutMs?: number; retryDelayMs?: number; log?: (msg: string) => void } = {},
): AggregateSignaturesFn {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const retryDelayMs = opts.retryDelayMs ?? 3_000;
  const log = opts.log ?? console.log;

  return async ({ unsignedMessageHex, signingSubnetId, justificationHex }) => {
    const deadline = Date.now() + timeoutMs;
    let lastErr = "";
    while (Date.now() < deadline) {
      const sig = await sigagg.aggregateSignatures({
        message: unsignedMessageHex,
        justification: justificationHex,
        "signing-subnet-id": signingSubnetId,
      });
      if (sig["signed-message"]) {
        const hex = sig["signed-message"];
        return (hex.startsWith("0x") ? hex : `0x${hex}`) as Hex;
      }
      lastErr = sig.error ?? "unknown sig-aggregator error";
      if (!/no signatures|threshold/i.test(lastErr)) {
        throw new Error(`sig-aggregator failed: ${lastErr}`);
      }
      log(`waiting for sig-aggregator peers (${lastErr})...`);
      await Bun.sleep(retryDelayMs);
    }
    throw new Error(`sig-aggregator timed out: ${lastErr}`);
  };
}
