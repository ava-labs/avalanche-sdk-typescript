<!-- Start SDK Example Usage [usage] -->
```typescript
import { Avalanche } from "@avalanche-sdk/sdk";

// Initialize Avalanche instance with chain ID and network configuration
const avalanche = new Avalanche({
  chainId: "43114",         
  network: "mainnet",       
});

async function run() {
  // Perform a health check on the data API
  const dataHealthCheckResult = await avalanche.data.healthCheck();

  // Log the data health check result
  console.log("Data Health Check Result:", dataHealthCheckResult);

  // Create a webhook for validator activity events
  const createWebhooksResult = await avalanche.webhooks.create({
    eventType: "validator_activity",       
    url: "https://expensive-designation.info",  
    chainId: "<id>",                       
    metadata: {
      keyType: "addresses",               
      keys: ["<value>"],                  
      eventSignatures: [
        "0x61cbb2a3dee0b6064c2e681aadd61677fb4ef319f0b547508d495626f5a62f64",
      ],
    },
  });

  // Log the result of webhook creation
  console.log("Webhook Creation Result:", createWebhooksResult);

  // Perform a health check on the metrics API
  const metricsHealthCheckResult = await avalanche.metrics.healthCheck();

  // Log the metrics health check result
  console.log("Metrics Health Check Result:", metricsHealthCheckResult);
}

run();
```
<!-- End SDK Example Usage [usage] -->