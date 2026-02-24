# SSV Web App — Implemented Flows

This file maps the flows that are currently implemented in the web app codebase.
It reflects route behavior and actual contract write hooks used by UI.

## 1. Access & Session Flows

### 1.1 Connect + Access Gating
- Entry: `/connect`, then protected app routes.
- Preconditions:
  - Wallet must be connected.
  - Compliance check must pass for non-testnet users.
- Behavior:
  - `ProtectedRoute` redirects disconnected users to `/connect`.
  - Restricted users are redirected to `/compliance`.
- Key refs:
  - `src/app/routes/protected-route.tsx`
  - `src/hooks/app/use-compliance.ts`

### 1.2 Account Landing Redirection
- Entry: `/`
- Behavior:
  - Redirects to `/join` for new accounts.
  - Redirects to last-used clusters/operators page when possible.
- Key refs:
  - `src/app/routes/root-redirection.tsx`
  - `src/hooks/account/use-account-state.ts`

## 2. Validator Onboarding Flows

### 2.1 Create New Cluster + Register Validator(s)
- Entry route:
  - `/join/validator`
- Step sequence:
  1. Select operators.
  2. Choose distribution method (online/offline/keyshares upload).
  3. Produce or upload keyshares.
  4. Enter projected total effective balance.
  5. Choose funding period (ETH runway).
  6. Acknowledge balance/slashing warnings.
  7. Submit confirmation transaction.
- On-chain writes:
  - `registerValidator` (single)
  - `bulkRegisterValidator` (multi)
- Tx value:
  - Uses computed ETH deposit as `msg.value`.
- Key refs:
  - `src/app/routes/create-cluster/register-validator-confirmation.tsx`
  - `src/app/routes/create-cluster/effective-validators-balance.tsx`
  - `src/app/routes/create-cluster/initial-funding.tsx`

### 2.2 Add Validator(s) to Existing Cluster
- Entry route:
  - `/join/validator/:clusterHash/*`
- Behavior:
  - Reuses onboarding flow with cluster-scoped path.
  - Uses existing cluster operator set.
  - Computes additional ETH funding and submits register/bulk-register.
- On-chain writes:
  - `registerValidator`
  - `bulkRegisterValidator`
- Key refs:
  - `src/app/routes/router/route-definitions/join-routes.tsx`
  - `src/app/routes/create-cluster/register-validator-confirmation.tsx`

### 2.3 Offline DKG / Ceremony Assistance
- Entry route:
  - `/join/validator/.../offline`
  - `/join/validator/.../ceremony-summary`
- Behavior:
  - Provides CLI/DKG instructions and health checks.
  - No direct contract call in these screens.
- Key refs:
  - `src/app/routes/create-cluster/distribute-offline.tsx`
  - `src/app/routes/create-cluster/dkg-ceremony-summary.tsx`

## 3. Cluster Lifecycle Flows

### 3.1 Deposit ETH to Cluster
- Entry route:
  - `/clusters/:clusterHash/deposit`
- Preconditions:
  - Cluster page flow expects migrated ETH cluster.
  - User enters ETH amount.
- On-chain write:
  - `deposit(clusterOwner, operatorIds, cluster)` with `msg.value`.
- Key refs:
  - `src/app/routes/dashboard/clusters/cluster/deposit-cluster-balance.tsx`
  - `src/hooks/cluster/use-deposit-cluster-balance.ts`

### 3.2 Withdraw / Self-Liquidation Path
- Entry route:
  - `/clusters/:clusterHash/withdraw`
- Behavior:
  - ETH clusters:
    - withdraw path when post-withdraw runway remains valid.
    - liquidation path when withdraw would result in liquidation.
  - Legacy SSV clusters:
    - flow is full-withdraw + `liquidateSSV`.
- On-chain writes:
  - `withdraw`
  - `liquidate` (ETH path)
  - `liquidateSSV` (SSV path)
- Key refs:
  - `src/app/routes/dashboard/clusters/cluster/withdraw-cluster-balance.tsx`
  - `src/hooks/cluster/use-liquidate-cluster.ts`

### 3.3 Reactivate Liquidated ETH Cluster
- Entry route:
  - `/clusters/:clusterHash/reactivate-balance`
  - `/clusters/:clusterHash/reactivate`
- Behavior:
  - Fetch validators, estimate/set effective balance input.
  - Compute deposit required for selected funding period.
  - Submit reactivation with ETH value.
- On-chain write:
  - `reactivate(operatorIds, cluster)` with `msg.value`.
- Key refs:
  - `src/app/routes/create-cluster/reactivate-effective-balance.tsx`
  - `src/app/routes/create-cluster/reactivate.tsx`

### 3.4 Migrate Legacy SSV Cluster to ETH
- Entry route:
  - `/switch-wizard/:clusterHash/*`
- Wizard sequence:
  1. Intro
  2. Enter projected cluster effective balance
  3. Choose funding period
  4. Confirm migration summary
  5. Submit transaction
  6. Success screen
- On-chain write:
  - `migrateClusterToETH(operatorIds, cluster)` with computed ETH value.
- Key refs:
  - `src/app/routes/switch-wizard/switch-wizard-step-three.tsx`
  - `src/components/wizard/switch-wizard-step-three.tsx`

### 3.5 Remove Validators from Cluster
- Entry route:
  - `/clusters/:clusterHash/remove/*`
- Behavior:
  - Bulk selection + warning acknowledgements.
  - Single or bulk remove transaction.
- On-chain writes:
  - `removeValidator`
  - `bulkRemoveValidator`
- Key refs:
  - `src/app/routes/dashboard/clusters/cluster/remove-validators-confirmation.tsx`

### 3.6 Exit Validators
- Entry route:
  - `/clusters/:clusterHash/exit/*`
- Behavior:
  - Bulk selection + multiple irreversible-risk confirmations.
- On-chain writes:
  - `exitValidator`
  - `bulkExitValidator`
- Key refs:
  - `src/app/routes/dashboard/clusters/cluster/exit-validators-confirmation.tsx`

### 3.7 DKG Reshare (Hybrid On/Off-chain)
- Entry route:
  - `/clusters/:clusterHash/reshare/*`
- Behavior:
  - Validates proofs and DKG health.
  - Guides signature and ceremony steps.
  - Uses existing remove/register flows for final reassignment.
- On-chain writes in this flow set:
  - Indirectly uses remove/register flows via existing routes.
- Key refs:
  - `src/app/routes/reshare-dkg/upload-proofs.tsx`
  - `src/app/routes/reshare-dkg/reshare-dkg.tsx`

## 4. Operator Flows

### 4.1 Register Operator
- Entry route:
  - `/join/operator/register` -> `/join/operator/fee` -> `/join/operator/confirm-transaction`
- Behavior:
  - Validate operator key uniqueness.
  - Collect fee + privacy mode.
  - Submit on-chain registration.
- On-chain write:
  - `registerOperator(publicKey, fee, setPrivate)`
- Key refs:
  - `src/app/routes/join/operator/register-operator-confirmation.tsx`

### 4.2 Update Operator Fee
- Entry route:
  - `/operators/:operatorId/fee/update`
  - then increase or decrease sub-flow.
- Behavior:
  - Increase: declare -> wait -> execute or cancel.
  - Decrease: immediate reduce transaction.
- On-chain writes:
  - `declareOperatorFee`
  - `executeOperatorFee`
  - `cancelDeclaredOperatorFee`
  - `reduceOperatorFee`
- Key refs:
  - `src/app/routes/dashboard/operators/update-fee/increase-operator-fee.tsx`
  - `src/app/routes/dashboard/operators/update-fee/decrease-operator-fee.tsx`

### 4.3 Permission Settings
- Entry route:
  - `/operators/:operatorId/settings/*`
- Behavior:
  - Public/private toggle.
  - Manage address whitelist.
  - Set/remove external whitelist contract.
- On-chain writes:
  - `setOperatorsPrivateUnchecked`
  - `setOperatorsPublicUnchecked`
  - `setOperatorsWhitelists`
  - `removeOperatorsWhitelists`
  - `setOperatorsWhitelistingContract`
  - `removeOperatorsWhitelistingContract`
- Key refs:
  - `src/app/routes/dashboard/operators/operator-settings/operator-status.tsx`
  - `src/app/routes/dashboard/operators/operator-settings/authorized-addresses.tsx`
  - `src/app/routes/dashboard/operators/operator-settings/external-contract.tsx`

### 4.4 Withdraw Operator Earnings
- Entry route:
  - `/operators/:operatorId/withdraw`
- Behavior:
  - Chooses all-version/all-ETH/all-SSV withdraw based on balances.
- On-chain writes:
  - `withdrawAllVersionOperatorEarnings`
  - `withdrawAllOperatorEarnings`
  - `withdrawAllOperatorEarningsSSV`
- Key refs:
  - `src/app/routes/dashboard/operators/withdraw-operator-balance.tsx`

### 4.5 Remove Operator
- Entry route:
  - `/operators/:operatorId/remove`
- Behavior:
  - Explicit irreversible warning + acknowledgment checkbox.
- On-chain write:
  - `removeOperator`
- Key refs:
  - `src/app/routes/dashboard/operators/remove-operator.tsx`

## 5. Account-Level Flow

### 5.1 Update Fee Recipient Address
- Entry route:
  - `/fee-recipient`
- On-chain write:
  - `setFeeRecipientAddress`
- Key refs:
  - `src/app/routes/dashboard/clusters/fee-recipient-address.tsx`

## 6. Current Out-of-App / Not Surfaced in Routes

- Staking lifecycle hooks exist but are not exposed in app routes:
  - `stake`, `requestUnstake`, `withdrawUnlocked`, `claimEthRewards`, `syncFees`.
- Oracle and governance hooks exist but are not exposed in app routes:
  - `commitRoot`, `updateClusterBalance`, `replaceOracle`,
    `updateNetworkFee`, `setQuorumBps`, `setUnstakeCooldownDuration`.
- The top navbar links staking to an external app URL instead of in-app route.

