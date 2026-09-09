export type WorkspaceRole='counselor'|'district'|'state'|'national';
type WorkspaceIcon='counselor'|'district'|'state'|'national';

const levels:{name:string;scope:string;description:string;role:WorkspaceRole;icon:WorkspaceIcon;label:string}[]=[
 {name:'Counselor',scope:'Care workspace',description:'Review assigned support work and current evidence.',role:'counselor',icon:'counselor',label:'Assigned care work'},
 {name:'District authority',scope:'District operations',description:'Review local alerts, intervention tasks, ownership and response status.',role:'district',icon:'district',label:'Local response signals'},
 {name:'State authority',scope:'State monitoring',description:'Compare district coverage, open work and resource pressures at state scope.',role:'state',icon:'state',label:'Cross-district visibility'},
 {name:'National authority',scope:'National monitoring',description:'Monitor aggregate demand, delivery signals and systemic service gaps.',role:'national',icon:'national',label:'National operating picture'},
];

function WorkspaceGlyph({name}:{name:WorkspaceIcon}){
 const paths={
  counselor:'M20 20v-1.4a4.6 4.6 0 0 0-4.6-4.6H8.6A4.6 4.6 0 0 0 4 18.6V20m8.2-8.9a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6m6.1-7.1a3.5 3.5 0 0 1 0 6.8',
  district:'M4 19.5V8.2L12 4l8 4.2v11.3M8 19.5v-5h8v5M9 9.5h.01M15 9.5h.01',
  state:'M4 19.5h16M6 17V9m6 8V5m6 12v-5',
  national:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm-7.8 6h15.6M4.2 14.5h15.6M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5Z',
 } as const;
 return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg>;
}

function HavenMark(){return <svg aria-hidden="true" viewBox="0 0 32 32"><path fill="currentColor" d="M16 29C7 23 3 18 3 11.7A6.7 6.7 0 0 1 15.3 8L16 9l.7-1A6.7 6.7 0 0 1 29 11.7C29 18 25 23 16 29Z"/><path fill="#f5fbff" d="M16 4v10M8 8l8 6 8-6"/></svg>;}

export function AuthorityLanding({onSelect}:{onSelect:(role:WorkspaceRole)=>void}){
 return <section className="authority-landing">
  <div className="authority-landing-topbar"><div className="authority-landing-brand"><span className="authority-landing-brand__mark"><HavenMark/></span><span><strong>haven<span>.</span></strong><small>NHAA professional portal</small></span></div><span className="authority-environment"><i aria-hidden="true"/>Synthetic demo</span></div>
  <div className="authority-hero">
   <header className="authority-page-intro"><p className="authority-hero__eyebrow"><span>01</span>Workspace selection</p><h1>Select your operational view.</h1><p className="muted">Choose the scope that matches your authorized role. Each workspace opens with role-filtered synthetic data, designed for focused operational review.</p></header>
   <aside className="authority-hero-summary" aria-label="Workspace environment summary"><div className="authority-hero-summary__visual"><span/><span/><span/><WorkspaceGlyph name="national"/></div><div><p className="eyebrow">One connected view</p><h2>Care intelligence, in context.</h2><p>Move from assigned care work to aggregate programme signals without losing the operational boundary.</p></div><div className="authority-hero-summary__meta"><span><strong>04</strong>scopes</span><span><strong>100%</strong>synthetic</span></div></aside>
  </div>
  <div className="authority-selector" aria-label="Choose a professional workspace">
   {levels.map((level,index)=><button className={'authority-level-tab authority-level-tab--'+level.role} key={level.role} type="button" onClick={()=>onSelect(level.role)}>
    <div className="authority-card__top"><span className="authority-card__index">0{index+1}</span><span className="authority-card__scope">{level.scope}</span><span className="authority-card__arrow" aria-hidden="true">↗</span></div>
    <span className="authority-card__icon"><WorkspaceGlyph name={level.icon}/></span><div className="authority-card__body"><h2>{level.name}</h2><p>{level.description}</p></div>
    <div className="authority-card__footer"><span className="authority-card__label">{level.label}</span><span className="authority-card__cta">Open workspace <span aria-hidden="true">→</span></span></div>
   </button>)}
  </div><footer className="authority-landing-footer"><span className="authority-landing-footer__icon" aria-hidden="true">✓</span><p><strong>Safe by design.</strong> Synthetic records only, with no external alerts or real-world provider actions.</p><span className="authority-landing-footer__tag">Demo boundary</span></footer>
 </section>;
}
