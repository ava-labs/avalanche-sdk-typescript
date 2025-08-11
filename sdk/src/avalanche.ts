import {
  Avalanche as Avalanchechainkit,
  SDKOptions as chainkitSDKOptions,
} from "@avalanche-sdk/chainkit";

export class Avalanche {
  public chainkitInstance: Avalanchechainkit;

  constructor(config: chainkitSDKOptions) {
    this.chainkitInstance = new Avalanchechainkit(
      config as unknown as chainkitSDKOptions
    );
  }

  public get data() {
    return this.chainkitInstance.data;
  }

  public get webhooks() {
    return this.chainkitInstance.webhooks;
  }

  public get metrics() {
    return this.chainkitInstance.metrics;
  }
}
