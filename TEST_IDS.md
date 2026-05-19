# Test IDs Reference

Stable selectors for QA automation against the SSV web app. Every interactive element and key value display in the app has a `data-testid` attribute that test frameworks (Playwright, Cypress, Testing Library) can target.

## Conventions

**Attribute:** `data-testid` only. Do not use `id`, `data-qa`, `data-cy`, or other variants.

**Naming:** `page-section-element-action` kebab-case. Examples:
- `dashboard-validator-list-row-remove-btn`
- `create-cluster-step1-operator-search-input`
- `switch-wizard-confirm-btn`

**Scope tagged across the app:**
- Every interactive element: `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`, `<Tab>`, `<Toggle>`, `<Checkbox>`, `<Radio>`
- Page headings (`<h1>`, `<h2>`)
- Status/value displays: balances, validator counts, fees, APR %, network selectors, cluster health badges
- Error messages, toast messages, banner text
- Modal titles + action buttons
- Form field labels (for locate-by-label selectors)
- Table column headers + entity row identifiers

**Dynamic lists** carry three attributes per row:
- `data-testid="<page>-<entity>-row"` (general selector for "any row in this list")
- `data-testid-index="<n>"` (positional, 0-indexed)
- `data-testid-entity="<id>"` (stable entity identifier — validator pubkey, operator ID, cluster hash)

## Shared component contract

Most shared components in `src/components/ui/` are shadcn-style: they spread props onto their underlying interactive element. You can pass `data-testid` directly at the call site:

```tsx
<Button data-testid="dashboard-create-cluster-btn">Create Cluster</Button>
<Input data-testid="create-cluster-search-input" />
<Checkbox data-testid="terms-checkbox" />
<Switch data-testid="dark-mode-toggle" />
<CopyBtn data-testid="cluster-hash-copy-btn" text={hash} />
```

These components automatically forward `data-testid` to the testable DOM element: **Button**, **IconButton**, **Input**, **NumberInput**, **BigNumberInput**, **SearchInput**, **Checkbox**, **Switch**, **Dialog\***, **AlertDialog\***, **Tab\***, **CopyBtn**, **NavigateBackBtn**, **SsvExplorerBtn**, **BeaconchainBtn**.

### Composites with baked-in test IDs

Some shared components have internal interactive elements that call sites can't reach. These ship with fixed IDs:

| Component | Element | Test ID |
| --- | --- | --- |
| `Pagination` | Container `<nav>` | `pagination-nav` |
| `Pagination` | Previous page button | `pagination-prev-btn` |
| `Pagination` | Next page button | `pagination-next-btn` |
| `Pagination` | Page N button | `pagination-page-{N}-btn` (1-indexed) |
| `Pagination` | Ellipsis | `pagination-ellipsis` |
| `Toast` | Root toast container | `toast` |
| `Toast` | Close button | `toast-close-btn` |
| `Toast` | Title | `toast-title` |
| `Toast` | Description | `toast-description` |
| `TransactionModal` | Dialog root | `transaction-modal` |
| `TransactionModal` | Title ("Sending Transaction") | `transaction-modal-title` |
| `TransactionModal` | Description | `transaction-modal-description` |
| `TransactionModal` | Pending step | `transaction-modal-pending-step` |
| `TransactionModal` | Indexing step | `transaction-modal-indexing-step` |
| `TransactionModal` | Transaction hash text | `transaction-modal-tx-hash` |
| `TransactionModal` | Copy hash button | `transaction-modal-copy-tx-hash-btn` |
| `TransactionModal` | View transaction link | `transaction-modal-view-tx-link` |
| `MultisigTransactionModal` | Dialog root | `multisig-transaction-modal` |
| `MultisigTransactionModal` | Title | `multisig-transaction-modal-title` |
| `MultisigTransactionModal` | Description | `multisig-transaction-modal-description` |
| `MultisigTransactionModal` | Close button | `multisig-transaction-modal-close-btn` |
| `ClusterBackBtnHeader` | Root container | `cluster-back-btn-header` |
| `ClusterBackBtnHeader` | Cluster hash text | `cluster-back-btn-header-cluster-hash` |
| `ClusterBackBtnHeader` | Copy hash button | `cluster-back-btn-header-copy-cluster-hash-btn` |
| `JSONFileUploader` | Dropzone | `json-file-uploader-dropzone` |
| `JSONFileUploader` | Empty/prompt text | `json-file-uploader-empty-prompt` |
| `JSONFileUploader` | Loading text | `json-file-uploader-loading` |
| `JSONFileUploader` | Error text | `json-file-uploader-error` |
| `JSONFileUploader` | File name text | `json-file-uploader-file-{i}-name` |
| `JSONFileUploader` | Remove button | `json-file-uploader-remove-btn` |
| `FileUploaderItem` | Remove button | `file-uploader-item-{index}-remove-btn` |

### Components that accept a `data-testid` prop explicitly

These components don't spread arbitrary props but accept `data-testid` directly:

| Component | Notes |
| --- | --- |
| `ExpandButton` | Pass `data-testid="..."` — applied to the underlying icon button. |

## Per-page test ID manifest

Tagged page-by-page in subsequent PRs.

### Dashboard

#### Clusters list (`/clusters`)

| Element | Test ID |
| --- | --- |
| Page container | `dashboard-clusters-page` |
| Fee address button | `dashboard-clusters-fee-address-btn` |
| Add cluster button | `dashboard-clusters-add-cluster-btn` |
| Empty-state container | `dashboard-clusters-empty-state` |
| Empty-state message | `dashboard-clusters-empty-message` |
| Empty-state create button | `dashboard-clusters-empty-create-btn` |
| Clusters table wrapper | `dashboard-clusters-table` |
| Headers (sortable) | `dashboard-clusters-table-header-{cluster,operators,validators,effective-balance,cluster-balance,operational-runway}` |
| Header more-link | `dashboard-clusters-table-header-cluster-more-link` |
| Row | `dashboard-clusters-table-row` + `data-testid-index={n}` + `data-testid-entity={clusterHash}` |
| Row cells | `dashboard-clusters-table-row-{name,operators,validators-count,effective-balance,balance,runway,status}` |
| Row badges | `dashboard-clusters-table-row-{liquidated-badge,low-runway-badge}` |
| Row switch-to-ETH | `dashboard-clusters-table-row-switch-to-eth-btn` |

#### Operators list (`/operators`)

| Element | Test ID |
| --- | --- |
| Page container | `dashboard-operators-page` |
| Add operator button | `dashboard-operators-add-operator-btn` |
| Operators table wrapper | `dashboard-operators-table` |
| Headers | `dashboard-operators-table-header-{name,status,performance,balance,yearly-fee,validators,effective-balance}` |
| Row | `dashboard-operators-table-row` + `data-testid-index={n}` + `data-testid-entity={operatorId}` |
| Row cells | `dashboard-operators-table-row-{name,status,performance,balance(-eth/-ssv),yearly-fee(-eth/-ssv),validators-count,effective-balance}` |

#### Dashboard picker (header dropdown)

| Element | Test ID |
| --- | --- |
| Trigger | `dashboard-picker-trigger` |
| Label | `dashboard-picker-label` |
| Items | `dashboard-picker-item-clusters`, `dashboard-picker-item-operators` |

#### Cluster detail — SSV cluster (`/clusters/:id`)

| Element | Test ID |
| --- | --- |
| Page | `dashboard-cluster-page` |
| Operator stats grid | `dashboard-cluster-operators-stats` |
| Balance card | `dashboard-cluster-balance-card`, `-label`, `-display` |
| Liquidated badge | `dashboard-cluster-liquidated-badge` |
| Action buttons | `dashboard-cluster-{reactivate,switch-to-eth,deposit,withdraw,add-validator}-btn` |
| Validators card | `dashboard-cluster-validators-card`, `-label`, `-count` |

#### Cluster detail — Migrated/ETH cluster

| Element | Test ID |
| --- | --- |
| Page | `dashboard-migrated-cluster-page` |
| Tabs | `dashboard-migrated-cluster-tab-{validators,operators}` |
| Add validator | `dashboard-migrated-cluster-add-validator-btn` |
| Header | `dashboard-migrated-cluster-header`, `-back-link`, `-name`, `-edit-name-btn`, `-id`, `-id-copy-btn`, `-liquidated-badge` |
| Validators list | `dashboard-cluster-validators-list` |
| Validator row | `dashboard-cluster-validators-row` + `data-testid-index={n}` + `data-testid-entity={pubkey}` |
| Validator row cells | `dashboard-cluster-validators-row-{pubkey,pubkey-copy-btn,status,explorer-btn,beaconchain-btn}` |
| Validator row actions menu | `dashboard-cluster-validators-row-actions-trigger`, `-change-operators-item`, `-remove-item`, `-exit-item` |
| Operators table | `dashboard-cluster-operators-table` |
| Operators table headers | `dashboard-cluster-operators-table-header-{name,status,performance,fee}` |
| Operators table row | `dashboard-cluster-operators-table-row` + `data-testid-index={n}` + `data-testid-entity={operatorId}` |
| Operators row cells | `dashboard-cluster-operators-table-row-{name,verified-icon,explorer-btn,id,id-copy-btn,status,performance,fee}` |

#### Cluster name dialog

| Element | Test ID |
| --- | --- |
| Dialog parts | `cluster-name-dialog`, `-close-btn`, `-title`, `-description`, `-name-input`, `-clear-btn`, `-name-error`, `-api-error`, `-submit-btn` |

#### Operational Runway card

| Element | Test ID |
| --- | --- |
| Card | `dashboard-operational-runway-card` |
| Label / days | `dashboard-operational-runway-label`, `-days` |
| Action buttons | `dashboard-operational-runway-{deposit,withdraw,reactivate}-btn` |

#### Deposit cluster (`/clusters/:id/deposit`)

`dashboard-cluster-deposit-{page,back-btn,title,amount-input,wallet-balance,submit-btn}`

#### Withdraw cluster (`/clusters/:id/withdraw`)

`dashboard-cluster-withdraw-{page,back-btn,title,available-balance,amount-input,max-btn,liquidation-warning,penalties-link,liquidation-docs-link,agreement-checkbox,submit-btn}`

#### Bulk select validators (exit/remove)

`dashboard-cluster-bulk-{exit|remove}-{page,back-btn,title,selected-count,select-all-checkbox,next-btn}`
Per row: `…-row` + `data-testid-index` + `data-testid-entity` + per-cell `…-row-{checkbox,pubkey,pubkey-copy-btn,status,explorer-btn,beaconchain-btn}`

#### Exit confirmation

`dashboard-cluster-exit-{confirmation-page,back-btn,queue-info,warning,agree-1-checkbox,agree-2-checkbox,agree-3-checkbox,submit-btn}`

#### Exit success

`dashboard-cluster-exit-success-{page,next-steps-heading,go-to-cluster-btn}`

#### Remove validators confirmation

`dashboard-cluster-remove-{confirmation-page,back-btn,warning,agreement-checkbox,submit-btn}`

#### Fee Recipient (`/fee-recipient`)

`dashboard-fee-recipient-{page,back-btn,proposal-rewards-link,warning,address-label,address-input,address-error,update-btn}`

#### Operator detail (`/operators/:id`)

`dashboard-operator-{page,back-btn,validators-count,performance,effective-balance,balance-card,balance-label,balance-eth,balance-ssv,withdraw-btn,fee-card,fee-label,yearly-fee-eth,yearly-fee-ssv,update-fee-btn,validators-card,validators-label}`

#### Operator settings (`/operators/:id/settings/*`)

| Page | Test ID prefix |
| --- | --- |
| Settings root | `dashboard-operator-settings-{page,back-btn,card}` |
| Metadata | `dashboard-operator-metadata-{page,back-btn,name-input,description-input,setup-provider-input,website-input,twitter-input,linkedin-input,dkg-address-input,submit-btn}` |
| Authorized addresses | `dashboard-authorized-addresses-{page,back-btn,title,count-badge,input-{i},remove-{i}-btn,add-btn,cancel-btn,submit-btn}` |
| External contract | `dashboard-external-contract-{page,back-btn,input,clear-btn,cancel-btn,save-btn}` |
| Operator status | `dashboard-operator-status-{page,back-btn,title,toggle-btn}` |

#### Operator update-fee (`/operators/:id/fee/*`)

| Page | Test IDs |
| --- | --- |
| Update root | `dashboard-update-fee-{page,back-btn,yearly-fee-input,max-btn,next-btn}` |
| Decrease | `dashboard-decrease-fee-{page,back-btn,submit-btn}` |
| Increase | `dashboard-increase-fee-{page,back-btn,declare-btn,declare-new-btn,cancel-btn,execute-btn,back-to-account-btn}` |
| Updated success | `dashboard-fee-updated-{page,back-to-account-btn}` |

#### Operator withdraw + remove + error states

| Page | Test IDs |
| --- | --- |
| Withdraw operator balance | `dashboard-withdraw-operator-{page,back-btn,balance-eth,balance-ssv,submit-btn}` |
| Remove operator | `dashboard-remove-operator-{page,back-btn,warning,agreement-checkbox,submit-btn}` |
| Not your operator | `dashboard-no-your-operator-{page,title,description,back-btn}` |
| Operator not found | `dashboard-operator-not-found-{page,title,description,back-btn}` |

### Create cluster wizard

_To be populated in PR 3._

### Switch wizard (SSV → ETH migration)

_To be populated in PR 4._

### Join (operator onboarding)

_To be populated in PR 5._

### Reshare DKG

_To be populated in PR 6._

### Modals + banners + remaining

_To be populated in PR 7._

## Adding test IDs to new code

When adding any new UI to this repo:

1. **Native HTML elements** — add `data-testid` directly.
2. **Shared components** — pass `data-testid="..."` at the call site. It will forward to the testable DOM element automatically.
3. **New shared components** — accept `data-testid` via prop spread. If the component has internal interactive children, give each a derived ID (e.g. `${testId}-confirm-btn`) and document it in this file.
4. **Lists / repeating rows** — add all three attributes: `data-testid="<page>-<entity>-row"`, `data-testid-index="<n>"`, `data-testid-entity="<id>"`.

## Verifying coverage

To find untagged interactive elements on a page:

```bash
grep -rE '<(button|input|select|textarea|a)\b' src/app/routes/<page>/ \
  | grep -v 'data-testid'
```

Treat any match as a gap and tag before merging UI changes.
