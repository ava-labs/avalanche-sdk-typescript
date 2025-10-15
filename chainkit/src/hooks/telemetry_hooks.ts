import { uuid } from "zod/v4";
import { SDK_METADATA } from "../lib/config.js";
import {
  AfterErrorContext,
  AfterErrorHook,
  AfterSuccessContext,
  AfterSuccessHook,
  BeforeRequestContext,
  BeforeRequestHook,
} from "./types.js";

const POSTHOG_PUBLIC_API_KEY =
  "phc_Hg6a406Z76cNN7gtPNKXjkKIpq9uUxd9HOrf6m9d4ks";
const POSTHOG_CAPTURE_URL = "https://us.i.posthog.com/capture/";

interface PostHogEvent {
  api_key: string;
  event: string;
  properties: {
    distinct_id: string;
    [key: string]: any;
  };
  timestamp?: string;
}

export class TelemetryHooks
  implements BeforeRequestHook, AfterSuccessHook, AfterErrorHook
{
  private distinctId: string;
  constructor() {
    this.distinctId = uuid().toString();
  }

  private getUserAgent(): string {
    // Browser environment
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      return navigator.userAgent;
    }

    // Node.js environment
    if (typeof process !== "undefined" && process.version) {
      return `Node.js/${process.version}`;
    }

    // Fallback
    return "Unknown";
  }

  private getPlatform(): string {
    // Browser environment
    if (typeof navigator !== "undefined" && navigator.platform) {
      return navigator.platform;
    }

    // Node.js environment
    if (typeof process !== "undefined" && process.platform) {
      return process.platform;
    }

    // Fallback
    return "Unknown";
  }

  private getEnvironment(): string {
    // Browser environment
    if (typeof window !== "undefined") {
      return "browser";
    }

    // Node.js environment
    if (typeof process !== "undefined" && process.versions?.node) {
      return "node";
    }

    // Other environments
    if (typeof (globalThis as any).Deno !== "undefined") {
      return "deno";
    }

    if (typeof (globalThis as any).Bun !== "undefined") {
      return "bun";
    }

    return "unknown";
  }

  private captureEvent(event: string, properties: Record<string, any> = {}) {
    try {
      const payload: PostHogEvent = {
        api_key: POSTHOG_PUBLIC_API_KEY,
        event,
        properties: {
          distinct_id: this.distinctId,
          user_agent: this.getUserAgent(),
          platform: this.getPlatform(),
          environment: this.getEnvironment(),
          sdk_version: SDK_METADATA.sdkVersion,
          ...properties,
        },
        timestamp: new Date().toISOString(),
      };

      // Use fire-and-forget to avoid blocking SDK operations
      fetch(POSTHOG_CAPTURE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail telemetry to avoid breaking the main functionality
    }
  }

  async beforeRequest(
    hookCtx: BeforeRequestContext,
    request: Request
  ): Promise<Request> {
    if (hookCtx.options.enableTelemetry === false) {
      return request;
    }

    await this.captureEvent("ChainKit SDK Request Started", {
      operation: hookCtx.operationID,
      server_url: hookCtx.options.serverURL ?? hookCtx.baseURL,
      retry_config: hookCtx.retryConfig,
    });
    return request;
  }

  async afterSuccess(
    hookCtx: AfterSuccessContext,
    response: Response
  ): Promise<Response> {
    if (hookCtx.options.enableTelemetry === false) {
      return response;
    }
    await this.captureEvent("ChainKit SDK Request Completed", {
      operation: hookCtx.operationID,
      base_url: hookCtx.baseURL,
      retry_config: hookCtx.retryConfig,
      response_status: response.status,
      response_status_text: response.statusText,
    });
    return response;
  }

  async afterError(
    hookCtx: AfterErrorContext,
    response: Response | null,
    error: unknown
  ): Promise<{ response: Response | null; error: unknown }> {
    if (hookCtx.options.enableTelemetry === false) {
      return { response, error };
    }

    await this.captureEvent("ChainKit SDK Request Failed", {
      operation: hookCtx.operationID,
      base_url: hookCtx.baseURL,
      retry_config: hookCtx.retryConfig,
      response_status: response?.status,
      response_status_text: response?.statusText,
      error_type:
        error instanceof Error ? error.constructor.name : typeof error,
      error_message: error instanceof Error ? error.message : String(error),
    });
    return { response, error };
  }
}
