# GetApiLogsResponse

## Example Usage

```typescript
import { GetApiLogsResponse } from "@avalanche-sdk/data/models/operations";

let value: GetApiLogsResponse = {
  result: {
    orgId: "<id>",
    logs: [
      {
        orgId: "<id>",
        logId: "<id>",
        eventTimestamp: 2783.25,
        apiKeyId: "<id>",
        apiKeyAlias: "<value>",
        hostRegion: "<value>",
        requestType: "data",
        requestPath: "<value>",
        apiCreditsConsumed: 6915.08,
        requestDurationMsecs: 1089.03,
        responseCode: 2646.49,
        metadata: {
          ipAddress: "eb8b:3fcd:0feb:72ad:2a0f:dc6e:5cfb:b1a9",
          host: "distorted-hierarchy.info",
          userAgent: "<value>",
        },
      },
    ],
  },
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `result`                                                                 | [components.LogsResponseDTO](../../models/components/logsresponsedto.md) | :heavy_check_mark:                                                       | N/A                                                                      |