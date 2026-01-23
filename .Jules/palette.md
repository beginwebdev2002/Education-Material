## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-01-23 - Localized ARIA Labels
**Learning:** When adding `aria-label` to Angular components, `i18n-aria-label` is required to ensure the text is picked up by the localization system.
**Action:** Always pair `aria-label="Text"` with `i18n-aria-label` (and optional description) in Angular templates.
