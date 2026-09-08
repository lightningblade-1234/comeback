# Victim frontend implementation instructions

## Scope and current phase

These instructions apply to `apps/victim/` and its descendants. Build the adult victim experience for Haven, connected to the National Helpline Against Atrocities (NHAA) case context.

The current phase is frontend implementation using synthetic data and simulated services. Build interactive screens and complete user journeys. Backend development, analytical models, real government connections and production emergency dispatch are later work unless explicitly requested.

This directory is the intended new victim application. Its presence does not mean the workspace or application has already been scaffolded. Inspect existing configuration before adding tooling; never create a second competing workspace.

## Standalone instructions and references

This repository now includes the shared frontend foundation. Read the root README.md and docs/frontend-conventions/README.md for setup and actual implemented scope. The implementation requirements below remain the product contract. The previous Haven-Final repository contains detailed design documents and donor frontend; those files are optional references, not runtime dependencies.

If the team provides a legacy checkout, consult NHAA_VICTIM_EXPERIENCE_DESIGN.md for the victim journey, NHAA_PROFESSIONAL_PORTAL_DESIGN.md for roles and access, and NHAA_ENGINE_FEATURE_GUIDE.md for the meaning of analytical outputs. Do not invent paths or block routine screen implementation because these optional references are absent. Ask for the reference only when a consequential unresolved product decision requires it.

Latest explicit user decisions govern conflicts. The victim theme preserves original Haven's dark navy/cyan appearance; the professional theme is light, neat, professional and intuitive.

## Visual direction

- Use the original `Frontend/src/` as a visual reference: dark navy/slate surfaces, cyan and soft blue accents, rounded conversation bubbles, gentle gradients and welcoming cards.
- When a legacy checkout is available, inspect its `Frontend/src/pages/PersonalCare.tsx`, `Journal.tsx`, `BookSession.tsx`, `Resources.tsx`, and the existing navigation and theme files before reusing their visual patterns.
- `Frontend/campus-well-link/` is a donor fork for selected components. Do not preserve it as a second runtime application.
- Preserve familiarity while improving contrast, spacing, responsive behaviour and accessibility.
- Use restrained glass effects and subtle motion. Avoid constant animation, glowing every surface, or large decorative areas that displace useful actions.
- Use shared semantic theme tokens rather than scattering hard-coded colors. Scope victim theme values to this application; never change the professional theme accidentally.
- Do not copy student wording, fake wellness statistics, streaks, badges, unsupported AI insights or victim-visible risk probabilities.
- Keep copy calm, respectful and practical. Use the person's preferred name rather than repeatedly labeling them a victim.

## Stack and boundaries

Use React, TypeScript, Vite and React Router; Tailwind CSS and shadcn/ui with Radix primitives; TanStack Query for remote state; React Hook Form and Zod for forms; Tiptap for the journal; react-i18next for interface translation. Use React Three Fiber and Drei for the optional three-dimensional companion.

Use the repository's selected compatible versions and lockfile. Do not import the old dependency manifest wholesale or add another library for a job already covered.

Intended shared packages:

- `packages/ui`: reusable components and semantic design tokens.
- `packages/contracts`: TypeScript data contracts and Zod validation schemas.
- `packages/api-client`: typed application programming interface (API) calls.
- `packages/mocks`: synthetic fixtures and Mock Service Worker (MSW) response handlers.
- `packages/config`: shared development configuration.

The normal data path is `screen → shared API client → MSW handler`. Later, the same client connects to the backend. Do not embed fake case arrays or business workflows inside page components. Keep short-lived presentation state local; do not duplicate server state in a global store.

## Three-person collaboration

- Person 1 owns this application.
- Person 2 owns `apps/professional/src/features/counselor/`.
- Person 3 owns `apps/professional/src/features/authorities/`.
- Preserve unrelated work. Use feature branches and small reviewed changes.
- Changes to shared contracts, fixtures, workspace configuration, lockfile or shared components affect everyone. Keep them additive where possible and describe consumer impacts in the handoff. Do not independently redefine shared identifiers or state values.
- Do not import components from another app's source directory. Promote reusable components into a shared package.

## Navigation and required experience

Mobile primary navigation: **Home, Talk, My Support, Journal, More**. Desktop may use a sidebar with the same information architecture.

| Area | Required experience |
|---|---|
| Home | Short check-in, continue conversation, next appointment, upcoming case event, support-request status and persistent calm Urgent Help action |
| Talk | Text, voice and hybrid modes; shared conversation history; visible transcript; correction; interruption; mute; stop microphone; language and speech-speed controls; human-help request |
| My Support | Counselor booking, rescheduling and cancellation; check-ins; support plan; referrals; support requests and delivery status |
| Journal | Text/voice entry interface, editor, drafts, history, search, optional prompts and explicit per-entry sharing controls |
| My Case | Docket-linked timeline, imported source facts, upcoming events, assistance status and report-an-error flow |
| Resources | Searchable multilingual emotional, medical, legal, protection, financial and rehabilitation resources; explain recommendations |
| Shared Support | Explicit opt-in, moderated Peer Circles, mentor request and matching status, report/block/leave actions |
| Preferences | Language, accessibility, reduced motion, low-data mode, contact preferences, discreet notifications and privacy explanations |

Docket lookup during this phase uses synthetic records and demonstrates signup; it does not establish production identity verification.

Shared Support must not include unrestricted user search, unsolicited direct messages, follower rankings or a trending-trauma feed. Peers see pseudonyms. A mentor is a trained, supervised person with lived experience, not someone automatically certified as recovered.

## Fixed Haven persona and voice prototype

- One consistent, softly stylized adult persona. No persona selector or alternate personalities.
- Everyday clothing, upper-body framing and a calm environment; no medical or official impersonation.
- Approved states: calm presence, attentive, warm encouragement, gentle reassurance, serious attention, focused action, clarification and reassuring resolution.
- No anger, panic, disgust, crying, despair, shock or forced excitement. Serious attention uses a neutral expression and steady delivery; it is not a smiling crisis response.
- Select expressions from typed approved presentation states. Never execute arbitrary model-supplied animation instructions or directly map a speech-emotion label to a facial expression.
- Use a replaceable conversation adapter with deterministic scripted transcripts, sample audio and listening/speaking/interrupted/error states. Do not claim simulated speech is a live model connection.
- If an approved avatar asset is unavailable, use an honest static fallback and keep the integration ready. Do not substitute an unapproved identity and call it final.
- Lazy-load three-dimensional assets; provide static, hidden-avatar and reduced-motion fallbacks. The app must remain usable when rendering fails.
- Microphone capture starts only after an explicit user action and shows a visible recording state. Stop media tracks when the session ends or the screen unmounts. Do not request a camera for this feature.

## Mock scenarios and cross-app continuity

Use shared synthetic victim IDs, case IDs, appointment IDs and task IDs. Support repeatable scenarios for routine check-in, counseling request, intimidation/protection request, urgent danger, overdue assistance, service unavailable, and lost connectivity.

Suggested shared demonstration: a victim reports intimidation; a counselor receives priority support work; a district official receives a protection task; the victim sees the acknowledgement and assistance status.

Browser-local mocks do not synchronize across browsers or applications. Use consistent fixtures/scenario replay for local demos and document this limitation; do not fake cross-device synchronization.

Urgent scenarios must be clearly labeled as simulation. Never initiate an actual emergency call, government message or external referral from a fixture. Show distinct created, sent, acknowledged, assigned, in-progress, handed-off, failed and closed states supplied by contracts. Keep Haven's conversation available during the simulated handoff; never imply help arrived merely because a timer elapsed.

## Privacy, accessibility and app behaviour

- Treat journal privacy as a data boundary. Private entries must not appear in counselor mock responses. Do not silently analyze a private entry. Any proposed emergency exception must be explicit in the agreed contract rather than inferred in a component.
- Keep records synthetic; no real case data, credentials or API secrets in source, fixtures, browser logs or screenshots.
- Build responsive layouts for narrow phones through desktop. Prevent the on-screen keyboard from covering chat controls.
- Use semantic controls, visible keyboard focus, descriptive labels, sufficient contrast, comfortable touch targets and logical focus restoration in dialogs.
- Keep urgent actions available without relying on color, sound, animation or the avatar alone.
- Use translated interface resources and locale-aware dates. Allow text expansion; preserve original content alongside translations where relevant.
- Progressive Web App (PWA) support should cache the app shell and approved resources selectively. Do not cache sensitive API responses by default or assume browser storage provides privacy.
- Distinguish offline drafts from successfully saved server records. Do not reload an active conversation automatically to install an update.

## Definition of done

- The requested journey works through the mock API boundary with meaningful actions and consistent state.
- Loading, empty, success, error, offline and applicable restricted states are implemented.
- Check phone and desktop layouts, keyboard navigation, transcript overflow and reduced-motion behaviour.
- Run the app's available typecheck, lint and build scripts. Use focused tests for substantive interactions, such as booking state, journal sharing and voice-mode switching; do not invent scripts that are not configured.
- Inspect the result in a browser when tooling is available. Report any unverified visual or integration behaviour honestly.
- Handoff lists changed screens, verification, shared-contract impacts and remaining simulated services.


## Shared foundation and daily team workflow

Before feature work proceeds in parallel, one nominated integration owner scaffolds the pnpm workspace, both Vite application shells, shared theme tokens, routing entry points, contracts, API client and mock fixtures in one foundation pull request. Other contributors may prepare component designs while this is underway, but must not create competing scaffolds. Merge that foundation first; everyone then starts feature branches from the same main branch.

The workspace, both application shells, shared packages, initial synthetic handlers and checks are now implemented. Run the existing foundation rather than creating a new scaffold. Feature areas beyond the README's working examples remain to be implemented.

Each teammate uses their own clone. Person 1 owns apps/victim; Person 2 owns apps/professional/src/features/counselor; Person 3 owns apps/professional/src/features/authorities. Name one of the three as integration owner for shared files; this does not require a fourth person.

For each task: update main with git pull --ff-only, create a short-lived feature branch, implement the assigned scope, run configured checks, commit explicit files, push the branch and open a pull request. Have another teammate review before merging. Update main again before starting the next task. Do not commit directly to main, force-push shared branches, or overwrite another person's changes.

Coordinate changes to packages, root configuration, dependency versions, the shared lockfile and the professional shell. Request shared contract changes before implementing inconsistent local substitutes. State which workspace and files may be edited when assigning work to an AI assistant, and explicitly ask it to read the corresponding AGENTS.md.

These scoped AGENTS.md files do not automatically govern packages/ or repository-root edits. For foundation or shared work, explicitly read both instruction files and follow their common stack and contract conventions.
