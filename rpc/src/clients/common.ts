export const SDK_METADATA = {
  version: "0.0.4-alpha.0",
  name: "@avalanche-sdk/rpc",
};

export const commonHeaders = {
  "User-Agent": `${SDK_METADATA.name} ${SDK_METADATA.version}`,
  "Content-Type": "application/json",
};
