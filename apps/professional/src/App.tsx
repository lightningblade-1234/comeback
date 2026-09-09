import {useState} from 'react';
import {NavLink,Navigate,useLocation,useNavigate,useRoutes} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {DemoRole} from '@haven/contracts';
import {SessionContext} from './session';
import {counselorRoutes} from './features/counselor/routes';
import {createAuthorityRoutes} from './features/authorities/routes';
import {DistrictSidebar} from './features/authorities/DistrictSidebar';
import {StateSidebar} from './features/authorities/StateSidebar';
import {NationalSidebar} from './features/authorities/NationalSidebar';
const destinations={counselor:'/counselor',district:'/authorities/district',state:'/authorities/state',national:'/authorities/national'} as const;
type ProfessionalRole=keyof typeof destinations;
export function App(){
 const [role,setRole]=useState<ProfessionalRole>('counselor');
 const [sidebarOpen,setSidebarOpen]=useState(true);
 const navigate=useNavigate(),location=useLocation(),client=useQueryClient();
 const isAuthorityLanding=location.pathname==='/authorities'||location.pathname==='/authorities/';
 const isAuthorityWorkspace=location.pathname.startsWith('/authorities/');
 const hasAuthoritySidebar=isAuthorityWorkspace&&!isAuthorityLanding&&(role==='district'||role==='state'||role==='national');
 const shellBase=isAuthorityLanding?'app-shell app-shell-landing':role==='district'?'app-shell app-shell-district':role==='state'?'app-shell app-shell-state':role==='national'?'app-shell app-shell-national':'app-shell';
 const shellClass=shellBase+(hasAuthoritySidebar&&!sidebarOpen?' sidebar-collapsed':'');
 function changeRole(value:string){const next=DemoRole.parse(value);if(next==='victim')return;client.clear();setSidebarOpen(true);setRole(next);navigate(destinations[next]);}
 const routes=useRoutes([{path:'/',element:<Navigate to="/authorities" replace/>},...counselorRoutes,...createAuthorityRoutes(changeRole),{path:'*',element:<section className="panel"><h1>Page not found</h1><p>Choose a workspace from the navigation.</p></section>}]);
 const authoritySidebar=hasAuthoritySidebar?(role==='district'?<DistrictSidebar collapsed={!sidebarOpen} onToggle={()=>setSidebarOpen(open=>!open)}/>:role==='state'?<StateSidebar collapsed={!sidebarOpen} onToggle={()=>setSidebarOpen(open=>!open)}/>:<NationalSidebar collapsed={!sidebarOpen} onToggle={()=>setSidebarOpen(open=>!open)}/>):null;
 return <SessionContext.Provider value={role}><a className="skip" href="#main">Skip to content</a><div className={shellClass}>{!isAuthorityLanding&&(authoritySidebar??<aside className="sidebar"><div className="brand">haven<span style={{color:'var(--accent)'}}>.</span></div><p className="muted">Counselor workspace</p><nav aria-label="Workspace navigation"><NavLink end to="/counselor">Counselor queue</NavLink></nav><button className="sidebar-logout" type="button" disabled title="Authentication is not connected in this demo">Logout</button></aside>)}<main className={isAuthorityLanding?'main authority-landing-main':isAuthorityWorkspace?'main authority-workspace-main':'main'} id="main"><div className="demo-banner">Development demo � Synthetic records � No external alerts are sent</div>{routes}</main></div></SessionContext.Provider>;
}