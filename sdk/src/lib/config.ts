import { SDKOptions as DataSDKOptions, ServerList as DataServerList } from '@avalanche-sdk/data';
import { SDKOptions as MetricsSDKOptions, ServerList as MetricsServerList } from '@avalanche-sdk/metrics';
import { SDKOptions as WebhooksSDKOptions, ServerList as WebhooksServerList } from '@avalanche-sdk/webhooks';

type UnifiedSDKOptions = {
    [K in keyof DataSDKOptions | keyof MetricsSDKOptions | keyof WebhooksSDKOptions]: 
    K extends keyof DataSDKOptions ? DataSDKOptions[K] :
    K extends keyof MetricsSDKOptions ? MetricsSDKOptions[K] :
    K extends keyof WebhooksSDKOptions ? WebhooksSDKOptions[K] :
    never;
} & {
    dataSDKOptions?: DataSDKOptions;
    metricsSDKOptions?: MetricsSDKOptions;
    webhooksSDKOptions?: WebhooksSDKOptions;
};

export type SDKOptions = Partial<UnifiedSDKOptions>;
export { DataServerList, MetricsServerList, WebhooksServerList };
