import { Avalanche as AvalancheData, SDKOptions as DataSDKOptions } from "@avalanche-sdk/data";
import { Avalanche as AvalancheMetrics, SDKOptions as MetricsSDKOptions } from "@avalanche-sdk/metrics";
import { Avalanche as AvalancheWebhooks, SDKOptions as WebhooksSDKOptions } from "@avalanche-sdk/webhooks";
import { SDKOptions } from "./lib/config.js";

export class Avalanche {
  private dataInstance: AvalancheData;
  private metricsInstance: AvalancheMetrics;
  private webhooksInstance: AvalancheWebhooks;

  constructor(config: SDKOptions) {
    this.dataInstance = new AvalancheData(config.dataSDKOptions ?? config as unknown as DataSDKOptions);
    this.metricsInstance = new AvalancheMetrics(config.metricsSDKOptions ?? config as unknown as MetricsSDKOptions);
    this.webhooksInstance = new AvalancheWebhooks(config.webhooksSDKOptions ?? config as unknown as WebhooksSDKOptions);
  }

  get data() {
    return this.dataInstance.data;
  }

  get metrics() {
    return this.metricsInstance.metrics;
  }

  get webhooks() {
    return this.webhooksInstance.webhooks;
  }
}
