export type WorkspaceRole='counselor'|'district'|'state'|'national';

const levels:{name:string;scope:string;description:string;role:WorkspaceRole}[]=[
 {name:'Counselor',scope:'Care workspace',description:'Review assigned support work and current evidence.',role:'counselor'},
 {name:'District authority',scope:'District operations',description:'Review local alerts, intervention tasks, ownership and response status.',role:'district'},
 {name:'State authority',scope:'State monitoring',description:'Compare district coverage, open work and resource pressures at state scope.',role:'state'},
 {name:'National authority',scope:'National monitoring',description:'Monitor aggregate demand, delivery signals and systemic service gaps.',role:'national'},
];

export function AuthorityLanding({onSelect}:{onSelect:(role:WorkspaceRole)=>void}){
 return <section className="authority-landing">
  <header className="authority-page-intro"><p className="eyebrow">NHAA professional portal · Workspace selection</p><h1>Select your authority level</h1><p className="muted">Choose the operational scope that matches your authorized role. Each workspace uses role-filtered synthetic data and opens after you select a tab.</p></header>
  <div className="authority-selector" aria-label="Choose a professional workspace">
   {levels.map(level=><button className="authority-level-tab" key={level.role} type="button" onClick={()=>onSelect(level.role)}>
    <p className="eyebrow">{level.scope}</p><h2>{level.name}</h2><p>{level.description}</p><span>Open workspace <span aria-hidden="true">→</span></span>
   </button>)}
  </div>
 </section>;
}
