import { Avalanche as AvalancheData, SDKOptions as DataSDKOptions } from "@avalanche-sdk/data";
import { Avalanche as AvalancheMetrics, SDKOptions as MetricsSDKOptions } from "@avalanche-sdk/metrics";
import { Avalanche as AvalancheWebhooks, SDKOptions as WebhooksSDKOptions } from "@avalanche-sdk/webhooks";
import { SDKOptions } from "./lib/config.js";

export class Avalanche {
  private dataInstance: AvalancheData;
  private metricsInstance: AvalancheMetrics;
  private webhooksInstance: AvalancheWebhooks;

  constructor(config: SDKOptions) {
    const { dataSDKOptions, metricsSDKOptions, webhooksSDKOptions, ...rest } = config;
    this.dataInstance = new AvalancheData({ ...rest as unknown as DataSDKOptions, ...dataSDKOptions });
    this.metricsInstance = new AvalancheMetrics({ ...rest as unknown as MetricsSDKOptions, ...metricsSDKOptions });
    this.webhooksInstance = new AvalancheWebhooks({ ...rest as unknown as WebhooksSDKOptions, ...webhooksSDKOptions });
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
