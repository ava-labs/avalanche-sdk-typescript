# ListTeleporterMessagesResponse

## Example Usage

```typescript
import { ListTeleporterMessagesResponse } from "@avalanche-sdk/chainkit/models/components";

let value: ListTeleporterMessagesResponse = {
  messages: [],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `messages`                                                                                                                             | *components.ListTeleporterMessagesResponseMessage*[]                                                                                   | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |