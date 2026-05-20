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
 * by an EOA passed in via `buildValidatorManagerGenesisAlloc`.
 */
export const VALIDATOR_MANAGER_PROXY_ADMIN_ADDRESS =
    "0xdad0000000000000000000000000000000000000" as const;

/**
 * Placeholder used in the proxy's `eip1967.proxy.implementation` slot before
 * the real ValidatorManager is upgraded in. Picked to be unmistakably
 * uninitialized so callers don't accidentally think the proxy is wired up.
 */
export const UNINITIALIZED_IMPLEMENTATION_ADDRESS =
    "0x1212121212121212121212121212121212121212" as const;

/** keccak256("eip1967.proxy.implementation") - 1, hex. */
export const EIP1967_IMPL_SLOT =
    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc" as const;

/** keccak256("eip1967.proxy.admin") - 1, hex. */
export const EIP1967_ADMIN_SLOT =
    "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103" as const;
