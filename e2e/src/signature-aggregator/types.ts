/**
 * Signature Aggregator Types
 *
 * Type definitions for the signature aggregator module.  Ported verbatim from
 * avalanche-ai.
 */

export interface PeerConfig {
  id: string; // NodeID-xxx format
  ip: string; // ip:port format
}

export interface APIConfig {
  "base-url": string;
}

export interface SignatureAggregatorConfig {
  "log-level": "debug" | "info" | "warn" | "error";
  "p-chain-api": APIConfig;
  "info-api": APIConfig;
  "api-port": number;
  "metrics-port": number;
  "allow-private-ips"?: boolean;
  "manually-tracked-peers"?: PeerConfig[];
  "tracked-subnet-ids"?: string[];
  "tls-cert-path"?: string;
  "tls-key-path"?: string;
  "max-p-chain-lookback"?: number;
  "signature-cache-size"?: number;
}

export interface SignatureAggregatorHealth {
  status: "up" | "down";
  details?: {
    "signature-aggregator-health"?: {
      status: "up" | "down";
      timestamp: string;
      error?: string;
    };
  };
}

export interface AggregateSignaturesRequest {
  message?: string;
  justification?: string;
  "signing-subnet-id"?: string;
  "quorum-percentage"?: number;
  "quorum-percentage-buffer"?: number;
  "p-chain-height"?: number;
}

export interface AggregateSignaturesResponse {
  "signed-message"?: string;
  error?: string;
}

export interface SignatureAggregatorStatus {
  running: boolean;
  healthy: boolean;
  pid?: number;
  apiUrl?: string;
  metricsUrl?: string;
  connectedStake?: number;
  totalStake?: number;
  error?: string;
}

export const DEFAULT_CONFIG = {
  "log-level": "info" as const,
  "api-port": 8080,
  "metrics-port": 8081,
  "allow-private-ips": true,
  "signature-cache-size": 1024,
};
