# Repository Guidelines

## Product Overview
- This repository is the SSV Web DVT app (React + TypeScript), focused on:
  - validator onboarding and cluster lifecycle management,
  - operator onboarding and operator management,
  - ETH-fee migration UX for legacy SSV clusters.
- Contract interaction target is the v4 getter/setter ABI pair configured by
  `VITE_SSV_NETWORKS` in `src/hooks/use-ssv-network-details.ts`.
- The app is account-centric: core routes are scoped to connected wallets and
  primarily to resources owned by that wallet.

## Architecture Mapping

### App Shell & Routing
- Root router: `src/app/routes/router.tsx`.
- Main route groups:
  - `joinRoutes` (`src/app/routes/router/route-definitions/join-routes.tsx`)
  - `clustersRoutes` (`src/app/routes/router/route-definitions/clusters-routes.tsx`)
  - `operatorsRoutes` (`src/app/routes/router/route-definitions/operators-routes.tsx`)
- Guards:
  - wallet/compliance gate: `src/app/routes/protected-route.tsx`
  - flow state guards: `src/guard/register-validator-guard.tsx`, `src/guard/register-operator-guards.tsx`
  - cluster existence guard: `src/app/routes/protected-cluster-route.tsx`

### Data Sources
- REST API (indexed/network metadata): `src/api/*`
  - clusters/operators/validators/account/compliance endpoints.
- On-chain reads/writes (wagmi + generated hooks):
  - reads: `src/lib/contract-interactions/read/*`
  - writes: `src/lib/contract-interactions/write/*`
  - generated export surfaces: `src/lib/contract-interactions/hooks/getter.ts` and `src/lib/contract-interactions/hooks/setter.ts`.

### State Management
- Server/cache/query state: TanStack Query.
- Route and wizard flow state: Valtio-backed guards.
- Forms/validation: React Hook Form + Zod.
- Tx lifecycle UX: `withTransactionModal` wrapper from
  `src/lib/contract-interactions/utils/useWaitForTransactionReceipt.tsx`.

### Contract-Flow Wiring (What UI Actually Uses)
- Cluster writes used by UI:
  - `registerValidator`, `bulkRegisterValidator`
  - `removeValidator`, `bulkRemoveValidator`
  - `exitValidator`, `bulkExitValidator`
  - `deposit`, `withdraw`
  - `liquidate`, `liquidateSSV` (via withdraw path)
  - `reactivate`
  - `migrateClusterToETH`
- Operator writes used by UI:
  - `registerOperator`, `removeOperator`
  - `declareOperatorFee`, `executeOperatorFee`, `cancelDeclaredOperatorFee`, `reduceOperatorFee`
  - `setOperatorsPrivateUnchecked`, `setOperatorsPublicUnchecked`
  - `setOperatorsWhitelists`, `removeOperatorsWhitelists`
  - `setOperatorsWhitelistingContract`, `removeOperatorsWhitelistingContract`
  - `withdrawAllOperatorEarnings`, `withdrawAllOperatorEarningsSSV`,
    `withdrawAllVersionOperatorEarnings`
- Account-level write used by UI:
  - `setFeeRecipientAddress`

### Contract Hooks Generated but Not Surfaced in App Routes
- Staking: `stake`, `requestUnstake`, `withdrawUnlocked`, `claimEthRewards`,
  `syncFees`, `onCSSVTransfer`.
- Oracle/EB maintenance: `commitRoot`, `updateClusterBalance`.
- DAO/governance owner flows: `updateNetworkFee`, `replaceOracle`,
  `setQuorumBps`, `setUnstakeCooldownDuration`, and other update* functions.

## Route-to-Feature Mapping

### Join Flows
- `/join` picks validator vs operator onboarding.
- Operator onboarding:
  - `/join/operator/register` -> `/join/operator/fee` ->
    `/join/operator/confirm-transaction` -> `/join/operator/success`
- Validator onboarding (new cluster):
  - `/join/validator/select-operators` -> distribution method ->
    keyshares/dkg -> effective balance -> funding -> warnings ->
    confirmation -> success.
- Validator onboarding (existing cluster add-validator):
  - `/join/validator/:clusterHash/*` mirrors above with additional funding path.

### Cluster Flows
- Cluster details: `/clusters/:clusterHash`
- Funding & lifecycle:
  - deposit `/clusters/:clusterHash/deposit`
  - withdraw `/clusters/:clusterHash/withdraw`
  - reactivate `/clusters/:clusterHash/reactivate-balance` ->
    `/clusters/:clusterHash/reactivate`
  - migration wizard `/switch-wizard/:clusterHash/*`
- Validator actions:
  - remove `/clusters/:clusterHash/remove/*`
  - exit `/clusters/:clusterHash/exit/*`
  - reshare `/clusters/:clusterHash/reshare/*`

### Operator Flows
- Operator list/detail: `/operators`, `/operators/:operatorId`
- Fee update: `/operators/:operatorId/fee/*`
- Settings:
  - status toggle,
  - authorized addresses,
  - external whitelisting contract.
- Withdraw and remove:
  - `/operators/:operatorId/withdraw`
  - `/operators/:operatorId/remove`

## Project Structure & Module Organization
- `src/` contains the React + TypeScript app. Key areas include `src/app` (routes
  and feature modules), `src/components` (UI and feature components),
  `src/hooks`, `src/api`, `src/lib`, `src/types`, `src/assets`, `src/signals`,
  `src/wagmi`, and `src/workers`.
- `public/` holds static assets served by Vite as-is.
- `scripts/` contains repo automation scripts (see `pnpm generate-all`).
- Root config files include `vite.config.ts`, `tailwind.config.cjs`, and
  `tsconfig*.json`.

## Build, Test, and Development Commands
- `pnpm dev` runs the Vite dev server with HMR.
- `pnpm dev:prod` runs the dev server with production-mode config.
- `pnpm build` builds the production bundle into `dist/`.
- `pnpm watch` builds in watch mode.
- `pnpm preview` serves the built bundle locally for validation.
- `pnpm lint` runs ESLint; `pnpm fix` applies ESLint fixes.
- `pnpm type-check` runs the TypeScript project build.
- `pnpm generate-all` runs the repo's Node scripts pipeline.

## Coding Style & Naming Conventions
- Use TypeScript (`.ts`, `.tsx`) and keep React components in `src/components`.
- Formatting is handled by Prettier (see `.prettierrc.json`, 80-char width).
- ESLint enforces `@typescript-eslint` rules and flags unused imports; prefer
  type-only imports when possible.
- Follow local naming patterns; for example, `src/components/ui` uses mostly
  kebab-case file names, with a few legacy PascalCase files.

## Testing Guidelines
- No test runner is configured and there are no `*.test.*` files today.
- If adding tests, co-locate them with the feature (e.g.,
  `src/app/foo/foo.test.tsx`) and add a script in `package.json`.

## Commit & Pull Request Guidelines
- Conventional Commits are required via commitlint and Commitizen. Use
  `pnpm commit` or format like `feat: add fee selector`.
- Keep commit messages concise (avoid >100 characters).
- PRs should include a clear summary, verification steps, and UI screenshots or
  recordings when visuals change.

## Configuration & Environment
- Environment files live at `.env`, `.env.development`, and `.env.production`.
- Configuration helpers are typically in `src/config`; document new variables
  where they are introduced.
