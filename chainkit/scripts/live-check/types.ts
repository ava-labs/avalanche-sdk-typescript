/** Type-level check of the linked build, from a consumer's perspective. */
import { Avalanche } from "@avalanche-sdk/chainkit";
import type {
  AutoRenewDetails,
  AutoRenewedCycle,
  ListPChainBalancesResponse,
  StakingType,
} from "@avalanche-sdk/chainkit/models/components";

const avalanche = new Avalanche({ network: "fuji" });

export async function balances(addresses: string) {
  const res = await avalanche.data.primaryNetwork.balances.listByAddresses({
    blockchainId: "p-chain",
    addresses,
  });

  // The response is an undiscriminated P/X/C union, so a consumer has to narrow
  // even though blockchainId was a literal "p-chain".
  const pchain = res as ListPChainBalancesResponse;

  const restaked: string | undefined = pchain.balances.restakedRewards;
  return restaked;
}

export async function cycles(nodeId: string): Promise<AutoRenewedCycle[]> {
  const pages = await avalanche.data.primaryNetwork.listAutoRenewedValidatorCycles({
    nodeId,
    pageSize: 5,
  });
  const out: AutoRenewedCycle[] = [];
  for await (const page of pages) {
    out.push(...page.result.cycles);
    const current = page.result.currentCycle;
    if (current) {
      const state: AutoRenewDetails["state"] = current.state;
      void state;
    }
  }
  return out;
}

export async function validatorStakingType(nodeIds: string): Promise<StakingType | undefined> {
  const pages = await avalanche.data.primaryNetwork.listValidators({ nodeIds });
  for await (const page of pages) {
    const v = page.result.validators[0];
    if (!v) continue;
    // stakingType is required on all four validator variants.
    const kind: StakingType = v.stakingType;

    // autoRenew only exists on the active and completed variants, and that
    // union discriminates cleanly on validationStatus.
    if (v.validationStatus === "active" || v.validationStatus === "completed") {
      const weight: string | undefined = v.autoRenew?.compoundedWeight;
      void weight;
    }
    return kind;
  }
  return undefined;
}
