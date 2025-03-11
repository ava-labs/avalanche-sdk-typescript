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
        eventTimestamp: 5206.78,
        apiKeyId: "<id>",
        apiKeyAlias: "<value>",
        hostRegion: "<value>",
        requestType: "data",
        requestPath: "<value>",
        apiCreditsConsumed: 7745.01,
        requestDurationMsecs: 1409.57,
        responseCode: 9673.38,
        metadata: {
          ipAddress: "d0fe:b72a:d2a0:fdc6:e5cf:bb1a:9497:395b",
          host: "another-testing.net",
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