# LogsResponseDTO

## Example Usage

```typescript
import { LogsResponseDTO } from "@avalanche-sdk/data/models/components";

let value: LogsResponseDTO = {
  orgId: "<id>",
  logs: [
    {
      orgId: "<id>",
      logId: "<id>",
      eventTimestamp: 853.11,
      apiKeyId: "<id>",
      apiKeyAlias: "<value>",
      hostRegion: "<value>",
      requestType: "data",
      requestPath: "<value>",
      apiCreditsConsumed: 1000.14,
      requestDurationMsecs: 2650.39,
      responseCode: 661.49,
      metadata: {
        ipAddress: "219.41.143.198",
        host: "lasting-citizen.biz",
        userAgent: "<value>",
      },
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `orgId`                                                                                                                                | *string*                                                                                                                               | :heavy_check_mark:                                                                                                                     | The organization id of the request.                                                                                                    |
| `logs`                                                                                                                                 | [components.LogsFormat](../../models/components/logsformat.md)[]                                                                       | :heavy_check_mark:                                                                                                                     | An array of logs representing the requests made by clients.                                                                            |