<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche({
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