## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2025-05-23 - Increment/Decrement Controls Accessibility
**Learning:** Numerical increment/decrement controls often lack context for screen readers when using simple "+" and "-" labels.
**Action:** Always add descriptive `aria-label`s like "Increase [item name]" to these controls.
