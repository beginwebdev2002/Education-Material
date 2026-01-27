## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-01-27 - Numeric Stepper Accessibility
**Learning:** Numeric stepper controls implemented with custom buttons often lack label associations for the input and accessible labels for the increment/decrement buttons.
**Action:** When using custom stepper components, always ensure the `input` has an `id` associated with a `label`, and the buttons have `aria-label` describing their action (e.g., "Increase teaching weeks").
