# Professional frontend implementation instructions

## Scope and current phase

These instructions apply to `apps/professional/` and its descendants. This application includes counselors and district, State and national authority users supporting adults associated with the National Helpline Against Atrocities (NHAA).

The current phase is frontend implementation with synthetic data and simulated services. Build complete workflows through mock application programming interfaces (APIs). Production authentication, analytical computation, government integrations and emergency dispatch are later work unless explicitly requested.

This is the intended new professional application directory; its creation does not imply an existing application scaffold. Inspect workspace configuration before adding dependencies or routes.

## Standalone instructions and references

This new repository initially contains only two AGENTS.md files. The implementation requirements below are the self-contained starting contract. The previous Haven-Final repository contains the detailed design documents and donor frontend; those files are not included here and are not runtime dependencies.

If the team provides a legacy checkout, consult NHAA_VICTIM_EXPERIENCE_DESIGN.md for the victim journey, NHAA_PROFESSIONAL_PORTAL_DESIGN.md for roles and access, and NHAA_ENGINE_FEATURE_GUIDE.md for the meaning of analytical outputs. Do not invent paths or block routine screen implementation because these optional references are absent. Ask for the reference only when a consequential unresolved product decision requires it.

Latest explicit user decisions govern conflicts. The victim theme preserves original Haven's dark navy/cyan appearance; the professional theme is light, neat, professional and intuitive.

## Visual direction

- Light neutral backgrounds, white or subtly tinted surfaces, navy/slate text, restrained blue/teal primary accents and clear borders.
- Consistent typography, spacing, field labels and alignment. Use readable tables, focused case pages and a clear next action.
- Reserve urgency colors for actual urgency and pair them with text labels and icons. Routine information remains neutral.
- Avoid victim-style glass panels, decorative gradients, excessive rounded tiles, glowing cards and dashboard filler.
- Use a persistent desktop sidebar, page title, breadcrumbs where useful, filters and clear jurisdiction context. Adapt navigation and tables for smaller screens.
- Counselor pages emphasize evidence, conversation and care continuity. District pages emphasize action. State and national pages emphasize trends and escalations.
- Share component primitives with the victim app while keeping professional theme tokens scoped to this app.
- When a legacy checkout is available, inspect its reusable controls in `Frontend/src/components/ui/` and existing booking, table and chart patterns. Reuse selected presentation components, not old student/admin business logic or authentication.
- Treat `Frontend/campus-well-link/` as a donor fork only.

## Stack and shared data boundary

Use React, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui and Radix primitives. Use TanStack Query for remote state, TanStack Table for work queues, Recharts for charts, React Hook Form and Zod for forms, and react-i18next for interface translation.

Use configured compatible versions and one workspace lockfile. Do not introduce duplicate libraries or copy the legacy dependency manifest wholesale.

Intended shared packages:

- `packages/ui`: shared controls and semantic tokens.
- `packages/contracts`: data types and Zod schemas.
- `packages/api-client`: typed service calls.
- `packages/mocks`: Mock Service Worker (MSW) handlers and deterministic synthetic scenarios.
- `packages/config`: shared development configuration.

Screens call the API client; MSW supplies responses during this phase. Keep fixtures and transitions out of page components. API calls, query keys, validation and error handling should have consistent conventions across both professional feature areas.

## Three-person ownership

- Person 1: `apps/victim/`.
- Person 2: `src/features/counselor/` within this app.
- Person 3: `src/features/authorities/` within this app.
- Counselor and authority features export their own route modules. Integrate them through a small shared app shell to reduce conflicts.
- Shared shell, theme, login context, contracts, lockfile and mock scenarios require coordinated changes. Preserve other contributors' work and explain effects on consumers.
- Use small feature branches and reviewed changes. Keep shared-contract changes additive where practical.
- Promote common controls into `packages/ui`; do not import from another application's source directory.

## Application map

| Workspace | Screens and responsibilities |
|---|---|
| Counselor | Priority queue, assigned caseload, victim support workspace, appointments, follow-ups, referrals, live crisis and clinical supervision |
| Authority operations | Alert centre, intervention queue, assigned cases, task detail, escalation queue, service capacity and action history |
| District monitoring | Urgent cases, unacknowledged alerts, overdue assistance, assigned officials, response times and local capacity |
| State monitoring | District comparisons, resource gaps, cross-district work and formally escalated cases |
| National monitoring | Aggregate demand, response performance, intervention delivery, coverage and systemic service gaps |
| Administration and audit | Mock role/jurisdiction management, integration status, access history and exceptional-access review |

Do not create three independent applications for district, State and national views. Navigation, queries and field visibility adapt to the professional's role and scope.

## Counselor feature requirements

Support duty counselors, assigned counselors and clinical supervisors as distinct demo roles.

Counselor classifications must show the full label alongside the code:

- C0 — Immediate response: definite current danger.
- C1 — Urgent unresolved review: serious concern with missing safety facts.
- C2 — Priority support: substantial or worsening distress without confirmed immediate danger.
- C3 — Planned follow-up: continuing non-urgent support.
- Monitor/check-in: indirect or insufficient evidence; unassessed safety is not low risk.

The victim support workspace should show current priority and reasons, exact supporting statements and timestamps, unanswered questions, original and translated text, questionnaire results, relevant speech observations, longitudinal changes, case events, guidance already given, previous contacts and the support plan.

Actions include acknowledgement, contact, unsuccessful-contact recording, clarification request, human priority correction with reason, referral, follow-up, crisis escalation, handoff and resolution.

Use separate presentation for observed facts, model interpretation, uncertainty and human assessment. Do not display hidden model reasoning, fabricated diagnosis, inferred questionnaire totals or a precise suicide probability.

## Authority classifications and intervention requirements

Show full labels with codes:

- A0 — Emergency life safety.
- A1 — Immediate protection.
- A2 — Urgent relief or rehabilitation.
- A3 — Time-bound case action.
- A4 — Legal-support referral.
- A5 — Programme or systemic review.

These classify tasks, not a person's permanent risk level. Multiple authority tasks and a counselor priority can coexist for one person. Consume these outputs from mock contracts; do not calculate them from text or audio in the frontend.

Task detail includes docket, category, reasons, source facts, uncertainty, recommended intervention, human owner, deadline, service availability, assignment, previous attempts and escalation history.

Support counseling, medical-assessment referral, protection, relocation review, shelter/transport/subsistence, financial assistance, legal aid, rehabilitation and case-process follow-up. Treatment choices remain professional decisions.

Authority actions include acknowledgement, assignment, information request, approval/decline with reason, referral, in-progress updates, unavailable/failed service, escalation, delivered status and human closure.

## Roles and disclosure

Role-Based Access Control (RBAC) defines professional functions. Attribute-Based Access Control (ABAC) further checks jurisdiction, assignment, approved purpose and emergency or escalation state. Model both in demo sessions.

| Role | Mock response should expose |
|---|---|
| Duty counselor | Active response evidence and necessary contact information |
| Assigned counselor | Relevant support history for assigned caseload; journal entries explicitly shared |
| Clinical supervisor | Assigned supervision/escalation evidence |
| Emergency responder | Minimum present-danger facts, contact, location, language and response status |
| NHAA case coordinator | Authorized case facts and operational support tasks |
| District relief/rehabilitation officer | Assistance needs and facts necessary to arrange delivery |
| Police/protection role | Relevant threats, safety/contact information and protection tasks |
| Investigating officer | Lawfully scoped investigation facts and tasks |
| Legal-aid role | Referral, relevant case facts and contact preferences |
| Court/prosecution liaison | Proceeding, attendance and protection-order coordination |
| Special Officer/Protection Cell | Assigned recurring threats and coordinated protection work |
| State Nodal Officer | State aggregates and authorized individual escalations |
| National programme role | National aggregates and exceptional authorized escalations |
| Technical administrator | Configuration and operational metadata, no routine victim content |
| Independent auditor | Pseudonymous audit data, with separately approved exceptions |

The Emergency Response Support System (ERSS) is the 112 emergency service context. Legal-aid roles may represent District Legal Services Authorities (DLSA), State Legal Services Authorities (SLSA) or the National Legal Services Authority (NALSA). These are logical demo roles until official mappings are confirmed.

Use the disclosure rules below and consult the Professional Portal Design if supplied. A senior title does not grant all records. A district relief officer must not receive a hidden copy of the full counseling transcript merely because the screen does not render it.

Return role-filtered mock payloads and test direct navigation to restricted pages. Frontend route guards demonstrate user experience; real authorization must later be enforced by the server. A role switcher is development-only and must be visibly labeled.

When switching demo roles, clear or partition cached data so information from the previous role cannot appear in the next view. Do not cache private records in a service worker or browser persistence by default.

## Alert and intervention state contracts

Alert states:

`Created → Sent → Acknowledged → Responder assigned → Response in progress → Handed off → Closed by human`

Also render delivery failed, acknowledgement overdue, fallback sent and escalation failed. Distinguish machine delivery receipts from human acceptance. Never collapse acknowledgement into delivered assistance.

Intervention states:

`Proposed → Human review → Approved/declined → Offered → Victim accepted/declined → Assigned/scheduled → In progress → Delivered/failed/unavailable → Follow-up verified → Closed with reason`

Use the canonical shared contract values rather than inventing alternate enum spellings. Disable invalid transitions with a clear reason. Wait for mutation confirmation, show failures and prevent duplicate submission. Do not optimistically mark emergency response, approval or delivery as successful.

The crisis workspace displays current danger facts, responsiveness, channel, language, available location, Haven engagement, counselor participation, responders and acknowledgements. Simulations must be clearly identified. Never call real emergency numbers or send external notifications from fixtures.

## Dashboard integrity

- District: identifiable records only within assigned operational or supervisory scope.
- State: aggregate comparisons plus authorized escalations.
- National: aggregate monitoring with exceptional authorized case access.
- Derive mock totals and charts from consistent scenario records or a coherent aggregate fixture. Do not count multiple tasks as multiple victims.
- Show reporting period, timezone, denominator, coverage, last update and missing data where they affect interpretation.
- Keep unknown and not-assessed values distinct from zero and low urgency.
- Give charts accessible text/table alternatives and descriptive legends. Filters should affect all related views consistently.
- Do not show credibility scores, voice-based truthfulness, public victim maps, private conversations in aggregates, or success claims based only on recommendations generated.

## Shared scenarios

Use the same synthetic identifiers as the victim app. Required demonstrations include routine follow-up, appointment booking, intimidation with linked counselor and protection tasks, immediate danger, overdue acknowledgement, failed service, escalation, restricted access and empty jurisdiction.

Browser-local MSW mocks do not synchronize users across browsers. Use repeatable scenario replay for frontend demos and describe the limit; do not claim a real multi-user backend exists.

Represent timing and deadlines as configurable fixture values. Do not invent statutory deadlines or contact endpoints and present them as official.

## Accessibility and definition of done

- Use semantic headings, labeled forms, keyboard-operable tables/dialogs, visible focus and sufficient contrast.
- Pair urgency colors with text. Avoid flashing, repeated alert sounds or motion that prevents reading.
- Support desktop operational density and usable tablet/phone layouts. Wide tables may scroll inside a labeled container; the entire page should not overflow.
- Expand abbreviations on first use and make status codes understandable without consulting a design document.
- Implement loading, empty, populated, error, stale/offline, restricted and overdue states where relevant.
- Verify the requested workflow through the shared mock API, including mutation failures and permissions.
- Run available typecheck, lint and build scripts. Add focused tests for consequential behaviour: restricted payloads, role-cache separation, invalid transitions, reason-required decisions and aggregate consistency.
- Inspect representative counselor, district, State and national views in a browser when tooling is available. Report anything not verified.
- Handoff records changed screens, checks performed, contract changes and integrations still simulated.


## Shared foundation and daily team workflow

Before feature work proceeds in parallel, one nominated integration owner scaffolds the pnpm workspace, both Vite application shells, shared theme tokens, routing entry points, contracts, API client and mock fixtures in one foundation pull request. Other contributors may prepare component designs while this is underway, but must not create competing scaffolds. Merge that foundation first; everyone then starts feature branches from the same main branch.

Only these two instruction files are supplied initially. Packages, scripts, routes and feature directories described here are planned; do not claim they already exist.

Each teammate uses their own clone. Person 1 owns apps/victim; Person 2 owns apps/professional/src/features/counselor; Person 3 owns apps/professional/src/features/authorities. Name one of the three as integration owner for shared files; this does not require a fourth person.

For each task: update main with git pull --ff-only, create a short-lived feature branch, implement the assigned scope, run configured checks, commit explicit files, push the branch and open a pull request. Have another teammate review before merging. Update main again before starting the next task. Do not commit directly to main, force-push shared branches, or overwrite another person's changes.

Coordinate changes to packages, root configuration, dependency versions, the shared lockfile and the professional shell. Request shared contract changes before implementing inconsistent local substitutes. State which workspace and files may be edited when assigning work to an AI assistant, and explicitly ask it to read the corresponding AGENTS.md.

These scoped AGENTS.md files do not automatically govern packages/ or repository-root edits. For foundation or shared work, explicitly read both instruction files and follow their common stack and contract conventions.
