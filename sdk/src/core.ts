import { AvalancheCore as WebhooksCore } from "@avalanche-sdk/webhooks/core.js";
import { AvalancheCore as DataCore } from "@avalanche-sdk/data/core.js";
import { AvalancheCore as MetricsCore } from "@avalanche-sdk/metrics/core.js";
import { SDKOptions as DataSDKOptions } from "@avalanche-sdk/data";
import { SDKOptions as MetricsSDKOptions } from "@avalanche-sdk/metrics";
import { SDKOptions as WebhooksSDKOptions } from "@avalanche-sdk/webhooks";
import { SDKOptions } from "./lib/config.js";

export class AvalancheCore {
    public webhooks: WebhooksCore;
    public data: DataCore;
    public metrics: MetricsCore;
  
    constructor(options: SDKOptions) {
      const { dataSDKOptions, metricsSDKOptions, webhooksSDKOptions, ...rest } = options;

      this.webhooks = new WebhooksCore({ ...rest as unknown as WebhooksSDKOptions, ...webhooksSDKOptions });
      this.data = new DataCore({ ...rest as unknown as DataSDKOptions, ...dataSDKOptions });
      this.metrics = new MetricsCore({ ...rest as unknown as MetricsSDKOptions, ...metricsSDKOptions });
    }
}