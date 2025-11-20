import { beforeEach, describe, expect, expectTypeOf, test, vi } from "vitest";
import { privateKeyToAvalancheAccount } from "../../accounts/index.js";
import { avalanche } from "../../chains/index.js";
import { createAvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getAccountPubKey } from "./getAccountPubKey.js";
import type { GetAccountPubKeyReturnType } from "./types/getAccountPubKey.js";

const privateKey1ForTest =
  "0x67d127b32d4c3dccba8a4493c9d6506e6e1c7e0f08fd45aace29c9973c7fc2ce";

const mockRequest = vi.fn(async ({ method, params }) => {
  if (method === "avalanche_getAccountPubKey") {
    return {
      evm: "0x1234567890123456789012345678901234567890123456789012345678901234",
      xp: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    } as GetAccountPubKeyReturnType;
  }
  throw new Error(`Unexpected method: ${method}`);
});

const account = privateKeyToAvalancheAccount(privateKey1ForTest);

const client = createAvalancheWalletCoreClient({
  chain: avalanche,
  transport: {
    type: "custom",
    provider: {
      request: mockRequest,
    },
  },
  account,
});

describe("getAccountPubKey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls client.request with correct method and empty params", async () => {
    await getAccountPubKey(client);

    expect(mockRequest).toHaveBeenCalledWith({
      method: "avalanche_getAccountPubKey",
      params: {},
    });
  });

  test("returns account public key with evm and xp formats", async () => {
    const result: GetAccountPubKeyReturnType = await getAccountPubKey(client);
    expectTypeOf(result).toEqualTypeOf<GetAccountPubKeyReturnType>();
    expect(result.evm).toBe(
      "0x1234567890123456789012345678901234567890123456789012345678901234"
    );
    expect(result.xp).toBe(
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd"
    );
  });

  test("returns object with evm and xp properties", async () => {
    const result = await getAccountPubKey(client);
    expect(result).toHaveProperty("evm");
    expect(result).toHaveProperty("xp");
    expect(typeof result.evm).toBe("string");
    expect(typeof result.xp).toBe("string");
  });
});
