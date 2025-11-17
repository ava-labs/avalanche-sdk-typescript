import {
  Address,
  avaxSerial,
  BigIntPr,
  Id,
  Int,
  OutputOwners,
  TransferOutput,
  utils,
  Utxo,
} from "@avalabs/avalanchejs";
import { DefaultRequestMultipartBody, http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { privateKeyToAvalancheAccount } from "../../../../accounts/privateKeyToAvalancheAccount.js";
import { testContext } from "../testContext.js";
import { privateKey1ForTest, privateKey2ForTest } from "./common.js";

export const TEST_BASE_FEE = "0x2BF2";

export const getUTXOStrings = (
  amt: bigint = BigInt(50 * 1e9),
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  txnId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
): string[] => {
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  if (owners.includes(account2.getXPAddress("C", "fuji"))) {
    owners = [
      account1.getXPAddress("C", "fuji"),
      account2.getXPAddress("C", "fuji"),
    ];
    threshold = 2;
    txnId = "DkMZoMW72jshkydBtcnngSxZtiWTBbcQowy3RoVvbcBjGSVh6";
  }
  const manager = utils.getManagerForVM("EVM");

  const utxo = getValidUTXO(amt, assetId, owners, locktime, threshold, txnId);
  const utxoHex = utils.bufferToHex(utxo.toBytes(manager.getDefaultCodec()));
  return [`0x000${utils.strip0x(utxoHex)}`];
};

export const getValidUTXO = (
  amt: bigint = BigInt(50 * 1e9),
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  utxoId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
) => {
  const bigIntAmount = new BigIntPr(amt);
  const ownerAddresses = owners.map((owner) => Address.fromString(owner));

  return new Utxo(
    new avaxSerial.UTXOID(Id.fromString(utxoId), new Int(0)),
    Id.fromString(assetId),
    new TransferOutput(
      bigIntAmount,
      new OutputOwners(
        new BigIntPr(BigInt(locktime)),
        new Int(threshold),
        ownerAddresses
      )
    )
  );
};

export const getCChainMockServer = (params: {
  overrideMocker?: Record<
    string,
    (
      reqBody: Record<string, any> | DefaultRequestMultipartBody
    ) => HttpResponse<any>
  >;
  avaxUrl?: string;
  evmUrl?: string;
}) => {
  const { overrideMocker, avaxUrl, evmUrl } = params;
  const avaxUrlToUse = avaxUrl || "https://api.avax-test.network/ext/bc/C/avax";
  const evmUrlToUse = evmUrl || "https://api.avax-test.network/ext/bc/C/rpc";
  return setupServer(
    http.post(avaxUrlToUse, async ({ request }) => {
      const reqBody = await request.json();
      if (typeof reqBody === "object") {
        const method = reqBody?.["method"];
        switch (method) {
          case "avax.getUTXOs":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetUTXOsMockResponse(reqBody as Record<string, any>);
          default:
            return HttpResponse.json(
              {
                message: "Mocked status",
              },
              { status: 500 }
            );
        }
      }

      return HttpResponse.json(
        {
          message: "Failed to parse request body",
        },
        {
          status: 500,
          statusText: "Mocked status",
        }
      );
    }),
    http.post(evmUrlToUse, async ({ request }) => {
      const reqBody = await request.json();
      if (typeof reqBody === "object") {
        const method = reqBody?.["method"];
        switch (method) {
          case "eth_getTransactionCount":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetTransactionCountMockResponse(
                  reqBody as Record<string, any>
                );
          case "eth_baseFee":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetBaseFeeMockResponse(
                  reqBody as Record<string, any>
                );
          default:
            return HttpResponse.json(
              {
                message: "Mocked status",
              },
              { status: 500 }
            );
        }
      }
      return HttpResponse.json(
        {
          message: "Failed to parse request body",
        },
        {
          status: 500,
          statusText: "Mocked status",
        }
      );
    })
  );
};

export const getDefaultGetUTXOsMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody,
  testInputAmount: bigint = BigInt(1 * 1e9)
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      numFetched: "1",
      utxos: getUTXOStrings(
        testInputAmount,
        testContext.avaxAssetID,
        reqBody?.["params"]?.["addresses"] || [
          "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        ],
        0,
        1
      ),
      endIndex: {
        address:
          reqBody?.["params"]?.["addresses"]?.[0] ||
          "P-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        utxo: "2iz1aRvPX2XPW7XLs6Nay9ECqtsWHVt1iEUnMKHskrsguZ14hi",
      },
      encoding: "hex",
    },
    id: reqBody?.["id"] || 1,
  });
};

export const getDefaultGetTransactionCountMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: "0x1",
    id: reqBody?.["id"] || 1,
  });
};

export const getDefaultGetBaseFeeMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: "0x01",
    id: reqBody?.["id"] || 1,
  });
};

export const cChainTxHash =
  "0x000000000000000000010427d4b22a2a78bcddd456742caf91b56badbff985ee19aef14573e7343fd652000000000000000000000000000000000000000000000000000000000000000000000001e97b58a1a5d7272c61648df04869b3c0dde02220afc45812719304802c532af00000000121e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff000000050000000c6be1b9ca000000010000000000000001f3bea6ee245b402d60fdb419eaabd63fc17c02d20000000c6be086b821e67317cbc4be2aeb00677ad6462778a8f52274b9d605df2591b23027a87dff0000000100000009000000014df44484fe7e5d0188f317c4410d84c9abf362ae8a9b3f5226c89f4512713747583019d801cdf398c1a39ff8f7a53f5a695bb3199fed832d2cf2ec3d562f93cc007dc04825";
