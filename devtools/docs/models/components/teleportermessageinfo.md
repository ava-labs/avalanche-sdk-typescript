# TeleporterMessageInfo

## Example Usage

```typescript
import { TeleporterMessageInfo } from "@avalanche-sdk/devtools/models/components";

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
| `sourceChainId`                                                                            | [components.SourceChainId](../../models/components/sourcechainid.md)                       | :heavy_minus_sign:                                                                         | chain id of the source chain. valid only for destination transactions                      |
| `destinationChainId`                                                                       | [components.DestinationChainId](../../models/components/destinationchainid.md)             | :heavy_minus_sign:                                                                         | chain id of the destination chain. valid only for source transactions                      |