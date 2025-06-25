<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/data";

const avalanche = new Avalanche();

async function run() {
  const result = await avalanche.data.healthCheck();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->