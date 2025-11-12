import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "clover"],
      exclude: [
        // Test files
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.tsx",
        "**/*.spec.tsx",
        // Fixtures
        "**/fixtures/**",
        // Examples
        "**/examples/**",
        // Build outputs
        "**/dist/**",
        "**/node_modules/**",
        // Config files
        "**/*.config.*",
        "**/rollup.config.*",
        "**/webpack.config.*",
        "**/tsconfig*.json",
        "**/typedoc.json",
        // Scripts
        "**/scripts/**",
        // Type definitions
        "**/*.d.ts",
        // Documentation
        "**/docs/**",
        // Coverage reports
        "**/coverage/**",
        "src/clients/decorators/erc20.ts",
        "src/methods/wallet/erc20/**",
        "src/clients/types/**",
        "src/methods/admin/types/**",
        "src/methods/cChain/types/**",
        "src/methods/health/types/**",
        "src/methods/index/types/**",
        "src/methods/info/types/**",
        "src/methods/pChain/types/**",
        "src/methods/proposervm/types/**",
        "src/methods/xChain/types/**",
        "src/methods/wallet/types/**",
        "src/methods/wallet/cChain/types/**",
        "src/methods/wallet/pChain/types/**",
        "src/methods/wallet/xChain/types/**",
        "src/methods/public/types/**",
        "src/methods/wallet/abis/**",
        "src/clients/decorators/testUtils.ts",
      ],
    },
  },
});
