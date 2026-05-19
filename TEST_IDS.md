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

_To be populated in PR 2._

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
