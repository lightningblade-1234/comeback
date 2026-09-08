import {NavLink,Route,Routes,Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {statusLabel} from '@haven/contracts';
import {Panel,Button,Badge,Loading,ErrorState} from '@haven/ui';

function Home(){
 const q=useQuery({queryKey:queryKeys.victim,queryFn:api.victimHome});
 if(q.isPending)return <Loading/>;
 if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 const data=q.data;
 return <><div className="eyebrow">Your space, at your pace</div><h1>Welcome back, {data.case.preferredName}</h1><p className="muted">Your appointments and support, together in one place.</p>
 <Panel title="A little room to breathe"><p>You can take things one step at a time.</p><Button asChild><Link to="/support">View my support</Link></Button></Panel>
 <div className="grid"><Panel title="Your next conversation"><Badge>{data.appointment.mode.toLowerCase()}</Badge><p>{data.appointment.counselorName}</p><p className="muted">{new Date(data.appointment.startsAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'})} IST</p></Panel>
 <Panel title="Support in progress">{data.support.map(item=><div key={item.id}><p>{item.title}</p><Badge>{statusLabel(item.status)}</Badge></div>)}</Panel></div>
 <Panel title="Your case"><p>{data.case.docket} · {data.case.stage}</p><p className="muted">{data.case.district}, {data.case.state}</p></Panel></>;
}
function NextFeature({title,description}:{title:string;description:string}){return <><div className="eyebrow">Frontend foundation</div><h1>{title}</h1><Panel><p>{description}</p><p className="muted">This feature is assigned to the victim frontend developer. It is not connected yet.</p><Button asChild><Link to="/">Back to Home</Link></Button></Panel></>;}
export function App(){
 const {t}=useTranslation();
 return <><a className="skip" href="#main">Skip to content</a><div className="app-shell"><aside className="sidebar"><div className="brand">haven<span style={{color:'var(--accent)'}}>.</span></div><p className="muted">A space for you</p><nav aria-label="Main navigation">{[['/','home'],['/talk','talk'],['/support','support'],['/journal','journal'],['/more','more']].map(([path,label])=><NavLink end={path==='/'} key={path} to={path}>{t(label)}</NavLink>)}</nav></aside><main id="main" className="main"><div className="demo-banner">Development demo · Synthetic records · No live counseling or emergency connection</div><Routes><Route path="/" element={<Home/>}/><Route path="/support" element={<Home/>}/><Route path="/talk" element={<NextFeature title="Talk to Haven" description="Text, live voice and the fixed Haven companion will share one conversation here."/>}/><Route path="/journal" element={<NextFeature title="My Journal" description="Private reflections, draft saving and explicit counselor-sharing controls will live here."/>}/><Route path="/more" element={<NextFeature title="More support" description="Resources, My Case, Shared Support and preferences are planned for this area."/>}/><Route path="*" element={<NextFeature title="Page not found" description="This address does not match a page in the foundation."/>}/></Routes></main></div></>;
}

