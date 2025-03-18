# LogsFormatMetadata

## Example Usage

```typescript
import { LogsFormatMetadata } from "@avalanche-sdk/data/models/components";

let value: LogsFormatMetadata = {
  ipAddress: "63.81.219.117",
  host: "jumbo-fishery.org",
  userAgent: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `ipAddress`                                         | *string*                                            | :heavy_check_mark:                                  | The IP address of the client that made the request. |
| `host`                                              | *string*                                            | :heavy_check_mark:                                  | The host for the request made by the client.        |
| `userAgent`                                         | *string*                                            | :heavy_check_mark:                                  | The user agent of the client that made the request. |