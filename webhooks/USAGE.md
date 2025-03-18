<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.createWebhook({
    eventType: "validator_activity",
    url: "https://expensive-designation.info",
    chainId: "<id>",
    metadata: {
      keyType: "addresses",
      keys: [
        "<value>",
      ],
      eventSignatures: [
        "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
      ],
    },
  });

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->