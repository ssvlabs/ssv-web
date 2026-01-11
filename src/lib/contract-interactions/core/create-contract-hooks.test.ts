import { describe, it, expect, vi } from "vitest";
import type { Abi, Address } from "abitype";

// Mock wagmi hooks - writeContractAsync returns the args it receives
vi.mock("wagmi", () => ({
  useBlockNumber: vi.fn(() => ({ data: 123n })),
  useReadContract: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
  useWriteContract: vi.fn(() => ({
    writeContractAsync: vi.fn((args: unknown) => Promise.resolve(args)),
    error: null,
    isPending: false,
  })),
}));

// Mock useWaitForTransactionReceipt
vi.mock(
  "@/lib/contract-interactions/utils/useWaitForTransactionReceipt",
  () => ({
    useWaitForTransactionReceipt: vi.fn(() => ({
      mutateAsync: vi.fn(() => Promise.resolve({ status: "success" })),
      error: null,
      isPending: false,
      isSuccess: false,
    })),
  }),
);

// Mock wagmi/core
vi.mock("@wagmi/core", () => ({
  getChainId: vi.fn(() => 1),
}));

// Mock wagmi config
vi.mock("@/wagmi/config", () => ({
  config: {},
}));

// Mock react hooks
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useMemo: vi.fn((fn: () => unknown) => fn()),
  };
});

import { createContractHooks } from "./create-contract-hooks";

// Test ABI with various function types
const testAbi = [
  // Read function without inputs
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // Read function with inputs
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  // Write function (nonpayable)
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  // Write function (payable) - tests value parameter
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "recipient", type: "address" }],
    outputs: [],
    stateMutability: "payable",
  },
  // Write function with input named "value" to test conflict resolution
  {
    type: "function",
    name: "setOperatorFee",
    inputs: [
      { name: "operatorId", type: "uint64" },
      { name: "value", type: "uint256" }, // This is an ABI input, NOT eth value
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  // Payable function with input named "value"
  {
    type: "function",
    name: "depositWithValue",
    inputs: [
      { name: "value", type: "uint256" }, // ABI input named "value"
    ],
    outputs: [],
    stateMutability: "payable",
  },
] as const satisfies Abi;

const DEFAULT_CONTRACT: Address = "0x1234567890123456789012345678901234567890";
const defaultContractGetter = () => DEFAULT_CONTRACT;

describe("createContractHooks", () => {
  describe("Hook name generation", () => {
    it("should generate correct hook names for read functions", () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);

      // Check read hooks exist
      expect(hooks).toHaveProperty("useTotalSupply");
      expect(hooks).toHaveProperty("useBalanceOf");

      // Verify they are functions
      expect(typeof hooks.useTotalSupply).toBe("function");
      expect(typeof hooks.useBalanceOf).toBe("function");
    });

    it("should generate correct hook names for write functions", () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);

      // Check write hooks exist
      expect(hooks).toHaveProperty("useTransfer");
      expect(hooks).toHaveProperty("useDeposit");
      expect(hooks).toHaveProperty("useSetOperatorFee");
      expect(hooks).toHaveProperty("useDepositWithValue");

      // Verify they are functions
      expect(typeof hooks.useTransfer).toBe("function");
      expect(typeof hooks.useDeposit).toBe("function");
      expect(typeof hooks.useSetOperatorFee).toBe("function");
      expect(typeof hooks.useDepositWithValue).toBe("function");
    });

    it("should capitalize first letter correctly", () => {
      const lowercaseAbi = [
        {
          type: "function",
          name: "myFunction",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ] as const satisfies Abi;

      const hooks = createContractHooks(lowercaseAbi, defaultContractGetter);
      expect(hooks).toHaveProperty("useMyFunction");
    });
  });

  describe("Write hook structure", () => {
    it("should return correct hook result structure", () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const transferHook = hooks.useTransfer({ contract: DEFAULT_CONTRACT });

      expect(transferHook).toHaveProperty("error");
      expect(transferHook).toHaveProperty("isSuccess");
      expect(transferHook).toHaveProperty("isPending");
      expect(transferHook).toHaveProperty("mutation");
      expect(transferHook).toHaveProperty("write");
      expect(transferHook).toHaveProperty("send");
      expect(transferHook).toHaveProperty("wait");

      expect(typeof transferHook.write).toBe("function");
      expect(typeof transferHook.send).toBe("function");
    });
  });

  describe("Arguments handling", () => {
    it("should pass args correctly for write functions", async () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const transferHook = hooks.useTransfer({ contract: DEFAULT_CONTRACT });

      // send() returns the args passed to writeContractAsync
      const result = await transferHook.send({
        args: {
          to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address,
          amount: 1000n,
        },
      });

      expect(result).toMatchObject({
        functionName: "transfer",
        args: ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", 1000n],
        value: undefined,
      });
    });

    it("should pass value correctly for payable functions", async () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const depositHook = hooks.useDeposit({ contract: DEFAULT_CONTRACT });

      const result = await depositHook.send({
        args: {
          recipient: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address,
        },
        value: 1000000000000000000n, // 1 ETH
      });

      expect(result).toMatchObject({
        functionName: "deposit",
        args: ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"],
        value: 1000000000000000000n,
      });
    });

    it("should handle ABI input named 'value' separately from ETH value", async () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const setFeeHook = hooks.useSetOperatorFee({
        contract: DEFAULT_CONTRACT,
      });

      // args.value is the ABI input, NOT the ETH value
      const result = await setFeeHook.send({
        args: {
          operatorId: 1n,
          value: 500n, // This is the ABI input named "value"
        },
      });

      expect(result).toMatchObject({
        functionName: "setOperatorFee",
        args: [1n, 500n], // Both inputs passed as args
        value: undefined, // No ETH value for nonpayable
      });
    });

    it("should handle both ABI input 'value' and ETH value for payable functions", async () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const hook = hooks.useDepositWithValue({ contract: DEFAULT_CONTRACT });

      const result = await hook.send({
        args: {
          value: 100n, // ABI input named "value"
        },
        value: 2000000000000000000n, // ETH value (2 ETH)
      });

      expect(result).toMatchObject({
        functionName: "depositWithValue",
        args: [100n], // ABI input
        value: 2000000000000000000n, // ETH value
      });
    });
  });

  describe("Contract address validation", () => {
    it("should throw error for invalid contract address", () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);

      expect(() => {
        hooks.useTransfer({ contract: "invalid-address" as Address });
      }).toThrow("Invalid contract address at hook: useTransfer");
    });

    it("should accept valid contract address", () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);

      expect(() => {
        hooks.useTransfer({ contract: DEFAULT_CONTRACT });
      }).not.toThrow();
    });

    it("should pass the same contract address to writeContractAsync", async () => {
      const customContract: Address =
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const transferHook = hooks.useTransfer({ contract: customContract });

      const result = await transferHook.send({
        args: {
          to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address,
          amount: 100n,
        },
      });

      expect(result).toMatchObject({
        address: customContract,
      });
    });
  });

  describe("send function", () => {
    it("should return the contract call args directly", async () => {
      const hooks = createContractHooks(testAbi, defaultContractGetter);
      const transferHook = hooks.useTransfer({ contract: DEFAULT_CONTRACT });

      const result = await transferHook.send({
        args: {
          to: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as Address,
          amount: 500n,
        },
      });

      // send() returns what writeContractAsync returns (which is the args in our mock)
      expect(result).toMatchObject({
        functionName: "transfer",
        args: ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", 500n],
      });
    });
  });
});
