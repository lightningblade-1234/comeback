import {useState} from 'react';
import {NavLink,Navigate,useNavigate,useRoutes} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {DemoRole} from '@haven/contracts';
import {SessionContext} from './session';
import {counselorRoutes} from './features/counselor/routes';
import {authorityRoutes} from './features/authorities/routes';
const destinations={counselor:'/counselor',district:'/authorities/district',state:'/authorities/state',national:'/authorities/national'} as const;
type ProfessionalRole=keyof typeof destinations;
export function App(){
 const [role,setRole]=useState<ProfessionalRole>('counselor');
 const navigate=useNavigate();const client=useQueryClient();const {t}=useTranslation();
 const routes=useRoutes([{path:'/',element:<Navigate to={destinations[role]} replace/>},...counselorRoutes,...authorityRoutes,{path:'*',element:<section className="panel"><h1>Page not found</h1><p>Choose a workspace from the navigation.</p></section>}]);
 function changeRole(value:string){const next=DemoRole.parse(value);if(next==='victim')return;client.clear();setRole(next);navigate(destinations[next]);}
 return <SessionContext.Provider value={role}><a className="skip" href="#main">Skip to content</a><div className="app-shell"><aside className="sidebar"><div className="brand">haven<span style={{color:'var(--accent)'}}>.</span></div><p className="muted">Professional workspace</p><nav aria-label="Workspace navigation"><NavLink to={destinations[role]} end>{t(role)}</NavLink>{role==='counselor'&&(<>
 <NavLink to="/counselor/appointments">Appointments</NavLink>
 <NavLink to="/counselor/supervision">Supervision</NavLink>
</>)}</nav><label className="role-picker">Development role preview<select value={role} onChange={e=>changeRole(e.target.value)}>{Object.keys(destinations).map(key=><option value={key} key={key}>{t(key)}</option>)}</select></label><p className="muted">Demo access only. No authenticated session.</p></aside><main className="main" id="main"><div className="demo-banner">Development demo · Synthetic records · No external alerts are sent</div>{routes}</main></div></SessionContext.Provider>;
}


