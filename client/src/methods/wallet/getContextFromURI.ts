import { Context as ContextType, Id } from "@avalabs/avalanchejs";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { getBlockchainID } from "../info/getBlockchainID.js";
import { getNetworkID } from "../info/getNetworkID.js";
import { getFeeConfig } from "../pChain/getFeeConfig.js";
import { getAssetDescription } from "../xChain/getAssetDescription.js";
import { getTxFee } from "../xChain/getTxFee.js";

export const PrimaryNetworkID = new Id(new Uint8Array(32));
export const PlatformChainID = new Id(new Uint8Array(32));

export const MainnetName = "mainnet";
export const CascadeName = "cascade";
export const DenaliName = "denali";
export const EverestName = "everest";
export const FujiName = "fuji";
export const TestnetName = "testnet";
export const UnitTestName = "testing";
export const LocalName = "local";

export const MainnetID = 1;
export const CascadeID = 2;
export const DenaliID = 3;
export const EverestID = 4;
export const FujiID = 5;

export const TestnetID = FujiID;
export const UnitTestID = 10;
export const LocalID = 12345;

export const MainnetHRP = "avax";
export const CascadeHRP = "cascade";
export const DenaliHRP = "denali";
export const EverestHRP = "everest";
export const FujiHRP = "fuji";
export const UnitTestHRP = "testing";
export const LocalHRP = "local";
export const FallbackHRP = "custom";

export const NetworkIDToHRP = {
  [MainnetID]: MainnetHRP,
  [CascadeID]: CascadeHRP,
  [DenaliID]: DenaliHRP,
  [EverestID]: EverestHRP,
  [FujiID]: FujiHRP,
  [UnitTestID]: UnitTestHRP,
  [LocalID]: LocalHRP,
};

/**
 * Returns the human readable part for a bech32 string given the network ID.
 * @param networkID
 */
export const getHRP = (networkID: number): string => {
  return (
    NetworkIDToHRP[networkID as keyof typeof NetworkIDToHRP] ?? FallbackHRP
  );
};

export const getContextFromURI = async (
  client: AvalancheWalletCoreClient,
  assetDescription = "AVAX"
): Promise<ContextType.Context> => {
  const { assetID: avaxAssetID } = await getAssetDescription(
    client.xChainClient,
    {
      assetID: assetDescription,
    }
  );
  const { txFee, createAssetTxFee } = await getTxFee(client.xChainClient);

  const { blockchainID: xBlockchainID } = await getBlockchainID(
    client.infoClient,
    {
      alias: "X",
    }
  );
  const { blockchainID: pBlockchainID } = await getBlockchainID(
    client.infoClient,
    {
      alias: "P",
    }
  );
  const { blockchainID: cBlockchainID } = await getBlockchainID(
    client.infoClient,
    {
      alias: "C",
    }
  );

  const { networkID: networkIDstring } = await getNetworkID(client.infoClient);
  const networkID = Number(networkIDstring);

  const platformFeeConfig = await getFeeConfig(client.pChainClient);

  return Object.freeze({
    xBlockchainID,
    pBlockchainID,
    cBlockchainID,
    avaxAssetID,
    baseTxFee: BigInt(txFee),
    createAssetTxFee: BigInt(createAssetTxFee),
    networkID,
    hrp: getHRP(networkID),
    platformFeeConfig,
  });
};
