# Static CSS Architecture

## Purpose

This document defines where styles belong and which styling mechanisms may be
used.

## Layers

### Global CSS

`src/assets/global.css` owns resets, shared design tokens, root typography,
and the application background. It does not own feature-local component
skins or screen layout.

### CSS Modules

CSS Modules own component layout, borders, colors, typography presentation,
interaction states, and feature-level responsive behavior. Components import
their styles directly. UI state is represented with semantic component props,
`data-*` attributes, or explicit module classes.

### Runtime geometry

Inline values are reserved for geometry that static CSS cannot represent,
such as canvas dimensions or coordinates derived from domain data. Visual
identity remains in static CSS.

## Rules

- Prefer static CSS over runtime style generation.
- Keep styles in the narrowest valid layer.
- Use Radix theme values and shared CSS custom properties.
- Do not add application-owned `styled(...)` wrappers.
- Do not place feature-local rules in global CSS.
- Keep selectors local and avoid assumptions about DOM hierarchy.
- Use `:global(...)` only for narrow component-library integration.
