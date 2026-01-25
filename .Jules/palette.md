## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2025-05-24 - Generation Form Accessibility
**Learning:** The stepper and range inputs in the generation form lacked accessible labels, making them difficult for screen reader users to understand.
**Action:** Added `aria-label` and `i18n-aria-label` to the increment/decrement buttons and the range slider to provide clear context.
