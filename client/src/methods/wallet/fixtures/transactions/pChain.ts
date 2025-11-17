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
import { privateKeyToAvalancheAccount } from "../../../../accounts";
import { testContext } from "../testContext";
import {
  account1,
  feeState,
  privateKey1ForTest,
  privateKey2ForTest,
} from "./common";

export const getUTXOStrings = (
  amt = BigInt(50 * 1e9),
  assetId: string,
  owners: string[],
  locktime = 0,
  threshold = 1,
  txnId = "2R5bJqAd6evMJAuV4TYGqfaHkdCEQfYUx4GoHpJZxsFeor6wMi"
): string[] => {
  const account2 = privateKeyToAvalancheAccount(privateKey2ForTest);
  const account1 = privateKeyToAvalancheAccount(privateKey1ForTest);
  if (owners.includes(account2.getXPAddress("P", "fuji"))) {
    owners = [
      account1.getXPAddress("P", "fuji"),
      account2.getXPAddress("P", "fuji"),
    ];
    threshold = 2;
    txnId = "DkMZoMW72jshkydBtcnngSxZtiWTBbcQowy3RoVvbcBjGSVh6";
  }
  const manager = utils.getManagerForVM("PVM");

  const utxo = getValidUTXO(amt, assetId, owners, locktime, threshold, txnId);
  const utxoHex = utils.bufferToHex(utxo.toBytes(manager.getDefaultCodec()));
  return [`0x000${utils.strip0x(utxoHex)}`];
};

export const getValidUTXO = (
  amt = BigInt(50 * 1e9),
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

export const getPChainMockServer = (params: {
  overrideMocker?: Record<
    string,
    (
      reqBody: Record<string, any> | DefaultRequestMultipartBody
    ) => HttpResponse<any>
  >;
  url?: string;
}) => {
  const { overrideMocker, url } = params;
  const urlToUse = url || "https://api.avax-test.network/ext/bc/P";
  return setupServer(
    http.post(urlToUse, async ({ request }) => {
      const reqBody = await request.json();
      if (typeof reqBody === "object") {
        const method = reqBody?.["method"];
        switch (method) {
          case "platform.getUTXOs":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetUTXOsMockResponse(reqBody as Record<string, any>);
          case "platform.getFeeState":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetFeeStateMockResponse(
                  reqBody as Record<string, any>
                );
          case "platform.getTx":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetTxMockResponse(reqBody as Record<string, any>);
          case "platform.getL1Validator":
            return overrideMocker?.[method]
              ? overrideMocker?.[method](reqBody as Record<string, any>)
              : getDefaultGetL1ValidatorMockResponse(
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

export const getDefaultGetFeeStateMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  const feeStateData = feeState();
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      capacity: feeStateData.capacity.toString(),
      excess: feeStateData.excess.toString(),
      price: feeStateData.price.toString(),
      timestamp: feeStateData.timestamp,
    },
    id: reqBody?.["id"] || 1,
  });
};

export const getDefaultGetTxMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  if (
    reqBody?.["params"]?.["txID"] ===
    "2CDLCyFr7x4LcxaJ82rE38gnSk4gcVTeFdJeFbwZRd5fgM1gDH"
  ) {
    return HttpResponse.json({
      jsonrpc: "2.0",
      result: {
        tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000700000000001e1d26000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d68237000000001e24544f6fd3abaa362b4c635d5c5dec16ac57a853477a1be41ae8e464d82005d000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000001e31390000000100000000000000000000000b000000000000007b00000001000000012a705f0a71d8b6e19d5e955b19d683ca6d6823700000000100000009000000012df65b239996df9eaaeb235223a9e571832270e718a4be27317656965917d2080450e9aaf2141073bb1c4dab959fec0e8bb9dcb5dbf9f372160d0cb8c000f01401509d618f",
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    });
  } else if (
    reqBody?.["params"]?.["txID"] ===
    "SLomSuJLyG9qk7KLcWevdcZ1i7kN2qTLNUytJLhkwPdxAAgoa"
  ) {
    return HttpResponse.json({
      jsonrpc: "2.0",
      result: {
        tx: "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa00000007000000000000ef54000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d682370000000012677461b127dc02dfc789c599fd38917089842c4f043a98786b1db07fea6e09e000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000000103670000000100000000000000000000000b000000000000007b00000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c000000010000000900000001115afe7403829dd5dde8d6d15702543feeb9bb689c2e611515677cfa3d7bc51038d0c99d77ee06af450318f0e343cb414c3419758f0e12cafb24abb4f16c53c10081b39a2b",
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    });
  }
  return HttpResponse.json(
    {
      jsonrpc: "2.0",
      result: {
        tx: "0x00", // empty tx
        encoding: "hex",
      },
      id: reqBody?.["id"] || 1,
    },
    {
      status: 500,
      statusText: "Mocked status",
    }
  );
};

export const getDefaultGetL1ValidatorMockResponse = (
  reqBody: Record<string, any> | DefaultRequestMultipartBody
) => {
  return HttpResponse.json({
    jsonrpc: "2.0",
    result: {
      subnetID: "11111111111111111111111111111111LpoYY",
      nodeID: "NodeID-LbijL9cqXkmq2Q8oQYYGs8LmcSRhnrDWJ",
      publicKey:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      remainingBalanceOwner: {
        addresses: [account1.getXPAddress("P", "fuji")],
        locktime: "0",
        threshold: "1",
      },
      deactivationOwner: {
        addresses: [account1.getXPAddress("P", "fuji")],
        locktime: "0",
        threshold: "1",
      },
      startTime: "1716883200",
      weight: "100000",
    },
    id: reqBody?.["id"] || 1,
  });
};

export const pChainTxHash =
  "0x000000000010000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000700000000001e1d26000000000000000000000001000000012a705f0a71d8b6e19d5e955b19d683ca6d68237000000001e24544f6fd3abaa362b4c635d5c5dec16ac57a853477a1be41ae8e464d82005d000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000001e31390000000100000000000000000000000b000000000000007b00000001000000012a705f0a71d8b6e19d5e955b19d683ca6d6823700000000100000009000000012df65b239996df9eaaeb235223a9e571832270e718a4be27317656965917d2080450e9aaf2141073bb1c4dab959fec0e8bb9dcb5dbf9f372160d0cb8c000f01401509d618f";

export const pChainTxJsonStrExample =
  '{"vm":"PVM","baseTx":{"NetworkId":5,"BlockchainId":"11111111111111111111111111111111LpoYY","outputs":[{"assetId":"U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK","output":{"amt":"1973542","outputOwners":{"locktime":"0","threshold":1,"addrs":["019fc97zn3mzmwr827j4d3n45refkksgms7wesnu"],"_type":"secp256k1fx.OutputOwners"},"_type":"secp256k1fx.TransferOutput"},"_type":"avax.TransferableOutput"}],"inputs":[{"utxoID":{"txID":"2ien9SLQiDw3Ym767oA83D77D2nNQm2V5E973SkvUhnHkSRTrv","outputIdx":0,"_type":"avax.UTXOID"},"assetId":"U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK","input":{"amt":"1978681","input":{"sigIndices":[0],"_type":"secp256k1fx.Input"},"_type":"secp256k1fx.TransferInput"},"_type":"avax.TransferableInput"}],"memo":"0x","_type":"avax.BaseTx"},"subnetOwners":{"locktime":"123","threshold":1,"addrs":["019fc97zn3mzmwr827j4d3n45refkksgms7wesnu"],"_type":"secp256k1fx.OutputOwners"},"_type":"pvm.CreateSubnetTx"}';
export const pChainTxCredentialsJsonStrExample =
  '[["2df65b239996df9eaaeb235223a9e571832270e718a4be27317656965917d2080450e9aaf2141073bb1c4dab959fec0e8bb9dcb5dbf9f372160d0cb8c000f01401"]]';
