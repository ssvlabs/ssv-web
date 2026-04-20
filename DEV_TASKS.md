# Dev tasks

## Register validator — refetch account clusters

**File:** `[register-validator-confirmation.tsx](src/app/routes/create-cluster/register-validator-confirmation.tsx)` → `onMined`

Remove the `if (!accountClusters.clusters.length)` guard and **always** `await accountClusters.query.refetch()` after registration.

---

## Centralize optimistic cluster updates from contract events

**Problem:** Logic like `[deposit-cluster-balance.tsx](src/app/routes/dashboard/clusters/cluster/deposit-cluster-balance.tsx)` (e.g. `ClusterDeposited` → `setOptimisticData` + `mergeClusterSnapshot`) is scattered across routes. Same pattern exists elsewhere (withdraw, remove validator, reactivate, etc.).

**Task:** Add a **single module** (e.g. helper or small registry) that, given **parsed tx events** + **cluster query key**, applies the right **optimistic** updates (`mergeClusterSnapshot`, flags like `isLiquidated`, any other shared rules). Routes should call that instead of inlining `events.find` + `setOptimisticData`.

**Goal:** One place to maintain event → cluster cache shape, easier to extend for new events, less copy-paste bugs.

---

## Exit validators — refresh cluster validators + cluster cache

**File:** `[exit-validators-confirmation.tsx](src/app/routes/dashboard/clusters/cluster/exit-validators-confirmation.tsx)` → `onMined`

Right now: only analytics + navigate. **No** query updates.

**Do:** After a successful exit (single or bulk), **refetch/invalidate the cluster validators query** (same cluster as elsewhere) **and** apply **optimistic cluster data** the same way other cluster flows do (`setOptimisticData` / `mergeClusterSnapshot` from receipt events where applicable).

---

## Register operator — optimistic operator fee field

**File:** `[register-operator-confirmation.tsx](src/app/routes/join/operator/register-operator-confirmation.tsx)` → `onMined` (`OperatorAdded`), where `createDefaultOperator` is called.

**Do:** Put the on-chain fee on `**eth_fee`**, not `**fee**`, when seeding the optimistic operator (v2 / ETH fee model). Keep `fee` at default or only if still required for legacy UI.

---

## Remove operator — optimistic `status` as well as `is_deleted`

**File:** `[remove-operator.tsx](src/app/routes/dashboard/operators/remove-operator.tsx)` → `onMined` (`setOptimisticData` on `getOperatorQueryOptions`).

**Problem:** We only set `**is_deleted: true`**. Other UI reads `**status**` instead, so it can still show the old label until a refetch.

**Do:** In the same optimistic merge, set `**status`** to whatever the app uses for removed operators (e.g. `**"Removed"**`, aligned with `getOperator` / `createDefaultOperator` when an operator is deleted).

---

## Increase operator fee (execute) — optimistic `eth_fee`

**File:** `[increase-operator-fee.tsx](src/app/routes/dashboard/operators/update-fee/increase-operator-fee.tsx)` → `execute` → `onMined` (`setOptimisticData` on `getOperatorQueryOptions`).

**Do:** After `**executeOperatorFee`**, update `**eth_fee**` with the new executed fee (same value you’d put in `fee` today: `declaredFee.data.requestedFee.toString()`), not only `**fee**`, so v2 UI that reads ETH fee stays correct.

---

## Operator status (public/private) — derive `is_private` from `OperatorPrivacyStatusUpdated`

**File:** `[operator-status.tsx](src/app/routes/dashboard/operators/operator-settings/operator-status.tsx)` → `onMined` (`setQueryData` on `getOperatorQueryOptions`).

**Problem:** We flip `**is_private`** with `**!operator.is_private**`. That can drift from chain truth if the user’s view was stale or the tx differs from what we assumed.

**Do:** Use the mined receipt’s decoded events: find `**OperatorPrivacyStatusUpdated`**, read the privacy flag from the **event args** (whatever the ABI names it — e.g. private / `isPrivate`), and set `**is_private`** from that. Fall back to refetch or current toggle only if the event is missing.

---

## Withdraw operator earnings — refetch contract earnings

**File:** `[withdraw-operator-balance.tsx](src/app/routes/dashboard/operators/withdraw-operator-balance.tsx)` → `onMined`

**Do:** Refetch `**useGetOperatorEarnings`** and `**useGetOperatorEarningsSSV**` after a successful withdraw.

---

## Operators by IDs — one API query instead of N `useQueries`

**Today:** `[use-operators.ts](src/hooks/operator/use-operators.ts)` uses `**useQueries`** with one `**getOperator**` call per id (many parallel requests).

**Do:** Switch to the **batch endpoint** already used in **SSV Explorer** (same API) so **one request / one TanStack Query** loads every operator you need.

**After that fetch:** `**setQueryData`** (or equivalent) for each `**getOperatorQueryOptions(operatorId)**` so per-operator queries stay warm — anything that still uses `**useOperator(id)**` or `**getOperatorQueryOptions**` alone keeps working without refetching.

---

## `useOperatorsUsability` — one `useQuery`, mapping inside the query

**File:** `[use-operators-usability.ts](src/hooks/keyshares/use-operators-usability.ts)`

**Today:** `**useOperators`** loads operators, then a separate `**canUse**` `**useQuery**` runs `**canAccountUseOperator**` per operator, then `**useMemo**` merges operator rows + flags + `**combineQueryStatus**` — logic split across chunks.

**Do:** After the **batch `useOperators`** work above, feed operators from that hook. Keep **one main `useQuery`** (the “can use” query): `enabled` only when oper  ator list is ready. Put **all** derived output in `**queryFn`** (and/or `**select**`) — permission checks, validator limits, `usable` / `exceeded_validators_limit` / etc., and the final shape you return today.

**Return** that `**useQuery` result directly** (or a thin wrapper). **Drop** the extra merge layer: no separate “combine status + recompute data outside the query” pattern when the query already gates on having operators.