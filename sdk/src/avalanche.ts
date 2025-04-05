import { Avalanche as AvalancheDevtools, SDKOptions as DevtoolsSDKOptions } from "@avalanche-sdk/devtools";

export class Avalanche {
  public devtoolsInstance: AvalancheDevtools;

  constructor(config: DevtoolsSDKOptions) {
    this.devtoolsInstance = new AvalancheDevtools(config as unknown as DevtoolsSDKOptions);
  }

  public get data() {
    return this.devtoolsInstance.data;
  }

  public get webhooks() {
    return this.devtoolsInstance.webhooks;
  }

  public get metrics() {
    return this.devtoolsInstance.metrics;
  }
}
