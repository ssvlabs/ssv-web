import { describe, expect, it, vi } from "vitest";
import type { FetchStatus } from "@tanstack/react-query";
import { combineQueryStatus, withUnavailable } from "@/lib/react-query";

vi.mock("@/hooks/use-ssv-network-details", () => ({
  getSSVNetworkDetails: vi.fn(),
}));

type Status = "pending" | "error" | "success";

const query = (status: Status, fetchStatus: FetchStatus) => ({
  fetchStatus,
  isPending: status === "pending",
  isLoading: status === "pending" && fetchStatus === "fetching",
  isError: status === "error",
  isSuccess: status === "success",
  isFetched: status !== "pending",
  isFetching: fetchStatus === "fetching",
  error: status === "error" ? new Error("rpc down") : null,
});

const statusOf = (...queries: ReturnType<typeof query>[]) =>
  withUnavailable(combineQueryStatus(...queries), queries);

describe("withUnavailable", () => {
  it("treats a paused read as unavailable, not pending", () => {
    const status = statusOf(query("pending", "paused"));
    expect(status.isPaused).toBe(true);
    expect(status.isUnavailable).toBe(true);
    expect(status.isPending).toBe(false);
  });

  it("treats an errored read as unavailable", () => {
    const status = statusOf(query("error", "idle"));
    expect(status.isPaused).toBe(false);
    expect(status.isUnavailable).toBe(true);
    expect(status.isPending).toBe(false);
  });

  it("keeps a fetching read pending", () => {
    const status = statusOf(query("pending", "fetching"));
    expect(status.isPaused).toBe(false);
    expect(status.isUnavailable).toBe(false);
    expect(status.isPending).toBe(true);
  });

  it("reports success when every read resolved", () => {
    const status = statusOf(
      query("success", "idle"),
      query("success", "fetching"),
    );
    expect(status.isSuccess).toBe(true);
    expect(status.isUnavailable).toBe(false);
    expect(status.isPending).toBe(false);
  });

  it("flags the set as unavailable when any read errored", () => {
    const status = statusOf(query("success", "idle"), query("error", "idle"));
    expect(status.isUnavailable).toBe(true);
    expect(status.isPending).toBe(false);
  });

  it("never counts a disabled read (idle + pending) as pending or unavailable", () => {
    const status = statusOf(query("pending", "idle"), query("pending", "idle"));
    expect(status.isIdle).toBe(true);
    expect(status.isSuccess).toBe(false);
    expect(status.isPaused).toBe(false);
    expect(status.isUnavailable).toBe(false);
    expect(status.isPending).toBe(false);
  });

  it("stays pending while an enabled read is fetching next to a disabled one", () => {
    const status = statusOf(
      query("pending", "idle"),
      query("pending", "fetching"),
    );
    expect(status.isPending).toBe(true);
    expect(status.isIdle).toBe(false);
    expect(status.isUnavailable).toBe(false);
  });
});
