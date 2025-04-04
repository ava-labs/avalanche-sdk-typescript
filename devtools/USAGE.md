<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/devtools";

const avalanche = new Avalanche({
  serverURL: "https://api.example.com",
  chainId: "43114",
  network: "mainnet",
});

async function run() {
  const result = await avalanche.metrics.healthCheck();

  // Handle the result
  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->