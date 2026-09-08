# NHAA Victim Experience — Simple Design Specification

## Document purpose

This document defines the victim-facing side of the redesigned Haven product. It describes what the victim sees and can do. It is a product and interface plan, not an implementation specification for the analytical engine, counselor portal, authority portal, databases, integrations or infrastructure.

The previous Haven and `campus-well-link` interfaces may be used as visual and interaction references. Their student-oriented terminology, analytics, risk displays and community behaviour are not carried into the new product.

## Product goal

The victim experience should help an adult victim or complainant:

- Talk about their situation through text or voice.
- Receive calm, practical guidance rather than a simple acknowledgement.
- Remain connected while urgent help is arranged.
- Reach a counselor and request other forms of assistance.
- Understand upcoming case and support activity.
- Record private reflections and complete short check-ins.
- Access relevant self-help, legal, protection, financial and rehabilitation resources.
- Optionally receive safe peer or mentor support.

The interface should feel like a protected support space, not a hospital dashboard, government case-management system or social network.

## Product format

The victim experience will be delivered as a responsive web application that works on phones, tablets and computers. It should also be installable as a Progressive Web App so it can behave like an app without requiring separate website and mobile-app designs.

The experience must support:

- Touch, keyboard and assistive-technology navigation.
- Multiple languages.
- Captions and text alternatives for voice interactions.
- Reduced-motion and avatar-free modes.
- A low-data mode with a static image instead of the 3D character.
- Offline access to selected resources and unfinished journal drafts where technically safe.

Urgent alerts, live conversations and other actions requiring a live connection must clearly show when the device is offline.

## Primary navigation

The mobile interface should have five main destinations:

1. **Home** — the victim's immediate priorities and recent activity.
2. **Talk** — Haven text and voice conversations.
3. **My Support** — counseling, check-ins, support plans and requests.
4. **Journal** — private reflection and optional sharing.
5. **More** — My Case, Shared Support, Resources, Profile, accessibility and privacy information.

Desktop navigation may show these destinations in a sidebar, while preserving the same structure and terminology.

## 1. Home — “Today”

Home should answer: “What matters to me today, and where can I get help?”

It should contain:

- A simple emotional check-in.
- A prominent **Talk to Haven** action.
- The next counseling session.
- The next known hearing, scheduled call or case event.
- Active assistance requests and their current status.
- A small number of useful next actions.
- A calm but permanently accessible **Urgent Help** action.
- Notice when a counselor or authorized official is attempting to contact the victim.

The victim will not see a distress probability, internal risk classification, confidence percentage, diagnostic label, wellness score, streak or achievement badge. Those values could be misleading or distressing. Counselors receive the professional classification; victims receive understandable support, explanations and next steps.

## 2. Talk — Haven conversation

Talk is the central feature of the victim experience.

### Conversation modes

The victim can use:

- Text chat.
- Live speech-to-speech conversation.
- A hybrid mode in which text and voice can be used interchangeably.

Switching modes must not start a new conversation or lose context. During voice interaction, a live transcript remains visible so the victim can read, verify and correct what the system understood.

The victim must always be able to:

- Stop the microphone immediately.
- Interrupt Haven while it is speaking.
- Mute or replay Haven's voice.
- Correct the transcript.
- Change the conversation language.
- Slow down the voice.
- Hide the 3D companion.
- Request a counselor.
- Leave and resume the conversation later.

Haven should ask useful follow-up questions, help the victim explain what is happening, offer practical next steps and continue engaging during a crisis. It must not diagnose, pretend to be a human counselor or claim that an external action succeeded before confirmation is received.

### Urgent-risk experience

When the engine identifies definite evidence of immediate danger and initiates the approved emergency workflow, Haven does not end the conversation. The interface changes into a focused support state that shows:

- That urgent help is being contacted.
- Who has been contacted, when that information is available.
- Whether the alert has been sent, acknowledged or is awaiting acknowledgement.
- Immediate, practical instructions for the victim.
- Direct-call options.
- Continued access to Haven through text or voice while help is arranged.

The alert and instructions must appear without waiting for 3D animation or speech generation.

## 3. Fixed 3D Haven persona

Haven has one consistent visual identity and personality across sessions, languages and devices. The character is an AI support companion, not a virtual human counselor.

### Visual identity

Haven should be:

- A softly stylized adult rather than a photorealistic person.
- Warm, recognizable and culturally appropriate for the Indian context.
- Dressed in simple everyday clothing without a medical coat, police uniform or government insignia.
- Usually presented from the upper body in a calm, uncluttered environment.
- Animated with restrained eye movement, breathing and gestures.

Haven remains optional. Every function must work with the avatar hidden or replaced by a static image.

### Personality

Haven is calm, patient, practical, respectful, non-judgmental and honest about being an AI. It never claims personal experience or says it knows exactly how the victim feels.

### Approved emotional range

Haven may use these controlled presentation states:

- **Calm presence** for waiting and ordinary conversation.
- **Attentive** while listening.
- **Warm encouragement** when recognizing a constructive step.
- **Gentle reassurance** when the victim is afraid or overwhelmed.
- **Serious attention** for severe distress, threats or self-harm disclosures.
- **Focused action** while an urgent handoff or alert is taking place.
- **Clarification** when the system needs more information.
- **Reassuring resolution** after support is successfully connected.

Serious attention is neutral and steady, not visibly sad or frightened. During a crisis Haven stops casual movement, removes any smile and speaks clearly and calmly.

Haven never displays anger, fear, panic, disgust, crying, despair, exaggerated shock or forced excitement. It does not automatically copy an emotion inferred from the victim's face or voice. A controlled presentation service—not an unrestricted model instruction—selects the approved animation and voice state.

## 4. Journal

The journal provides a private place for text or voice reflection. It should support:

- Free writing and optional gentle prompts.
- Voice entries with retained audio and transcript where permitted.
- Draft saving, search, tags and chronological history.
- Clear information about how an entry is analysed.
- Per-entry visibility choices such as **Private**, **Use in my check-ins** and **Share with my counselor**.

Prompts should not pressure the victim to repeat details of the atrocity. They can focus on current safety, sleep, court-related stress, financial difficulty, social support, daily functioning and what would help today.

## 5. My Support

My Support combines the victim's human and practical support activity:

- Book, reschedule or cancel counseling sessions.
- Select text, voice, video or in-person session formats where available.
- View counselor language, relevant experience and availability.
- Complete assigned or scheduled check-ins.
- Review a plain-language personal support plan.
- Request counseling, medical, protection, relocation, financial, rehabilitation or legal assistance.
- Track whether a request is submitted, assigned, in progress or completed.
- View follow-up tasks and messages from a counselor.

Urgent assistance must have a separate path and must not be represented as an ordinary future appointment.

## 6. My Case

My Case is a victim-friendly view of the context imported from the NHAA source record. It does not replace or silently modify the official record.

It should show:

- A simple case timeline.
- Current stage and known upcoming events.
- Assigned contacts.
- Assistance already provided.
- Pending support or compensation activity.
- A plain-language “What Haven knows about my situation” view.
- A way to report possible errors for human review.

Only information appropriate for the victim should be displayed. Internal authority notes, protected identities or operational risk information must not be exposed through this view.

## 7. Resources

The resource library keeps the existing card, search and guided-activity concepts but expands beyond general wellness material. Categories should include:

- Immediate emotional support and grounding.
- Stress, sleep and daily functioning.
- Counseling and medical support.
- Understanding investigation and trial processes.
- Legal aid.
- Safety and witness-protection information.
- Financial and compensation assistance.
- Relocation and rehabilitation support.
- Preparing for court appearances.
- Supporting family members.

Personalized recommendations should include a simple “Recommended because…” explanation. Important resources should be available in the victim's chosen language and downloadable for low-connectivity situations.

## 8. Shared Support

The previous general community feature is replaced by an optional, protected area called **Shared Support**. It is disabled until the victim chooses to join.

### Peer Circles

Peer Circles are moderated, pseudonymous discussion spaces organized around broad support needs such as court-related stress, rebuilding daily life or dealing with social isolation.

They do not provide public follower counts, popularity rankings or “trending” trauma. Users cannot post docket numbers, addresses, witness identities or identifiable case evidence. Reporting, blocking and leaving must be simple.

### Mentor Connect

Mentor Connect allows a victim to request support from a trained and supervised peer mentor with relevant lived experience. “Recovered victim” is not used as a qualification because recovery is not a permanent or binary state.

The initial process is:

1. The victim voluntarily requests a mentor.
2. The system considers language, support needs and stated preferences.
3. A human coordinator approves the match.
4. Communication happens inside the platform without revealing personal contact information.
5. The mentor can request supervisor assistance or initiate an appropriate escalation.
6. Either participant can end the connection.

Unrestricted user search and direct messaging are not included in the first version. Other participants see a pseudonym; the platform may retain the account-to-docket association for safety and moderation.

## 9. Safety, privacy and control

The victim interface must clearly explain:

- That Haven is an AI system.
- What conversations, audio and journal content are analysed.
- What information may be visible to a counselor.
- What type of definite evidence can initiate an urgent alert.
- The difference between an AI recommendation and a confirmed human action.
- How to report a harmful response, inaccurate translation or transcription error.

The design should also include a quick-exit control, discreet notification options, language and accessibility preferences, and clear online/offline status.

## Reuse from the previous Haven interfaces

The following may be reused as wireframes or visual building blocks:

- Conversation layout, composer and previous-chat list.
- Journal editor and entry-history layout.
- Three-step counseling-booking flow.
- Resource cards, search and guided activities.
- Responsive navigation, cards, dialogs and theme primitives.

The following should be discarded or fundamentally redesigned:

- Student terminology and student authentication flow.
- Wellness scores, streaks, achievements and gamified progress.
- Victim-visible risk classification and confidence percentages.
- Generic AI-insight cards that make unsupported health claims.
- The open social-network community, user search and unrestricted messaging model.
- Hard-coded counselors, appointments and resource data.
- Browser-only storage as the permanent journal or identity store.

The `campus-well-link` fork remains a donor/reference project, not a second application to preserve or integrate as a runtime dependency.

## Agreed design position

The victim side is a calm support portal centered on a hybrid conversation with one recognizable Haven persona. It connects AI guidance, human counseling, case-aware assistance, journaling, practical resources and carefully governed peer support without exposing the victim to internal risk analytics.

## Reference basis

- World Health Organization, [Ethics and governance of artificial intelligence for health](https://www.who.int/publications/i/item/9789240029200) — supports transparency, human autonomy, safety and human oversight.
- World Health Organization, [Safe and ethical AI for health](https://www.who.int/news/item/16-05-2023-who-calls-for-safe-and-ethical-ai-for-health) — identifies risks from authoritative-sounding but incorrect health-related LLM responses and the need for expert supervision and evaluation.
- SAMHSA, [Core Competencies for Peer Workers in Behavioral Health Services](https://www.samhsa.gov/substance-use/recovery/peer-support-workers/core-competencies) — supports voluntary, trauma-informed peer relationships, defined competencies, training and supervision.
- W3C, [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) — supports text alternatives, accessible controls and the ability to reduce or disable unnecessary motion.
