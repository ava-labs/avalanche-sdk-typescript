import { RequestErrorType } from "viem/utils";

/**
 * The parameters for the `avm.buildGenesis` method.
 *
 * @property genesisData - The genesis data.
 * @property networkID - The network ID.
 * @property encoding - The encoding of the genesis data. Only "hex" is supported.
 */
export type BuildGenesisParameters = {
  /**
   * The genesis data.
   */
  genesisData: {
    /**
     * The name of the asset.
     */
    name: string;
    /**
     * The symbol of the asset.
     */
    symbol: string;
    /**
     * The denomination of the asset.
     */
    denomination: number;
    /**
     * The initial state of the asset.
     */
    initialState: {
      /**
       * The fixed cap of the asset.
       */
      fixedCap: {
        /**
         * The amount of the asset.
         */
        amount: number;
        /**
         * The addresses that can mint the asset.
         */
        addresses: string[];
      };
    };
  };

  networkID: number;

  encoding: "hex";
};

/**
 * The return type for the `avm.buildGenesis` method.
 *
 * @property bytes - The genesis data in bytes.
 * @property encoding - The encoding of the genesis data. Only "hex" is supported.
 */
export type BuildGenesisReturnType = {
  bytes: string;
  encoding: "hex";
};

export type BuildGenesisErrorType = RequestErrorType;

export type BuildGenesisMethod = {
  Method: "avm.buildGenesis";
  Parameters: BuildGenesisParameters;
  ReturnType: BuildGenesisReturnType;
};
