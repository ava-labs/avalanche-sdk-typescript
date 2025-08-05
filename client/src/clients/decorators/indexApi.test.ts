import { createTransport, EIP1193RequestFn } from "viem";
import { describe, expect, test, vi } from "vitest";
import { avalanche } from "../../chains/index.js";
import { createAvalancheBaseClient } from "../createAvalancheBaseClient.js";
import { indexAPIActions } from "./indexApi.js";

const mockTransport = () =>
  createTransport({
    key: "mock",
    name: "Mock Transport",
    request: vi.fn(async ({ method }) => {
      switch (method) {
        case "index.getContainerByID":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "12345",
          };
        case "index.getContainerByIndex":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "12345",
          };
        case "index.getContainerRange":
          return {
            containers: [
              {
                id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
                bytes:
                  "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
                timestamp: "2024-01-01T00:00:00Z",
                encoding: "hex",
                index: "12345",
              },
              {
                id: "7gYg6ioD9MYwxnN9njQfQBqL6dvcW7z2eXhqKDdOoAzHC2FaZ",
                bytes:
                  "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186b0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
                timestamp: "2024-01-01T00:00:01Z",
                encoding: "hex",
                index: "12346",
              },
            ],
            encoding: "hex",
          };
        case "index.getIndex":
          return {
            index: "12345",
            encoding: "hex",
          };
        case "index.getLastAccepted":
          return {
            id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
            bytes:
              "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
            timestamp: "2024-01-01T00:00:00Z",
            encoding: "hex",
            index: "12345",
          };
        case "index.isAccepted":
          return {
            accepted: true,
            encoding: "hex",
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

const indexClient = indexAPIActions(client);

test("default", async () => {
  expect(indexClient).toMatchInlineSnapshot(`{
  "getContainerByID": [Function],
  "getContainerByIndex": [Function],
  "getContainerRange": [Function],
  "getIndex": [Function],
  "getLastAccepted": [Function],
  "isAccepted": [Function],
}`);
});

describe("smoke test", () => {
  test("getContainerByID", async () => {
    const res = await indexClient.getContainerByID({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes:
        "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "12345",
    });
  });

  test("getContainerByIndex", async () => {
    const res = await indexClient.getContainerByIndex({
      index: 1,
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes:
        "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "12345",
    });
  });

  test("getContainerRange", async () => {
    const res = await indexClient.getContainerRange({
      startIndex: 0,
      endIndex: 10,
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      containers: [
        {
          id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
          bytes:
            "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          timestamp: "2024-01-01T00:00:00Z",
          encoding: "hex",
          index: "12345",
        },
        {
          id: "7gYg6ioD9MYwxnN9njQfQBqL6dvcW7z2eXhqKDdOoAzHC2FaZ",
          bytes:
            "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186b0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
          timestamp: "2024-01-01T00:00:01Z",
          encoding: "hex",
          index: "12346",
        },
      ],
      encoding: "hex",
    });
  });

  test("getIndex", async () => {
    const res = await indexClient.getIndex({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      index: "12345",
      encoding: "hex",
    });
  });

  test("getLastAccepted", async () => {
    const res = await indexClient.getLastAccepted({
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      bytes:
        "0x00000009de31b4d8b22991d51aa6aa1fc733f23a851a8c9400000000000186a0000000005f041280000000005f9ca900000030390000000000000001fceda8f90fcb5d30614b99d79fc4baa29307762668f16eb0259a57c2d3b78c875c86ec2045792d4df2d926c40f829196e0bb97ee697af71f5b0a966dabff749634c8b729855e937715b0e44303fd1014daedc752006011b730",
      timestamp: "2024-01-01T00:00:00Z",
      encoding: "hex",
      index: "12345",
    });
  });

  test("isAccepted", async () => {
    const res = await indexClient.isAccepted({
      id: "6fXf5hncR8LXvwtM8iezFQBpK5cubV6y1dWgpJCcNyzGB1EzY",
      encoding: "hex",
    });
    expect(res).toStrictEqual({
      accepted: true,
      encoding: "hex",
    });
  });
});
