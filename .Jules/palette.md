## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-02-01 - Angular i18n for ARIA Labels
**Learning:** When adding `aria-label` to components in this Angular app, the `i18n-aria-label` attribute is required for the extraction tool to pick it up.
**Action:** Always pair `aria-label="..."` with `i18n-aria-label` (no value needed) on translatable elements.
