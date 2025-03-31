# ListTeleporterMessagesResponse

## Example Usage

```typescript
import { ListTeleporterMessagesResponse } from "@avalanche-sdk/sdk/data/models/operations";

let value: ListTeleporterMessagesResponse = {
  result: {
    messages: [
      {
        messageId: "<id>",
        teleporterContractAddress: "<value>",
        sourceBlockchainId: "<id>",
        destinationBlockchainId: "<id>",
        sourceEvmChainId: "<id>",
        destinationEvmChainId: "<id>",
        messageNonce: "<value>",
        from: "<value>",
        to: "<value>",
        messageExecuted: false,
        receipts: [
          {
            receivedMessageNonce: "<value>",
            relayerRewardAddress: "<value>",
          },
        ],
        receiptDelivered: false,
        rewardDetails: {
          address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
          name: "Wrapped AVAX",
          symbol: "WAVAX",
          decimals: 18,
          logoUri:
            "https://images.ctfassets.net/gcj8jwzm6086/5VHupNKwnDYJvqMENeV7iJ/fdd6326b7a82c8388e4ee9d4be7062d4/avalanche-avax-logo.svg",
          ercType: "ERC-20",
          price: {
            currencyCode: "usd",
            value: 42.42,
          },
          value: "<value>",
        },
        sourceTransaction: {
          txHash: "<value>",
          timestamp: 4862.72,
          gasSpent: "<value>",
        },
        status: "pending",
      },
    ],
  },
};
```

## Fields

| Field                                                                                                  | Type                                                                                                   | Required                                                                                               | Description                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `result`                                                                                               | [components.ListTeleporterMessagesResponse](../../models/components/listteleportermessagesresponse.md) | :heavy_check_mark:                                                                                     | N/A                                                                                                    |