## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-01-26 - Increment/Decrement Controls Missing Labels
**Learning:** Numeric input controls (like for teaching weeks or lecture counts) often use icon-only +/- buttons that lack accessible names, making them invisible to screen reader users.
**Action:** When working on forms, ensure all increment/decrement buttons have descriptive `aria-label` and `i18n-aria-label` attributes (e.g., "Decrease teaching weeks").
