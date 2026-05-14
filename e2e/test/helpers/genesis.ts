import { buildValidatorManagerGenesisAlloc } from "@avalanche-sdk/interchain";

import { L1_CHAIN_ID } from "./constants.ts";

/**
 * subnet-evm v0.8.0 quirks baked into our L1 genesis:
 *
 *   durangoTimestamp + warpConfig.blockTimestamp are pinned to
 *   avalanchego's hardcoded local-network Durango activation
 *   (2020-12-05 05:00 UTC = 1607144400). Equal values are allowed;
 *   both at 0 fails verification ("warp cannot be activated before
 *   Durango") because 0 reads as "not set."
 *
 *   shanghaiTime + cancunTime are set to 0. subnet-evm doesn't
 *   auto-activate Shanghai when Durango is set, so we have to declare
 *   it explicitly for PUSH0 + transient storage (icm-contracts v2.1.0
 *   bytecode is solc 0.8.25).
 *
 *   genesis.timestamp = wall clock. subnet-evm overrides shanghaiTime
 *   to durangoTimestamp (1607144400) at chain setup. Pre-validator-set,
 *   the L1 has no active validators and produces no blocks — so
 *   eth_estimateGas runs against head = genesis. If genesis.timestamp
 *   = 0 < 1607144400, the simulator sees pre-Shanghai → PUSH0 reverts.
 *
 *   warpConfig.requirePrimaryNetworkSigners = true matches builders-hub.
 *   For SubnetToL1Conversion messages (source=P-Chain) the State wrapper
 *   in subnet-evm special-cases the lookup to mySubnetID regardless, so
 *   this is parity, not function.
 *
 *   The alloc pre-deploys a TransparentUpgradeableProxy at 0xfacade...
 *   and a ProxyAdmin at 0xdad0.... ConvertSubnetToL1Tx references the
 *   proxy as the validator manager, so it must exist at genesis. After
 *   conversion, step 6 deploys the real ValidatorManager and upgrades
 *   the proxy at it via ProxyAdmin.upgradeAndCall(...).
 */
export interface BuildGenesisOptions {
  prefundedAddress: `0x${string}`;
  proxyAdminOwner: `0x${string}`;
  chainId?: number;
}

const DURANGO_LOCAL_ACTIVATION_TIMESTAMP = 1607144400;

export function buildL1GenesisConfig(opts: BuildGenesisOptions): Record<string, unknown> {
  const chainId = opts.chainId ?? L1_CHAIN_ID;
  const prefundedAddressNoPrefix = opts.prefundedAddress.replace(/^0x/, "");

  return {
    config: {
      chainId,
      homesteadBlock: 0,
      eip150Block: 0,
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      muirGlacierBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      shanghaiTime: 0,
      cancunTime: 0,
      subnetEVMTimestamp: 0,
      durangoTimestamp: DURANGO_LOCAL_ACTIVATION_TIMESTAMP,
      warpConfig: {
        blockTimestamp: DURANGO_LOCAL_ACTIVATION_TIMESTAMP,
        quorumNumerator: 67,
        requirePrimaryNetworkSigners: true,
      },
    },
    alloc: {
      [prefundedAddressNoPrefix]: { balance: "0x295BE96E64066972000000" },
      ...buildValidatorManagerGenesisAlloc({ proxyAdminOwner: opts.proxyAdminOwner }),
    },
    nonce: "0x0",
    timestamp: `0x${Math.floor(Date.now() / 1000).toString(16)}`,
    extraData: "0x00",
    gasLimit: "0x7A1200",
    difficulty: "0x0",
    mixHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    coinbase: "0x0000000000000000000000000000000000000000",
    number: "0x0",
    gasUsed: "0x0",
    parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
  };
}
