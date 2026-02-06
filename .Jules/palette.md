## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2025-05-24 - Accessible Interactive Cards and Steppers
**Learning:** Interactive cards (like format selection) implemented as divs are inaccessible by default. Adding role='checkbox', tabindex='0', aria-checked, and keyboard handlers (Enter/Space) makes them accessible. Stepper buttons need specific aria-labels.
**Action:** Ensure all custom interactive elements have semantic roles and keyboard support.
