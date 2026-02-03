## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-02-03 - Accessible Numeric Steppers in Loops
**Learning:** When rendering form controls in a loop (e.g., format options), standard `label for="id"` fails if IDs aren't unique. Also, helper buttons (`-`/`+`) adjacent to inputs often lack labels.
**Action:** Use dynamic IDs (e.g., `[id]="'field-' + item.id"`) for inputs and labels. Always add `aria-label` to increment/decrement buttons describing the specific action and target.
