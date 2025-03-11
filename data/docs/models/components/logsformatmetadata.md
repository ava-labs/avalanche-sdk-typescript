# LogsFormatMetadata

## Example Usage

```typescript
import { LogsFormatMetadata } from "@avalanche-sdk/data/models/components";

let value: LogsFormatMetadata = {
  ipAddress: "231f:03d1:dffb:6ceb:5d80:57ca:97de:f8fb",
  host: "regal-developing.biz",
  userAgent: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `ipAddress`                                         | *string*                                            | :heavy_check_mark:                                  | The IP address of the client that made the request. |
| `host`                                              | *string*                                            | :heavy_check_mark:                                  | The host for the request made by the client.        |
| `userAgent`                                         | *string*                                            | :heavy_check_mark:                                  | The user agent of the client that made the request. |