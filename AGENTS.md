# Shared frontend foundation

Read apps/victim/AGENTS.md for victim work and apps/professional/AGENTS.md for counselor or authority work. For root and packages/ changes, read both. Work is frontend-only with synthetic data.

One pnpm workspace contains two Vite apps and five shared packages. Do not initialize another workspace. Maintain separate dark victim and light professional themes through packages/ui/src/styles.css.

Ownership: Person 1 owns apps/victim; Person 2 owns apps/professional/src/features/counselor; Person 3 owns apps/professional/src/features/authorities. One of the three acts as integration owner for the professional shell, shared packages, root configuration and lockfile. Coordinate shared edits; use feature branches and reviewed pull requests.

Use packages/contracts as the single source for data shapes and states. Route page data through packages/api-client and packages/mocks. Never calculate clinical priorities in components or send real notifications. Demo role headers and route guards are not production authorization.

Read docs/frontend-conventions/README.md before shared changes. Run pnpm check for shared work. Browser-local mock state resets on reload and is not synchronized across app origins.

