import {
    ProxyAdminDeployedBytecode,
} from "./artifacts/ProxyAdmin.js";
import {
    TransparentUpgradeableProxyDeployedBytecode,
} from "./artifacts/TransparentUpgradeableProxy.js";

/**
 * Well-known address where the {@link TransparentUpgradeableProxy} pre-deploy
 * lives. Use this address as the `validatorManagerAddress` field in
 * `ConvertSubnetToL1Tx` so the on-chain conversion data references a
 * deterministic, pre-existing contract.
 */
export const VALIDATOR_MANAGER_PROXY_ADDRESS =
    "0xfacade0000000000000000000000000000000000" as const;

/**
 * Well-known address where the {@link ProxyAdmin} pre-deploy lives. The admin
 * controls the proxy at {@link VALIDATOR_MANAGER_PROXY_ADDRESS} and is owned
 * by an EOA passed in via {@link buildValidatorManagerGenesisAlloc}.
 */
export const VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS =
    "0xdad0000000000000000000000000000000000000" as const;

/**
 * Placeholder used in the proxy's `eip1967.proxy.implementation` slot before
 * the real ValidatorManager is upgraded in. Picked to be unmistakably
 * uninitialized so callers don't accidentally think the proxy is wired up.
 */
const UNINITIALIZED_IMPLEMENTATION_ADDRESS =
    "0x1212121212121212121212121212121212121212" as const;

/** keccak256("eip1967.proxy.implementation") - 1, hex. */
const EIP1967_IMPL_SLOT =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

/** keccak256("eip1967.proxy.admin") - 1, hex. */
const EIP1967_ADMIN_SLOT =
    "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";

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
