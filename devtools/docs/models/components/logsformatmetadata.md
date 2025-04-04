# LogsFormatMetadata

## Example Usage

```typescript
import { LogsFormatMetadata } from "@avalanche-sdk/devtools/models/components";

let value: LogsFormatMetadata = {
  ipAddress: "6096:abfc:d0e7:8753:846d:4ace:cf2a:e4bb",
  host: "authentic-statue.org",
  userAgent: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `ipAddress`                                         | *string*                                            | :heavy_check_mark:                                  | The IP address of the client that made the request. |
| `host`                                              | *string*                                            | :heavy_check_mark:                                  | The host for the request made by the client.        |
| `userAgent`                                         | *string*                                            | :heavy_check_mark:                                  | The user agent of the client that made the request. |