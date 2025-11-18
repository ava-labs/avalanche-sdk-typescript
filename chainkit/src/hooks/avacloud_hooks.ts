import { RequestInput } from "../lib/http.js";
import {
  BeforeCreateRequestContext,
  BeforeCreateRequestHook,
} from "./types.js";

export class AvacloudHooks implements BeforeCreateRequestHook {
  beforeCreateRequest(
    hookCtx: BeforeCreateRequestContext,
    input: RequestInput
  ): RequestInput {
    if (
      hookCtx.options.avacloud !== true &&
      input.url.host !== "data-api.avax.network"
    ) {
      return input;
    }

    try {
      const newBase = "https://glacier-api.avax.network";
      input.url = new URL(
        input.url.pathname + input.url.search + input.url.hash,
        newBase
      );
    } catch (error) {
      console.error(
        "[AvacloudHooks] Failed to rewrite URL:",
        error instanceof Error ? error.message : String(error)
      );
    }

    return input;
  }
}
