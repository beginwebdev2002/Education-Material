## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-02-02 - Accessible Custom Toggles
**Learning:** `div` elements used as toggle cards (checkbox behavior) require `role="checkbox"`, `tabindex="0"`, `aria-checked`, and keyboard handlers (`Enter`/`Space`) to be accessible. Simply adding `click` is insufficient.
**Action:** When creating custom selection cards, always wrap in a `<button>` or fully implement the ARIA checkbox/radio pattern with keyboard support.
