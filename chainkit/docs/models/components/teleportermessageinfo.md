# TeleporterMessageInfo

## Example Usage

```typescript
import { TeleporterMessageInfo } from "@avalanche-sdk/chainkit/models/components";

let value: TeleporterMessageInfo = {
  teleporterMessageId: "<id>",
  direction: "DESTINATION_TRANSACTION",
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `teleporterMessageId`                                                                      | *string*                                                                                   | :heavy_check_mark:                                                                         | N/A                                                                                        |
| `direction`                                                                                | [components.TransactionDirectionType](../../models/components/transactiondirectiontype.md) | :heavy_check_mark:                                                                         | N/A                                                                                        |
| `sourceChainId`                                                                            | *string*                                                                                   | :heavy_minus_sign:                                                                         | chain id of the source chain. valid only for destination transactions                      |
| `destinationChainId`                                                                       | *string*                                                                                   | :heavy_minus_sign:                                                                         | chain id of the destination chain. valid only for source transactions                      |