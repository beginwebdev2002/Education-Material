## 2025-05-23 - Icon-Only Buttons Missing Labels
**Learning:** Multiple components (Header, Admin Tables) use icon-only buttons without accessible labels, relying solely on visual icons.
**Action:** Systematically add `aria-label` or `sr-only` text to all icon-only buttons during future refactors or enhancements.

## 2026-02-05 - Keyboard Accessibility on Clickable Cards
**Learning:** Making cards with `(click)` handlers accessible requires explicit `keydown.enter` and `keydown.space` handlers, plus `role="checkbox"` or `button`. Crucially, interactive children (like buttons/inputs) inside the card must stop propagation of these specific keys to prevent triggering the card's action.
**Action:** When converting `div`s to interactive cards, always add keyboard handlers and ensure nested interactive elements isolate their key events (using `stopPropagation`).
