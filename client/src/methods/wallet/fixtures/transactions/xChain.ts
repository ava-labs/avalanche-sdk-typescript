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
import { privateKeyToAvalancheAccount } from "src/accounts";
import { testContext } from "../testContext";
import { privateKey1ForTest, privateKey2ForTest } from "./common";

export const TEST_BASE_FEE = "0x2BF2";

export const getUTXOStrings = (
  amt = 50,
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  txnId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
): string[] => {
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  if (owners.includes(account2.getXPAddress("X", "fuji"))) {
    owners = [
      account1.getXPAddress("X", "fuji"),
      account2.getXPAddress("X", "fuji"),
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
  amt = 50,
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  utxoId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
) => {
  const bigIntAmount = new BigIntPr(BigInt(amt * 1e9));
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

export const getXChainMockServer = (params: {
  overrideMocker?: Record<
    string,
    (
      reqBody: Record<string, any> | DefaultRequestMultipartBody
    ) => HttpResponse<any>
  >;
  url?: string;
}) => {
  const { overrideMocker, url } = params;
  const urlToUse = url || "https://api.avax-test.network/ext/bc/X";
  return setupServer(
    http.post(urlToUse, async ({ request }) => {
      const reqBody = await request.json();
      if (typeof reqBody === "object") {
        const method = reqBody?.["method"];
        switch (method) {
          case "avm.getUTXOs":
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
    })
  );
};

export const getDefaultGetUTXOsMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody,
  testInputAmount: number = 1
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      numFetched: "1",
      utxos: getUTXOStrings(
        testInputAmount,
        testContext.avaxAssetID,
        reqBody?.["params"]?.["addresses"] || [
          "X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
        ],
        0,
        1
      ),
      endIndex: {
        address:
          reqBody?.["params"]?.["addresses"]?.[0] ||
          "X-fuji19fc97zn3mzmwr827j4d3n45refkksgms4y2yzz",
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
