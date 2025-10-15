import { PostHogEvent } from "./types/posthogEvent";

export class Telemetry {
  private readonly distinctId: string;
  private readonly POSTHOG_PUBLIC_API_KEY =
    "phc_Hg6a406Z76cNN7gtPNKXjkKIpq9uUxd9HOrf6m9d4ks";
  private readonly POSTHOG_CAPTURE_URL = "https://us.i.posthog.com/capture/";
  private readonly enableTelemetry: boolean;

  constructor(enableTelemetry: boolean = true, distinctId?: string) {
    this.distinctId = distinctId ?? crypto.randomUUID();
    this.enableTelemetry = enableTelemetry;
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

  public captureEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.enableTelemetry) {
      return;
    }
    try {
      const payload: PostHogEvent = {
        api_key: this.POSTHOG_PUBLIC_API_KEY,
        event,
        properties: {
          distinct_id: this.distinctId,
          environment: this.getEnvironment(),
          userAgent: this.getUserAgent(),
          platform: this.getPlatform(),
          ...properties,
        },
        timestamp: new Date().toISOString(),
      };

      // Use fire-and-forget to avoid blocking SDK operations
      fetch(this.POSTHOG_CAPTURE_URL, {
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
}
