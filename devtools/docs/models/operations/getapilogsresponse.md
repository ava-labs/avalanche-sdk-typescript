# GetApiLogsResponse

## Example Usage

```typescript
import { GetApiLogsResponse } from "@avalanche-sdk/devtools/models/operations";

let value: GetApiLogsResponse = {
  result: {
    orgId: "<id>",
    logs: [
      {
        orgId: "<id>",
        logId: "<id>",
        eventTimestamp: 1248.41,
        apiKeyId: "<id>",
        apiKeyAlias: "<value>",
        hostRegion: "<value>",
        requestType: "rpc",
        requestPath: "<value>",
        apiCreditsConsumed: 7504.04,
        requestDurationMsecs: 556.93,
        responseCode: 6558.09,
        metadata: {
          ipAddress: "be90:79ad:b69b:e67d:6130:e87f:def3:3afd",
          host: "precious-bell.com",
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