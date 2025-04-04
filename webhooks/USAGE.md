<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/webhooks";

const avalanche = new Avalanche({
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.webhooks.create({
    eventType: "address_activity",
    url: "https://inferior-chainstay.com",
    chainId: "<id>",
    metadata: {
      addresses: [
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
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