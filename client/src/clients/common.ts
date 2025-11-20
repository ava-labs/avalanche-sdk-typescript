export const SDK_METADATA = {
  version: "0.1.0-alpha.3",
  name: "@avalanche-sdk/client",
};

export const commonHeaders = {
  "User-Agent": `${SDK_METADATA.name} ${SDK_METADATA.version}`,
  "Content-Type": "application/json",
};
