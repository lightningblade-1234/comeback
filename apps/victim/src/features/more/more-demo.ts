export type AssistanceStatus='APPOINTMENT_CONFIRMED'|'UNDER_REVIEW'|'PROVIDED'|'REQUESTED';

export interface AssistanceItem {
 id:string;
 title:string;
 status:AssistanceStatus;
 next:string;
 contact:string;
 history:{date:string;title:string;detail:string}[];
 actions:string[];
}

export const assistanceItems:AssistanceItem[]=[
 {id:'counseling',title:'Counseling',status:'APPOINTMENT_CONFIRMED',next:'11 September, 3 PM',contact:'Meera Shah · Fictional example counselor',history:[{date:'7 September',title:'Appointment confirmed',detail:'A counseling conversation is scheduled for 11 September at 3 PM.'}],actions:['View appointment','Request a different time']},
 {id:'financial',title:'Financial assistance',status:'UNDER_REVIEW',next:'No decision date recorded',contact:'District support officer · Fictional example contact',history:[{date:'9 September',title:'Request under review',detail:'The source record shows that this request is being reviewed.'},{date:'6 September',title:'Request recorded',detail:'Your request was added to the support record.'}],actions:['Review request','Suggest a correction']},
 {id:'accommodation',title:'Temporary accommodation',status:'PROVIDED',next:'Contact your support officer if your needs change',contact:'District support officer · Fictional example contact',history:[{date:'5 September',title:'Accommodation provided',detail:'Accommodation support was recorded as provided.'}],actions:['Review support details','Report a change']},
 {id:'legal',title:'Legal assistance',status:'REQUESTED',next:'Awaiting assignment',contact:'No assigned contact recorded',history:[{date:'4 September',title:'Legal assistance requested',detail:'A request for legal assistance is recorded. No assignment is listed yet.'}],actions:['Review request','Request contact']},
];

export const caseTimeline=[
 {id:'financial',date:'9 September',title:'Financial assistance request under review',detail:'The source record shows that your request is being reviewed.',source:'NHAA record'},
 {id:'counseling',date:'7 September',title:'Counseling appointment confirmed',detail:'Your session is scheduled for 11 September.',source:'NHAA record'},
 {id:'accommodation',date:'5 September',title:'Temporary accommodation provided',detail:'Accommodation support was recorded as provided.',source:'NHAA record'},
 {id:'complaint',date:'3 September',title:'Complaint registered',detail:'Your complaint was registered and assigned a docket number.',source:'NHAA record'},
 {id:'preferences',date:'2 September',title:'Support preferences recorded',detail:'Your preferred language and contact preferences were added to this sample record.',source:'You told Haven'},
];

export const caseContacts=[
 {id:'district',role:'District support officer',name:'Anita Rao · Fictional example contact',description:'For case updates and assistance requests',actions:['Contact','View contact details']},
 {id:'counselor',role:'Counselor',name:'Meera Shah · Fictional example contact',description:'For emotional support and your scheduled sessions',actions:['View appointment','Request contact']},
];

export const havenFacts=[
 {id:'language',detail:'You prefer conversations in Hindi.',source:'You told Haven',date:'8 September'},
 {id:'accommodation',detail:'Temporary accommodation has been provided.',source:'NHAA record',date:'5 September'},
 {id:'financial-stress',detail:'You said that waiting for financial assistance is causing you stress.',source:'You told Haven',date:'8 September'},
];

export const resources=[
 {id:'legal',title:'Understanding your case process',category:'Legal',description:'Plain-language guidance for hearings, records and asking questions.'},
 {id:'protection',title:'Safety and protection planning',category:'Protection',description:'Practical steps you can consider with a person you trust.'},
 {id:'financial',title:'Financial and rehabilitation support',category:'Practical support',description:'A calm overview of assistance routes and what to ask for.'},
 {id:'health',title:'Medical care and wellbeing',category:'Health',description:'Guidance for seeking care and describing what you need.'},
];

export const selfCareOptions=[
 {id:'grounding',title:'A two-minute grounding pause',description:'Notice five things around you, then choose one small next step.'},
 {id:'prepare',title:'Prepare for a difficult call',description:'Write down what you need, who you want with you, and when to pause.'},
 {id:'rest',title:'Make room to rest',description:'Choose one gentle activity that does not require you to solve everything today.'},
];
