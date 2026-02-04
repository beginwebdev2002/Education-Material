## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2025-02-04 - Angular i18n and ARIA Labels
**Learning:** In Angular, adding aria-label alone isn't sufficient for localized apps; i18n-aria-label must also be provided to ensure screen reader users get translated descriptions.
**Action:** Always pair aria-label with i18n-aria-label when working on accessible controls in this codebase.
