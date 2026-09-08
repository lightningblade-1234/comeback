# Comeback — Haven frontend foundation

Two frontend applications for the agreed Haven product, with shared contracts, components and mock services. All records are synthetic. No model inference, real authentication, government connection or emergency dispatch is implemented.

## Start here

Prerequisites: Node.js 22.12 or newer in the 22 or 24 release line, and pnpm 11.19.0. Install the matching pnpm version using your usual Node package-manager setup.

~~~sh
git clone https://github.com/lightningblade-1234/comeback.git
cd comeback
pnpm install --frozen-lockfile
pnpm dev
~~~

- Victim app: http://127.0.0.1:5173 — dark Haven theme.
- Professional app: http://127.0.0.1:5174 — light professional theme.
- Run one app: pnpm dev:victim or pnpm dev:professional.
- Validate everything: pnpm check.
- Preview a built app: pnpm --filter @haven/victim preview (stop its dev server first).

Mock APIs start automatically in development and preview. No environment file is needed. Setting VITE_ENABLE_MOCKS=false displays an explicit unavailable-backend screen rather than connecting to an imaginary service.

## Repository map

~~~text
apps/
  victim/                        Person 1
  professional/
    src/features/counselor/       Person 2
    src/features/authorities/     Person 3
packages/
  ui/                            Shared controls and theme tokens
  contracts/                     Validated data shapes and status values
  api-client/                    Typed fetch calls and query keys
  mocks/                         Synthetic fixtures, API handlers and tests
  config/                        Shared TypeScript configuration
docs/frontend-conventions/       Team workflow and implementation rules
~~~

## What works now

- Runnable application shells and route entry points.
- Victim home/support summary from the mock API.
- Counselor queue with supporting evidence.
- District task with an acknowledgement mutation.
- State and national aggregate views, selected through a labeled development role switcher.
- Restricted-route experience and role-filtered mock responses.
- Shared Radix-based button, panels, badges, error states and theme tokens; Tailwind integration.
- Shared Zod validation, TanStack Query conventions and English translation wiring.
- Contract/disclosure/transition tests and GitHub Actions checks.

Talk, Journal and More are labeled feature entry points for Person 1, not completed product screens. The support route currently reuses the summary. Avatar, live voice, journal editing, booking mutations, complete counselor workflows, full authority role coverage, charts, notifications and installable/offline app support are follow-up features. Add their libraries when implementing them; they are not installed speculatively.

Mock state lives in the current browser instance and resets on reload. Acknowledging a district task does not update a victim app in another tab/origin. State and national views in the same professional session reflect its local fixture state. Tests use the same handlers in Node.

## Working together

Read [the team guide](docs/frontend-conventions/README.md). Each teammate clones the repository separately and works on a short-lived feature branch. One teammate owns shared integration. Pull requests are reviewed before merging. Branch protection and collaborator invitations must be configured by the repository owner; workflow files alone do not enforce them.

