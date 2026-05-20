import {
    ProxyAdminDeployedBytecode,
} from "./artifacts/ProxyAdmin.js";
import {
    TransparentUpgradeableProxyDeployedBytecode,
} from "./artifacts/TransparentUpgradeableProxy.js";
import {
    EIP1967_ADMIN_SLOT,
    EIP1967_IMPL_SLOT,
    UNINITIALIZED_IMPLEMENTATION_ADDRESS,
    VALIDATOR_MANAGER_PROXY_ADDRESS,
    VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS,
} from "./constants.js";

function hexTo32Bytes(hex: string): string {
    let v = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (v.length > 64) throw new Error(`hex too long: ${hex}`);
    return `0x${v.padStart(64, "0").toLowerCase()}`;
}

/** Shape of a subnet-evm genesis `alloc` entry. */
export interface GenesisAllocEntry {
    balance: string;
    code?: string;
    nonce?: string;
    storage?: Record<string, string>;
}

/**
 * Build the genesis `alloc` entries that pre-deploy a
 * {@link TransparentUpgradeableProxy} + {@link ProxyAdmin} pair at the
 * well-known {@link VALIDATOR_MANAGER_PROXY_ADDRESS} /
 * {@link VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS} addresses.
 *
 * Merge the returned object into your subnet-evm genesis `alloc` field:
 *
 * ```ts
 * const genesisData = {
 *   config: { ... },
 *   alloc: {
 *     ...userAllocations,
 *     ...buildValidatorManagerGenesisAlloc({ proxyAdminOwner: deployerAddress }),
 *   },
 *   // ...
 * }
 * ```
 *
 * Why this pattern: `ConvertSubnetToL1Tx` bakes the validator manager address
 * into the canonical conversion data hash, so that address has to be known
 * before the L1's EVM chain has any deployable state. Pre-deploying a proxy
 * at a fixed address solves the chicken-and-egg: convert the subnet pointing
 * at the proxy, then after conversion the deployer upgrades the proxy to a
 * freshly deployed ValidatorManager implementation via the ProxyAdmin.
 *
 * @param proxyAdminOwner - 0x-prefixed EOA address that owns the ProxyAdmin
 *   (and therefore controls upgrades of the proxy).
 */
export function buildValidatorManagerGenesisAlloc(args: {
    proxyAdminOwner: `0x${string}`;
}): Record<string, GenesisAllocEntry> {
    return {
        [VALIDATOR_MANAGER_PROXY_ADDRESS.slice(2).toLowerCase()]: {
            balance: "0x0",
            code: TransparentUpgradeableProxyDeployedBytecode,
            nonce: "0x1",
            storage: {
                [EIP1967_IMPL_SLOT]: hexTo32Bytes(UNINITIALIZED_IMPLEMENTATION_ADDRESS),
                [EIP1967_ADMIN_SLOT]: hexTo32Bytes(VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS),
            },
        },
        [VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS.slice(2).toLowerCase()]: {
            balance: "0x0",
            code: ProxyAdminDeployedBytecode,
            nonce: "0x1",
            storage: {
                // OZ ProxyAdmin's Ownable slot 0 is the owner address.
                "0x0000000000000000000000000000000000000000000000000000000000000000":
                    hexTo32Bytes(args.proxyAdminOwner),
            },
        },
    };
}
