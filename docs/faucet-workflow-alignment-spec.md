# Faucet Workflow Alignment Spec (faucet-prod + faucet-stage)

## Objective
Align faucet branch CI/CD with the deployment model used on `main`:
- Use AWS OIDC + shared IAM role (no static AWS access keys in GitHub secrets).
- Keep branch-specific build/deploy targets.
- Use separate S3 bucket per branch.

## Scope
- Branches in scope: `faucet-prod`, `faucet-stage`.
- File in scope: `.github/workflows/build_deploy.yml`.
- Repository-level vars/secrets updates needed for workflow runtime.

## Current State (Before)
- Faucet workflow uses `jakejarvis/s3-sync-action@v0.5.0` with static AWS key secrets.
- Workflow shape differs from `main` (action pins, permissions, dependency install flags, AWS auth model).
- Bucket secrets are branch-specific, but auth is also branch-specific via long-lived keys.

## Target State (After)
- Keep one workflow file on each branch with two deploy tracks:
  - `faucet-stage` track deploys to stage faucet bucket.
  - `faucet-prod` track deploys to prod faucet bucket.
- Switch deployment auth to:
  - `aws-actions/configure-aws-credentials` with `role-to-assume: ${{ secrets.SSV_WEB_AWS_IAM_ROLE }}`
  - `aws-region: ${{ vars.AWS_REGION }}`
- Deploy via AWS CLI (`aws s3 cp ./build s3://... --recursive`) to match `main` style.
- Remove dependency on static AWS key secrets for deploy.
- Keep faucet build env behavior intact (faucet page flags, captcha, mixpanel, networks).

## Workflow Changes
1. Triggers and job structure
- Remove `pull_request` trigger to match `main` behavior (`push` + `workflow_dispatch`).
- Rename job to match `main` convention (`github-workflow`).
- Add `permissions.id-token: write` for OIDC role assumption.

2. Action/runtime alignment with `main`
- Pin actions to the same refs used on `main`:
  - `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5`
  - `actions/setup-node@3235b876344d2a9aa001b8d1453c930bba69e610`
  - `actions/cache@6f8efc29b200d32929f49075959781ed54ec270c`
- Use `pnpm/action-setup@v2` with version `10.20.0`.
- Use `pnpm install` (not `--frozen-lockfile`) to match `main`.
- Keep lint step.
- Keep semantic-release disabled/commented as on `main`.

3. Deploy auth + upload
- Add `Configure AWS credentials` step gated to faucet branches:
  - `if: github.ref == 'refs/heads/faucet-stage' || github.ref == 'refs/heads/faucet-prod'`
- Replace `jakejarvis/s3-sync-action` deploy steps with `aws s3 cp` steps:
  - Stage: `secrets.SSV_WEB_FAUCET_STAGE_AWS_S3_BUCKET`
  - Prod: `secrets.SSV_WEB_FAUCET_PROD_AWS_S3_BUCKET`

## Repository Variables and Secrets

### Required repo variable
- `AWS_REGION`
  - Shared across both branches.
  - Example: `us-west-2` (or your chosen deploy region).

### Required repo secrets (new/confirmed)
- `SSV_WEB_AWS_IAM_ROLE`
  - Shared by both branches (single IAM role ARN).
- `SSV_WEB_FAUCET_STAGE_AWS_S3_BUCKET`
  - Bucket name for `faucet-stage` deploy target.
- `SSV_WEB_FAUCET_PROD_AWS_S3_BUCKET`
  - Bucket name for `faucet-prod` deploy target.

### Existing non-AWS secrets still used by faucet builds
- `BLOCKNATIVE_KEY`
- `LINK_SSV_DEV_DOCS`
- `CAPTCHA_KEY_STAGE` (currently used by both branch builds)
- `MIXPANEL_TOKEN_PROD` (prod branch build)
- Network contract/tag secrets already referenced in workflow env JSON.

### Secrets that become obsolete for faucet deploy (can be retired after rollout)
- `STAGE_AWS_SECRET_KEY_ID`
- `STAGE_AWS_SECRET_ACCESS_KEY`
- `PROD_AWS_SECRET_KEY_ID`
- `PROD_AWS_SECRET_ACCESS_KEY`
- `STAGE_FAUCET_AWS_S3_BUCKET` (replaced by `SSV_WEB_FAUCET_STAGE_AWS_S3_BUCKET`)
- `PROD_FAUCET_AWS_S3_BUCKET` (replaced by `SSV_WEB_FAUCET_PROD_AWS_S3_BUCKET`)

## IAM Role Requirements
- Trust policy must allow GitHub OIDC federation from this repository.
- Permissions must include at minimum:
  - `s3:ListBucket` on both faucet buckets.
  - `s3:PutObject`, `s3:DeleteObject`, `s3:GetObject` on bucket objects.

## Rollout Plan
1. Merge workflow updates into `faucet-prod`.
2. Merge equivalent updates into `faucet-stage`.
3. Add/verify new vars and secrets in repo settings before first post-merge deploy.
4. Validate first push deployment on each branch.
5. Retire obsolete static AWS secrets after successful verification.

## Acceptance Criteria
- Push to `faucet-stage` successfully builds and uploads to stage faucet bucket using OIDC role.
- Push to `faucet-prod` successfully builds and uploads to prod faucet bucket using OIDC role.
- No deploy step requires static AWS key secrets.
- Workflow structure and action pinning are aligned with `main` deployment style.

