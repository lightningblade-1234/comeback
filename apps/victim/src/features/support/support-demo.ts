export type SupportFormat = 'TEXT' | 'VOICE' | 'VIDEO' | 'IN_PERSON';

export type DemoSupportStatus = 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface DemoCounselor {
  id: string;
  name: string;
  role: string;
  languages: string[];
  experience: string;
  availability: string;
  formats: SupportFormat[];
}

export interface DemoSupportPlan {
  summary: string;
  goals: string[];
  nextSteps: string[];
  contacts: string[];
  reviewDate: string;
}

export interface DemoFollowUpTask {
  id: string;
  title: string;
  due: string;
  owner: string;
  status: 'OPEN' | 'DONE';
}

export interface DemoCounselorMessage {
  id: string;
  subject: string;
  preview: string;
  sentAt: string;
  unread: boolean;
}

export const counselorProfiles: DemoCounselor[] = [
  {
    id: 'demo-counselor-001',
    name: 'Demo Counselor',
    role: 'Trauma-informed counselor',
    languages: ['English', 'Hindi', 'Marathi'],
    experience: 'Supports people navigating case-related stress and recovery.',
    availability: 'Next available tomorrow',
    formats: ['VOICE', 'VIDEO', 'TEXT'],
  },
  {
    id: 'demo-counselor-002',
    name: 'Asha Mehta',
    role: 'Community support counselor',
    languages: ['English', 'Hindi'],
    experience: 'Helps with practical coping, safety planning and referrals.',
    availability: 'Next available this week',
    formats: ['TEXT', 'VOICE', 'IN_PERSON'],
  },
];

export const sampleSupportPlan: DemoSupportPlan = {
  summary: 'A short, practical plan you can revisit when the next step feels difficult.',
  goals: ['Feel safer during case-related contact', 'Keep one steady support conversation each week'],
  nextSteps: ['Review the safety contacts before the next hearing', 'Bring questions to the next counseling session'],
  contacts: ['Your counselor', 'Haven support companion', 'Trusted person you choose'],
  reviewDate: '2026-09-18T05:30:00.000Z',
};

export const scheduledCheckIn = {
  title: 'Before your next hearing',
  prompt: 'Would you like to check in about how prepared and supported you feel?',
  scheduledFor: '2026-09-11T05:30:00.000Z',
  options: ['I feel prepared', 'I could use support', 'I am not sure yet'],
};

export const followUpTasks: DemoFollowUpTask[] = [
  {
    id: 'demo-follow-up-001',
    title: 'Review your safety contacts',
    due: '2026-09-10T05:30:00.000Z',
    owner: 'You',
    status: 'OPEN',
  },
  {
    id: 'demo-follow-up-002',
    title: 'Bring questions to counseling',
    due: '2026-09-10T05:30:00.000Z',
    owner: 'You and your counselor',
    status: 'OPEN',
  },
];

export const counselorMessages: DemoCounselorMessage[] = [
  {
    id: 'demo-message-001',
    subject: 'A note before your next session',
    preview: 'You can bring anything that feels important. There is no need to prepare perfectly.',
    sentAt: '2026-09-08T09:05:00.000Z',
    unread: true,
  },
];

export const assistanceOptions = [
  'COUNSELING',
  'MEDICAL',
  'PROTECTION',
  'RELOCATION',
  'FINANCIAL',
  'REHABILITATION',
  'LEGAL',
] as const;

export const supportFormats: SupportFormat[] = ['TEXT', 'VOICE', 'VIDEO', 'IN_PERSON'];

export const sampleTimeSlots: Record<SupportFormat, string[]> = {
  TEXT: ['Tomorrow · 11:00 AM', 'Tomorrow · 3:00 PM'],
  VOICE: ['Tomorrow · 10:00 AM', 'Thursday · 4:00 PM'],
  VIDEO: ['Friday · 11:30 AM'],
  IN_PERSON: ['Friday · 2:00 PM'],
};
