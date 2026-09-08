# Frontend team conventions

## Responsibilities

| Person | Owns | First suggested feature |
|---|---|---|
| 1 | apps/victim | Talk layout and conversation adapter, followed by journal |
| 2 | apps/professional/src/features/counselor | Case detail, contact workflow and follow-up |
| 3 | apps/professional/src/features/authorities | Task detail, intervention review and filters |

Nominate one of these three as integration owner for packages/, root configuration, the shared lockfile, and the professional app shell. This is a coordination role, not a fourth developer. Separate route modules keep counselor and authority developers from editing the same file for every screen.

## Daily Git workflow

Start with a clean working tree:

~~~sh
git switch main
git pull --ff-only
git switch -c feature/victim-journal
~~~

Implement one bounded feature. Read the appropriate AGENTS.md, use shared contracts and mock handlers, run pnpm check, commit explicit paths, and push:

~~~sh
git add apps/victim/src
git commit -m "Add journal entry interface"
git push -u origin feature/victim-journal
~~~

Open a pull request to main on GitHub. Another teammate reviews behaviour, shared-contract changes and screenshots. Merge after checks pass, then update main before starting another feature. Coordinate changes to shared files before editing. Do not force-push shared branches or discard someone else's edits to resolve conflicts.

## AI assistant task template

> Read AGENTS.md and apps/victim/AGENTS.md. Implement [specific feature] in apps/victim using the existing shared API client and mock contracts. Keep the established theme. Identify any shared contract changes before redefining data locally. Verify the affected journey and report checks and remaining mock behaviour.

For counselor work, use apps/professional/AGENTS.md and restrict feature changes to src/features/counselor. For authority work, use the same instructions and src/features/authorities. Explicitly grant scope to packages/ if a shared change is part of the task.

## Data and mocks

The path is screen → packages/api-client → Mock Service Worker handler → packages/contracts validated response.

Use stable synthetic identifiers. Keep clinical priorities separate from authority tasks. Unknown safety is not low risk. Dates are ISO timestamps; display timezone explicitly. The fixture date is 8 September 2026 and deadlines are demonstration values, not statutory limits.

To add an endpoint: define its schema in contracts, implement typed client access, add a handler and fixture, then consume it with a role-scoped query key. Add focused tests for disclosure or workflow rules. Screens should not import fixtures directly.

Mock role headers are developer controls, not credentials. The future backend must enforce authorization. On role switching, clear cached queries. Return only role-appropriate data; hiding fields in the component is insufficient.

The initial supported demo roles are victim, counselor, district, State and national. Specialist roles described in the design remain future implementation. Add each explicitly with tests instead of using a generic all-access administrator.

Do not put real data or secrets in fixtures. No actual phone calls or external alerts. Acknowledgement is distinct from delivery. Keep retries and invalid states visible.

## Components and theme

Shared primitives live in packages/ui. Both apps import its stylesheet. Semantic CSS variables are overridden by data-theme=victim or professional on the document. Prefer tokens over per-page hard-coded colors. The foundation provides a small shadcn-style source-owned Radix button; it does not claim to vendor the full shadcn component catalogue.

Use Storybook later when the component library grows; it is not configured in this foundation. Similarly, add React Hook Form, Tiptap, charts and avatar packages within reviewed feature changes when first used.

English navigation uses i18next. Full content localization remains work for each feature; do not advertise languages whose translations have not been supplied and checked.

## Verification

pnpm typecheck — all source packages and apps.
pnpm lint — source and configuration.
pnpm test — mock API disclosure and state tests.
pnpm build — both production bundles.
pnpm check — runs all four.

Inspect each feature on phone and desktop, with keyboard navigation, loading, empty, failed and restricted states as appropriate. Build success does not establish visual correctness. GitHub Actions runs the same check command on pushes and pull requests.

## Future backend connection

Replace mock responses behind the shared client, preserve schema semantics and remove development role switching only after real identity and authorization exist. Configure hosting history fallback for both single-page apps. Keep the victim's service worker/offline feature separate from the development MSW service worker.

