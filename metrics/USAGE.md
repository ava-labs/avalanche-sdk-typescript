<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/metrics";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.metrics.healthCheck();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->