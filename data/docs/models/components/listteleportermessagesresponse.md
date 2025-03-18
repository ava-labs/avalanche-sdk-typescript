# ListTeleporterMessagesResponse

## Example Usage

```typescript
import { ListTeleporterMessagesResponse } from "@avalanche-sdk/data/models/components";

let value: ListTeleporterMessagesResponse = {
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
        timestamp: 2712.52,
        gasSpent: "<value>",
      },
      status: "pending",
    },
  ],
};
```

## Fields

| Field                                                                                                                                  | Type                                                                                                                                   | Required                                                                                                                               | Description                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `nextPageToken`                                                                                                                        | *string*                                                                                                                               | :heavy_minus_sign:                                                                                                                     | A token, which can be sent as `pageToken` to retrieve the next page. If this field is omitted or empty, there are no subsequent pages. |
| `messages`                                                                                                                             | *components.ListTeleporterMessagesResponseMessage*[]                                                                                   | :heavy_check_mark:                                                                                                                     | N/A                                                                                                                                    |