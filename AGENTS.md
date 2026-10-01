## 1. Execution Environment

- Run all project commands inside the flake dev shell.
- For one-shot commands, use `nix develop -c zsh -lc '<command>'`.
- Do not run project tools such as `node`, `pnpm`, `vite`, or `tsc` directly from the host shell.

## 2. Required Workflow

1. Read the relevant existing code before editing.
2. Identify the smallest safe change.
3. Add or update tests before implementation when behavior is observable.
4. Implement the code.
5. Run all checks required by the change scope.
6. Do not finish while required commands are failing.

## 3. Verification Matrix

For any code change, run:

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck:safety`
- `pnpm verify:security`
- `pnpm test`

For UI behavior changes, also run:

- `pnpm test:e2e:console`
- `pnpm test:e2e`

For configuration or toolchain changes, also run `pnpm test:e2e:console`.

## 4. Non-Negotiable Coding Constraints

- Do not use `any`.
- Do not use TypeScript `as` assertions.
- Do not use non-null assertions.
- Do not use `let` or `var`; use `const`.
- Do not reassign function parameters or mutate their properties.
- Do not use mutating array methods such as `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, or `reverse`.
- Do not rely on truthy/falsy coercion; use explicit boolean expressions.
- Do not introduce lint disables.
- Do not ignore failing tests or type errors.
- Do not weaken TypeScript, ESLint, or tests to make a change pass.

## 5. External Data Boundaries

- Validate external data at runtime before use.
- Use `zod` when an external-data boundary is introduced.
- Prefer `unknown` at boundaries and narrow explicitly.

## 6. Type and State Design

- Prefer explicit domain types and small pure functions.
- Isolate I/O from domain logic.
- Model absence explicitly.
- Use `fp-ts` where it improves boundary handling or error flow.
- Prefer immutable updates and derived values.

## 7. React and Styling

- Follow the Rules of Hooks and keep dependency arrays correct.
- Use effects only for synchronization with external systems.
- Keep domain logic outside components.
- Use Radix Themes, CSS Modules, and `src/assets/global.css`.
- Keep global CSS limited to app-shell concerns and shared tokens.
- Use CSS Modules for component-owned layout and appearance.
- Do not introduce runtime styling wrappers or large inline style objects.
- Use shared tokens or theme scales for spacing, color, typography, radii, and shadows.
- Keep pages focused on composition and data flow.

See `docs/static-css-architecture.md` for the style-layer reference.

## 8. Testing Policy

- Add or update tests for observable behavior.
- Prefer unit tests for domain logic.
- Use end-to-end tests for integration and user interaction.
- Use role, label, or stable test IDs instead of hierarchy-dependent selectors.
- Do not delete or loosen tests to make changes pass.

## 9. Completion Criteria

- The requested change is implemented.
- Formatting, lint, type safety, security verification, and tests pass.
- UI behavior is covered by browser tests.
- No obvious unrelated regressions remain.

In the final report, state what changed, which commands ran, whether they passed, and any remaining risks.
