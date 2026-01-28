## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-01-28 - Form Control Accessibility
**Learning:** Increment/decrement buttons in forms (e.g., `-` and `+`) often lack descriptive labels, making them ambiguous for screen reader users.
**Action:** Add explicit `aria-label` with `i18n-aria-label` to all stepper/counter controls to describe the specific action (e.g., "Decrease teaching weeks").
