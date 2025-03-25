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
        eventTimestamp: 8002.56,
        apiKeyId: "<id>",
        apiKeyAlias: "<value>",
        hostRegion: "<value>",
        requestType: "rpc",
        requestPath: "<value>",
        apiCreditsConsumed: 3165.5,
        requestDurationMsecs: 8268.06,
        responseCode: 1039.9,
        metadata: {
          ipAddress: "a39d:20c9:be68:acff:85e2:fee9:48fe:edbe",
          host: "flawed-futon.info",
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