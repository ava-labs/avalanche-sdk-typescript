# LogsFormatMetadata

## Example Usage

```typescript
import { LogsFormatMetadata } from "@avalanche-sdk/data/models/components";

let value: LogsFormatMetadata = {
  ipAddress: "ebae:16f9:32ba:da98:bda0:fef3:a37e:e67d",
  host: "whole-chiffonier.biz",
  userAgent: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `ipAddress`                                         | *string*                                            | :heavy_check_mark:                                  | The IP address of the client that made the request. |
| `host`                                              | *string*                                            | :heavy_check_mark:                                  | The host for the request made by the client.        |
| `userAgent`                                         | *string*                                            | :heavy_check_mark:                                  | The user agent of the client that made the request. |