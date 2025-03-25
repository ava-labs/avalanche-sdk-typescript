# LogsFormatMetadata

## Example Usage

```typescript
import { LogsFormatMetadata } from "@avalanche-sdk/data/models/components";

let value: LogsFormatMetadata = {
  ipAddress: "2361:92c5:d2fe:855a:0e88:bfe7:da7d:6d24",
  host: "dental-gymnast.net",
  userAgent: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `ipAddress`                                         | *string*                                            | :heavy_check_mark:                                  | The IP address of the client that made the request. |
| `host`                                              | *string*                                            | :heavy_check_mark:                                  | The host for the request made by the client.        |
| `userAgent`                                         | *string*                                            | :heavy_check_mark:                                  | The user agent of the client that made the request. |