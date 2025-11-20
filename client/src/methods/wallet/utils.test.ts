import { beforeEach, describe, expect, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import {
  C_CHAIN_ALIAS,
  MAINNET_NETWORK_ID,
  P_CHAIN_ALIAS,
  TESTNET_NETWORK_ID,
  X_CHAIN_ALIAS,
} from "../consts.js";
import {
  addOrModifyXPAddressesAlias,
  avaxToNanoAvax,
  avaxToWei,
  bech32AddressToBytes,
  evmAddressToBytes,
  evmOrBech32AddressToBytes,
  formatOutput,
  getBaseUrl,
  getBech32AddressFromAccountOrClient,
  getChainIdFromAlias,
  getEVMAddressFromAccountOrClient,
  nanoAvaxToAvax,
  nanoAvaxToWei,
  weiToAvax,
  weiToNanoAvax,
} from "./utils.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const account = privateKeyToAvalancheAccount(privateKey1ForTest);

// Mock dependencies
vi.mock("./getAccountPubKey.js", () => ({
  getAccountPubKey: vi.fn(),
}));

vi.mock("viem/actions", () => ({
  getAddresses: vi.fn(),
}));

import { getAddresses } from "viem/actions";
import { getAccountPubKey } from "./getAccountPubKey.js";

describe("getBaseUrl", () => {
  test("returns base URL from chain RPC URL", () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const baseUrl = getBaseUrl(client);
    expect(baseUrl).toBe("https://api.avax.network");
  });

  test("throws error when RPC URL not found", () => {
    const clientWithoutRPC = {
      chain: {
        ...avalanche,
        rpcUrls: {
          default: {},
        },
      },
    } as any;

    expect(() => getBaseUrl(clientWithoutRPC)).toThrow("RPC URL not found");
  });
});

describe("getBech32AddressFromAccountOrClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("uses account xpAccount when provided", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const address = await getBech32AddressFromAccountOrClient(
      client,
      account,
      P_CHAIN_ALIAS,
      "avax"
    );

    expect(address).toMatch(/^P-/);
    expect(getAccountPubKey).not.toHaveBeenCalled();
  });

  test("uses client xpAccount when account not provided", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const address = await getBech32AddressFromAccountOrClient(
      client,
      undefined,
      X_CHAIN_ALIAS,
      "avax"
    );

    expect(address).toMatch(/^X-/);
    expect(getAccountPubKey).not.toHaveBeenCalled();
  });

  test("calls getAccountPubKey when no account available", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    // Mock to simulate no account scenario by using a different client instance
    const clientWithoutAccount = {
      ...client,
      xpAccount: undefined,
      account: undefined,
    } as any;

    vi.mocked(getAccountPubKey).mockResolvedValue({
      evm: account.getEVMAddress(),
      xp: account.xpAccount?.publicKey as string,
    });

    const address = await getBech32AddressFromAccountOrClient(
      clientWithoutAccount,
      undefined,
      P_CHAIN_ALIAS,
      "avax"
    );

    expect(address).toMatch(/^P-/);
    expect(getAccountPubKey).toHaveBeenCalledWith(clientWithoutAccount);
  });

  test("uses EVM public key for C-Chain", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const address = await getBech32AddressFromAccountOrClient(
      client,
      account,
      C_CHAIN_ALIAS,
      "avax"
    );

    expect(address).toMatch(/^C-/);
  });

  test("throws error when EVM public key not found for C-Chain", async () => {
    const accountWithoutEVMKey = {
      ...account,
      evmAccount: {
        ...account.evmAccount,
        publicKey: undefined,
      },
    } as any;

    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account: accountWithoutEVMKey,
    });

    await expect(
      getBech32AddressFromAccountOrClient(
        client,
        accountWithoutEVMKey,
        C_CHAIN_ALIAS,
        "avax"
      )
    ).rejects.toThrow("EVM public key not found for evm account");
  });
});

describe("getEVMAddressFromAccountOrClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("uses account EVM address when provided", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const address = await getEVMAddressFromAccountOrClient(client, account);
    expect(address).toBe(account.getEVMAddress());
    expect(getAddresses).not.toHaveBeenCalled();
  });

  test("uses client account address when account not provided", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const address = await getEVMAddressFromAccountOrClient(client, undefined);
    expect(address).toBe(account.getEVMAddress());
    expect(getAddresses).not.toHaveBeenCalled();
  });

  test("calls getAddresses when no account available", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const clientWithoutAccount = {
      ...client,
      account: undefined,
    } as any;

    vi.mocked(getAddresses).mockResolvedValue([
      "0x1234567890123456789012345678901234567890" as `0x${string}`,
    ]);

    const address = await getEVMAddressFromAccountOrClient(
      clientWithoutAccount,
      undefined
    );
    expect(address).toBe("0x1234567890123456789012345678901234567890");
    expect(getAddresses).toHaveBeenCalledWith(clientWithoutAccount);
  });

  test("throws error when no addresses found", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const clientWithoutAccount = {
      ...client,
      account: undefined,
    } as any;

    vi.mocked(getAddresses).mockResolvedValue([]);

    await expect(
      getEVMAddressFromAccountOrClient(clientWithoutAccount, undefined)
    ).rejects.toThrow("No EVM address found from wallet");
  });

  test("throws error when multiple addresses found", async () => {
    const client = createAvalancheWalletCoreClient({
      chain: avalanche,
      transport: {
        type: "custom",
        provider: {
          request: vi.fn(),
        },
      },
      account,
    });

    const clientWithoutAccount = {
      ...client,
      account: undefined,
    } as any;

    vi.mocked(getAddresses).mockResolvedValue([
      "0x1234567890123456789012345678901234567890" as `0x${string}`,
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as `0x${string}`,
    ]);

    await expect(
      getEVMAddressFromAccountOrClient(clientWithoutAccount, undefined)
    ).rejects.toThrow(
      "Multiple EVM addresses found from wallet, pass the from address"
    );
  });
});

describe("evmAddressToBytes", () => {
  test("converts valid EVM address with 0x prefix", () => {
    const address = "0x1234567890123456789012345678901234567890";
    const bytes = evmAddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(20);
  });

  test("adds 0x prefix if missing", () => {
    const address = "1234567890123456789012345678901234567890";
    const bytes = evmAddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(20);
  });

  test("throws error for invalid address length", () => {
    expect(() => evmAddressToBytes("0x123")).toThrow(
      "Invalid EVM address: 0x123"
    );
  });
});

describe("bech32AddressToBytes", () => {
  test("converts bech32 address with chain alias", () => {
    // Use a valid bech32 address from the account
    const address = account.getXPAddress("P", "avax");
    const bytes = bech32AddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });

  test("adds P- prefix if chain alias missing", () => {
    // Get address without prefix
    const addressWithPrefix = account.getXPAddress("P", "avax");
    const address = addressWithPrefix.replace("P-", "");
    const bytes = bech32AddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
});

describe("evmOrBech32AddressToBytes", () => {
  test("tries EVM address first", () => {
    const address = "0x1234567890123456789012345678901234567890";
    const bytes = evmOrBech32AddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(20);
  });

  test("falls back to bech32 if EVM conversion fails", () => {
    const address = account.getXPAddress("P", "avax");
    const bytes = evmOrBech32AddressToBytes(address);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
});

describe("Conversion functions", () => {
  describe("avaxToWei", () => {
    test("converts AVAX to wei correctly", () => {
      expect(avaxToWei(1)).toBe(BigInt(1e18));
      expect(avaxToWei(0.5)).toBe(BigInt(5e17));
      expect(avaxToWei(10)).toBe(BigInt(10e18));
    });
  });

  describe("weiToAvax", () => {
    test("converts wei to AVAX correctly", () => {
      expect(weiToAvax(BigInt(1e18))).toBe(BigInt(1));
      expect(weiToAvax(BigInt(5e17))).toBe(BigInt(0));
      expect(weiToAvax(BigInt(10e18))).toBe(BigInt(10));
    });
  });

  describe("avaxToNanoAvax", () => {
    test("converts AVAX to nanoAVAX correctly", () => {
      expect(avaxToNanoAvax(1)).toBe(BigInt(1e9));
      expect(avaxToNanoAvax(0.5)).toBe(BigInt(5e8));
      expect(avaxToNanoAvax(10)).toBe(BigInt(10e9));
    });
  });

  describe("weiToNanoAvax", () => {
    test("converts wei to nanoAVAX correctly", () => {
      expect(weiToNanoAvax(BigInt(1e9))).toBe(BigInt(1));
      expect(weiToNanoAvax(BigInt(5e8))).toBe(BigInt(0));
      expect(weiToNanoAvax(BigInt(10e9))).toBe(BigInt(10));
    });
  });

  describe("nanoAvaxToWei", () => {
    test("converts nanoAVAX to wei correctly", () => {
      expect(nanoAvaxToWei(BigInt(1))).toBe(BigInt(1e9));
      expect(nanoAvaxToWei(BigInt(10))).toBe(BigInt(10e9));
    });
  });

  describe("nanoAvaxToAvax", () => {
    test("converts nanoAVAX to AVAX correctly", () => {
      expect(nanoAvaxToAvax(BigInt(1e9))).toBe(1);
      expect(nanoAvaxToAvax(BigInt(5e8))).toBe(0.5);
      expect(nanoAvaxToAvax(BigInt(10e9))).toBe(10);
    });
  });
});

describe("getChainIdFromAlias", () => {
  test("returns X-Chain mainnet ID for mainnet", () => {
    expect(getChainIdFromAlias(X_CHAIN_ALIAS, MAINNET_NETWORK_ID)).toBe(
      "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM"
    );
  });

  test("returns X-Chain fuji ID for testnet", () => {
    expect(getChainIdFromAlias(X_CHAIN_ALIAS, TESTNET_NETWORK_ID)).toBe(
      "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm"
    );
  });

  test("returns C-Chain mainnet ID for mainnet", () => {
    expect(getChainIdFromAlias(C_CHAIN_ALIAS, MAINNET_NETWORK_ID)).toBe(
      "2q9e4r6Mu3U68nU1fYjgbR6JvwrRx36CohpAX5UQxse55x1Q5"
    );
  });

  test("returns C-Chain fuji ID for testnet", () => {
    expect(getChainIdFromAlias(C_CHAIN_ALIAS, TESTNET_NETWORK_ID)).toBe(
      "yH8D7ThNJkxmtkuv2jgBa4P1Rn3Qpr4pPr7QYNfcdoS6k6HWp"
    );
  });

  test("returns P-Chain mainnet ID for mainnet", () => {
    expect(getChainIdFromAlias(P_CHAIN_ALIAS, MAINNET_NETWORK_ID)).toBe(
      "11111111111111111111111111111111LpoYY"
    );
  });

  test("returns P-Chain fuji ID for testnet", () => {
    expect(getChainIdFromAlias(P_CHAIN_ALIAS, TESTNET_NETWORK_ID)).toBe(
      "11111111111111111111111111111111LpoYY"
    );
  });

  test("throws error for invalid network ID", () => {
    expect(() => getChainIdFromAlias(X_CHAIN_ALIAS, 999)).toThrow(
      "Invalid network ID: 999"
    );
  });

  test("throws error for invalid chain alias", () => {
    expect(() =>
      getChainIdFromAlias("INVALID" as any, MAINNET_NETWORK_ID)
    ).toThrow("Invalid chain alias: INVALID");
  });
});

describe("formatOutput", () => {
  test("formats output with default values", () => {
    const context = {
      avaxAssetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      hrp: "avax",
    } as any;

    const output = {
      amount: BigInt(1000000),
      addresses: [account.getXPAddress("P", "avax")],
    };

    const result = formatOutput(output, context);
    expect(result).toBeDefined();
  });

  test("formats output with custom asset ID", () => {
    const context = {
      avaxAssetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      hrp: "avax",
    } as any;

    // Use a valid base58 asset ID format
    const output = {
      assetId: "2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe",
      amount: BigInt(1000000),
      addresses: [account.getXPAddress("P", "avax")],
    };

    const result = formatOutput(output, context);
    expect(result).toBeDefined();
  });

  test("formats output with locktime and threshold", () => {
    const context = {
      avaxAssetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",
      hrp: "avax",
    } as any;

    const output = {
      amount: BigInt(1000000),
      addresses: [account.getXPAddress("P", "avax")],
      locktime: BigInt(1234567890),
      threshold: 2,
    };

    const result = formatOutput(output, context);
    expect(result).toBeDefined();
  });
});

describe("addOrModifyXPAddressesAlias", () => {
  test("returns undefined for undefined input", () => {
    expect(addOrModifyXPAddressesAlias(undefined, "P")).toBeUndefined();
  });

  test("adds alias to addresses without alias", () => {
    const pAddress = account.getXPAddress("P", "avax");
    const addressWithoutPrefix = pAddress.replace("P-", "");
    const addresses = [addressWithoutPrefix, "avax1example"];
    const result = addOrModifyXPAddressesAlias(addresses, "P");
    expect(result).toHaveLength(2);
    expect(result?.[0]).toBe(pAddress);
    expect(result?.[1]).toBe("P-avax1example");
  });

  test("modifies alias for addresses with different alias", () => {
    const pAddress = account.getXPAddress("P", "avax");
    const xAddress = account.getXPAddress("X", "avax");
    const addresses = [xAddress, "C-avax1example"];
    const result = addOrModifyXPAddressesAlias(addresses, "P");
    expect(result).toHaveLength(2);
    expect(result?.[0]).toMatch(/^P-/);
    expect(result?.[1]).toBe("P-avax1example");
  });

  test("keeps addresses with same alias", () => {
    const pAddress = account.getXPAddress("P", "avax");
    const addresses = [pAddress, "P-avax1example"];
    const result = addOrModifyXPAddressesAlias(addresses, "P");
    expect(result).toEqual(addresses);
  });

  test("handles mixed addresses", () => {
    const pAddress = account.getXPAddress("P", "avax");
    const xAddress = account.getXPAddress("X", "avax");
    const addressWithoutPrefix = pAddress.replace("P-", "");
    const addresses = [pAddress, addressWithoutPrefix, xAddress];
    const result = addOrModifyXPAddressesAlias(addresses, "P");
    expect(result).toHaveLength(3);
    expect(result?.[0]).toBe(pAddress);
    expect(result?.[1]).toBe(pAddress);
    expect(result?.[2]).toMatch(/^P-/);
  });
});
