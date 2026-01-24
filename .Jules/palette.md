## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2025-05-24 - Generation Form Accessibility
**Learning:** The generation form uses custom increment/decrement buttons ('-' and '+' text) that are announced as 'hyphen' and 'plus' by screen readers, lacking context.
**Action:** Always add `aria-label` with descriptive text (e.g., 'Decrease teaching weeks') and `i18n-aria-label` to these controls.
