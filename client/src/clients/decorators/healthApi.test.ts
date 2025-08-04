import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { healthAPIActions } from "./healthApi.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "health.health":
          return {
            healthy: true,
            checks: {
              C: {
                message: {
                  engine: {
                    consensus: {
                      lastAcceptedHeight: 12345,
                      lastAcceptedID:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      longestProcessingBlock:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      processingBlocks: 5,
                    },
                    vm: null,
                  },
                  networking: {
                    percentConnected: 95.5,
                  },
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 100,
              },
              P: {
                message: {
                  engine: {
                    consensus: {
                      lastAcceptedHeight: 12345,
                      lastAcceptedID:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      longestProcessingBlock:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      processingBlocks: 3,
                    },
                    vm: null,
                  },
                  networking: {
                    percentConnected: 98.2,
                  },
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 80,
              },
              X: {
                message: {
                  engine: {
                    consensus: {
                      lastAcceptedHeight: 12345,
                      lastAcceptedID:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      longestProcessingBlock:
                        "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                      processingBlocks: 2,
                    },
                    vm: null,
                  },
                  networking: {
                    percentConnected: 97.8,
                  },
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 75,
              },
              bootstrapped: {
                message: [],
                timestamp: "2024-01-01T00:00:00Z",
                duration: 50,
              },
              database: {
                timestamp: "2024-01-01T00:00:00Z",
                duration: 25,
              },
              diskspace: {
                message: {
                  availableDiskBytes: 107374182400,
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 15,
              },
              network: {
                message: {
                  connectedPeers: 50,
                  sendFailRate: 0.01,
                  timeSinceLastMsgReceived: "1s",
                  timeSinceLastMsgSent: "2s",
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 30,
              },
              router: {
                message: {
                  longestRunningRequest: "5s",
                  outstandingRequests: 10,
                },
                timestamp: "2024-01-01T00:00:00Z",
                duration: 20,
              },
            },
          };
        case "health.liveness":
          return {
            healthy: true,
          };
        case "health.readiness":
          return {
            healthy: true,
            checks: {
              bootstrapped: {
                message: [],
                timestamp: "2024-01-01T00:00:00Z",
                duration: 50,
              },
            },
          };
        // TODO: add proper responses for the rest of the methods
        // The default case is just a placeholder to satisfy the test
        default:
          return {
            result: {
              someKey: 1,
            },
          };
      }
    }) as unknown as EIP1193RequestFn,
    type: "mock",
  });

const client = createAvalancheBaseClient({
  chain: avalanche,
  transport: mockTransport,
});

const healthClient = healthAPIActions(client);

test("default", async () => {
  expect(healthClient).toMatchInlineSnapshot(`{
  "health": [Function],
  "liveness": [Function],
  "readiness": [Function],
}`);
});

describe("smoke test", () => {
  test("health", async () => {
    const res = await healthClient.health({
      tags: [
        "11111111111111111111111111111111LpoYY",
        "29uVeLPJB1eQJkzRemU8g8wZDw5uJRqpab5U2mX9euieVwiEbL",
      ],
    });
    expect(res).toStrictEqual({
      healthy: true,
      checks: {
        C: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 5,
              },
              vm: null,
            },
            networking: {
              percentConnected: 95.5,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 100,
        },
        P: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 3,
              },
              vm: null,
            },
            networking: {
              percentConnected: 98.2,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 80,
        },
        X: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 2,
              },
              vm: null,
            },
            networking: {
              percentConnected: 97.8,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 75,
        },
        bootstrapped: {
          message: [],
          timestamp: "2024-01-01T00:00:00Z",
          duration: 50,
        },
        database: {
          timestamp: "2024-01-01T00:00:00Z",
          duration: 25,
        },
        diskspace: {
          message: {
            availableDiskBytes: 107374182400,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 15,
        },
        network: {
          message: {
            connectedPeers: 50,
            sendFailRate: 0.01,
            timeSinceLastMsgReceived: "1s",
            timeSinceLastMsgSent: "2s",
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 30,
        },
        router: {
          message: {
            longestRunningRequest: "5s",
            outstandingRequests: 10,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 20,
        },
      },
    });
  });

  test("health without tags", async () => {
    const res = await healthClient.health({});
    expect(res).toStrictEqual({
      healthy: true,
      checks: {
        C: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 5,
              },
              vm: null,
            },
            networking: {
              percentConnected: 95.5,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 100,
        },
        P: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 3,
              },
              vm: null,
            },
            networking: {
              percentConnected: 98.2,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 80,
        },
        X: {
          message: {
            engine: {
              consensus: {
                lastAcceptedHeight: 12345,
                lastAcceptedID:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                longestProcessingBlock:
                  "2QouvMUbQ6oy7yQ9tLvL3L8tGQG2QK1wJ1q1wJ1q1wJ1q1wJ1q1wJ1q1wJ1",
                processingBlocks: 2,
              },
              vm: null,
            },
            networking: {
              percentConnected: 97.8,
            },
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 75,
        },
        bootstrapped: {
          message: [],
          timestamp: "2024-01-01T00:00:00Z",
          duration: 50,
        },
        database: {
          timestamp: "2024-01-01T00:00:00Z",
          duration: 25,
        },
        diskspace: {
          message: {
            availableDiskBytes: 107374182400,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 15,
        },
        network: {
          message: {
            connectedPeers: 50,
            sendFailRate: 0.01,
            timeSinceLastMsgReceived: "1s",
            timeSinceLastMsgSent: "2s",
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 30,
        },
        router: {
          message: {
            longestRunningRequest: "5s",
            outstandingRequests: 10,
          },
          timestamp: "2024-01-01T00:00:00Z",
          duration: 20,
        },
      },
    });
  });

  test("liveness", async () => {
    const res = await healthClient.liveness();
    expect(res).toStrictEqual({
      healthy: true,
    });
  });

  test("readiness", async () => {
    const res = await healthClient.readiness({
      tags: ["11111111111111111111111111111111LpoYY"],
    });
    expect(res).toStrictEqual({
      healthy: true,
      checks: {
        bootstrapped: {
          message: [],
          timestamp: "2024-01-01T00:00:00Z",
          duration: 50,
        },
      },
    });
  });

  test("readiness without tags", async () => {
    const res = await healthClient.readiness({});
    expect(res).toStrictEqual({
      healthy: true,
      checks: {
        bootstrapped: {
          message: [],
          timestamp: "2024-01-01T00:00:00Z",
          duration: 50,
        },
      },
    });
  });
});
