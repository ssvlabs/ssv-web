import { describe, it, expect } from "vitest";
import { generateSSVKeysDockerCMD } from "@/lib/utils/keyshares";
import type { Operator } from "@/types/api";
import { parseGwei } from "viem";

const makeOperator = (id: number): Operator =>
  ({
    id,
    public_key: `0xpubkey${id}`,
    dkg_address: `0xdkg${id}`,
    fee: "0",
    eth_fee: "0",
    is_active: 1,
    is_deleted: false,
    is_valid: true,
    is_private: false,
    name: `op-${id}`,
    logo: "",
    type: "operator",
    status: "active",
    validators_count: 0,
    version: "3.1.0",
    network: "mainnet",
    migrated: false,
    effective_balance: "32000000000",
    updated_at: 0,
    location: "",
    setup_provider: "",
    eth1_node_client: "",
    eth2_node_client: "",
    mev_relays: "",
    description: "",
    website_url: "",
    twitter_url: "",
    linkedin_url: "",
    performance: { "24h": 0, "30d": 0 },
  }) as unknown as Operator;

const baseParams = {
  operators: [
    makeOperator(1),
    makeOperator(2),
    makeOperator(3),
    makeOperator(4),
  ],
  nonce: 5,
  account: "0x1111111111111111111111111111111111111111" as `0x${string}`,
  withdrawalAddress:
    "0x2222222222222222222222222222222222222222" as `0x${string}`,
  chainId: 1,
  validatorsCount: 1,
  os: "linux" as const,
};

describe("util:keyshares - generateSSVKeysDockerCMD compounding flag", () => {
  it("does NOT include --compounding when flag omitted", () => {
    const cmd = generateSSVKeysDockerCMD(baseParams);
    expect(cmd).not.toContain("--compounding");
  });

  it("does NOT include --compounding when flag is false", () => {
    const cmd = generateSSVKeysDockerCMD({ ...baseParams, compounding: false });
    expect(cmd).not.toContain("--compounding");
  });

  it("includes --compounding when flag is true (init branch)", () => {
    const cmd = generateSSVKeysDockerCMD({ ...baseParams, compounding: true });
    expect(cmd).toContain("--compounding");
  });

  it("places --compounding immediately after --validators count", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: true,
      validatorsCount: 7,
    });
    expect(cmd).toContain("--validators 7");
    expect(cmd).toContain(" --compounding");
  });

  it("emits --compounding exactly once", () => {
    const cmd = generateSSVKeysDockerCMD({ ...baseParams, compounding: true });
    const matches = cmd.match(/--compounding/g) || [];
    expect(matches).toHaveLength(1);
  });

  it("appends --amount when compounding + effectiveBalance set", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: true,
      effectiveBalanceGwei: parseGwei("32"),
    });
    expect(cmd).toContain("--amount 32000000000");
    expect(cmd).toMatch(/--compounding --amount 32000000000/);
  });

  it("does NOT append --amount when compounding is false", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: false,
      effectiveBalanceGwei: parseGwei("64"),
    });
    expect(cmd).not.toContain("--amount");
  });

  it("uses bumped DKG image tag v3.1.0 by default", () => {
    const cmd = generateSSVKeysDockerCMD(baseParams);
    expect(cmd).toContain("ssvlabs/ssv-dkg:v3.1.0");
  });

  it("scope: --compounding IS added on resign branch when flag is true", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: true,
      signatures: "0xdeadbeef",
      isReshare: false,
    });
    expect(cmd).toContain("--compounding");
    expect(cmd).toContain("resign");
  });

  it("scope: --compounding is NOT added on resign branch when flag is false", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: false,
      signatures: "0xdeadbeef",
      isReshare: false,
    });
    expect(cmd).not.toContain("--compounding");
    expect(cmd).toContain("resign");
  });

  it("scope: --compounding IS added on reshare branch when flag is true", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: true,
      signatures: "0xdeadbeef",
      isReshare: true,
      newOperators: [
        makeOperator(5),
        makeOperator(6),
        makeOperator(7),
        makeOperator(8),
      ],
    });
    expect(cmd).toContain("--compounding");
    expect(cmd).toContain("reshare");
  });

  it("scope: --compounding is NOT added on reshare branch when flag is false", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      compounding: false,
      signatures: "0xdeadbeef",
      isReshare: true,
      newOperators: [
        makeOperator(5),
        makeOperator(6),
        makeOperator(7),
        makeOperator(8),
      ],
    });
    expect(cmd).not.toContain("--compounding");
    expect(cmd).toContain("reshare");
  });
});

describe("util:keyshares - generateSSVKeysDockerCMD newOperators", () => {
  const reshareParams = {
    ...baseParams,
    signatures: "0xdeadbeef",
    isReshare: true,
  };

  it("includes --newOperatorIDs with comma-joined ids on reshare", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...reshareParams,
      newOperators: [
        makeOperator(5),
        makeOperator(6),
        makeOperator(7),
        makeOperator(8),
      ],
    });
    expect(cmd).toContain("--newOperatorIDs 5,6,7,8");
  });

  it("sorts newOperators by id before joining", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...reshareParams,
      newOperators: [
        makeOperator(8),
        makeOperator(5),
        makeOperator(7),
        makeOperator(6),
      ],
    });
    expect(cmd).toContain("--newOperatorIDs 5,6,7,8");
  });

  it("merges old + new operators into --operatorsInfo on reshare", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...reshareParams,
      newOperators: [makeOperator(5), makeOperator(6)],
    });
    for (const id of [1, 2, 3, 4, 5, 6]) {
      expect(cmd).toContain(`"id":${id}`);
    }
  });

  it("does NOT include --newOperatorIDs on resign (no newOperators)", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      signatures: "0xdeadbeef",
      isReshare: false,
    });
    expect(cmd).not.toContain("--newOperatorIDs");
  });

  it("does NOT include --newOperatorIDs when newOperators is empty array", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...reshareParams,
      newOperators: [],
    });
    expect(cmd).not.toContain("--newOperatorIDs");
  });

  it("emits --newOperatorIDs exactly once", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...reshareParams,
      newOperators: [
        makeOperator(5),
        makeOperator(6),
        makeOperator(7),
        makeOperator(8),
      ],
    });
    const matches = cmd.match(/--newOperatorIDs/g) || [];
    expect(matches).toHaveLength(1);
  });
});

describe("util:keyshares - generateSSVKeysDockerCMD signatures branch", () => {
  const sigParams = {
    ...baseParams,
    signatures: "0xdeadbeef",
  };

  it("emits 'resign' subcommand when isReshare is false", () => {
    const cmd = generateSSVKeysDockerCMD({ ...sigParams, isReshare: false });
    expect(cmd).toContain(" resign ");
    expect(cmd).not.toContain(" reshare ");
  });

  it("emits 'reshare' subcommand when isReshare is true", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...sigParams,
      isReshare: true,
      newOperators: [makeOperator(5), makeOperator(6)],
    });
    expect(cmd).toContain(" reshare ");
    expect(cmd).not.toContain(" resign ");
  });

  it("strips 0x prefix from --signatures value", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      signatures: "0xdeadbeef",
    });
    expect(cmd).toContain("--signatures deadbeef");
    expect(cmd).not.toContain("--signatures 0xdeadbeef");
  });

  it("uses --proofsString and omits --proofsFilePath when proofsString is set", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...sigParams,
      proofsString: "PROOF_DATA",
    });
    expect(cmd).toContain("--proofsString 'PROOF_DATA'");
    expect(cmd).not.toContain("--proofsFilePath");
  });

  it("uses --proofsFilePath and omits --proofsString when proofsString is unset", () => {
    const cmd = generateSSVKeysDockerCMD(sigParams);
    expect(cmd).toContain("--proofsFilePath ./data/proofs.json");
    expect(cmd).not.toContain("--proofsString");
  });
});

describe("util:keyshares - generateSSVKeysDockerCMD init branch (old vs new version)", () => {
  it("old version (2.1.0): mounts /data, no --tlsInsecure, /data log paths", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      version: "2.1.0",
    });
    expect(cmd).toContain("$(pwd):/data ");
    expect(cmd).not.toContain("/ssv-dkg/data");
    expect(cmd).toContain("--logFilePath /data/debug.log");
    expect(cmd).toContain("--outputPath /data");
    expect(cmd).not.toContain("--tlsInsecure");
  });

  it("new version (3.1.0): mounts /ssv-dkg/data, includes --tlsInsecure, ./data log paths", () => {
    const cmd = generateSSVKeysDockerCMD(baseParams);
    expect(cmd).toContain("$(pwd):/ssv-dkg/data");
    expect(cmd).toContain("--logFilePath ./data/debug.log");
    expect(cmd).toContain("--outputPath ./data");
    expect(cmd).toContain("--tlsInsecure");
  });

  it("uses requested version in pull and image tag", () => {
    const cmd = generateSSVKeysDockerCMD({
      ...baseParams,
      version: "2.1.0",
    });
    expect(cmd).toContain("docker pull ssvlabs/ssv-dkg:v2.1.0");
    expect(cmd).toContain('-it "ssvlabs/ssv-dkg:v2.1.0"');
  });
});
