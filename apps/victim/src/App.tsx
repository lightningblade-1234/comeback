import {NavLink,Route,Routes,Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useQuery} from '@tanstack/react-query';
import {api,queryKeys} from '@haven/api-client';
import {statusLabel} from '@haven/contracts';
import {Panel,Button,Badge,Loading,ErrorState} from '@haven/ui';
import {LandingPage} from './features/landing/LandingPage';
import {PersonalCare} from './features/talk/PersonalCare';
import {Journal} from './features/journal/Journal';
import {Support} from './features/support/Support';
import {Resources} from './features/resources/Resources';
import './victim.css';

function Home(){
 const q=useQuery({queryKey:queryKeys.victim,queryFn:api.victimHome});
 if(q.isPending)return <Loading/>;
 if(q.isError)return <ErrorState message={q.error.message} onRetry={()=>void q.refetch()}/>;
 const data=q.data;
 return <div className="victim-page"><div className="victim-page__heading"><div><div className="eyebrow">Your space, at your pace</div><h1>Welcome back, {data.case.preferredName}</h1><p className="muted">Your appointments and support, together in one place.</p></div><span className="status-pill">● Private demo</span></div><Panel title="A little room to breathe"><p>You can take things one step at a time.</p><Button asChild><Link to="/talk">Talk to Haven</Link></Button></Panel><div className="grid"><Panel title="Your next conversation"><Badge>{data.appointment.mode.toLowerCase()}</Badge><p>{data.appointment.counselorName}</p><p className="muted">{new Date(data.appointment.startsAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'})} IST</p></Panel><Panel title="Support in progress">{data.support.map(item=><div key={item.id}><p>{item.title}</p><Badge>{statusLabel(item.status)}</Badge></div>)}</Panel></div><Panel title="Your case"><p>{data.case.docket} · {data.case.stage}</p><p className="muted">{data.case.district}, {data.case.state}</p></Panel></div>;
}

function VictimWorkspace(){
 const {t}=useTranslation();
 return <><a className="skip" href="#main">Skip to content</a><div className="victim-workspace"><div className="app-shell"><aside className="sidebar"><div className="brand">haven<span style={{color:'var(--accent)'}}>.</span></div><p className="muted">A space for you</p><nav aria-label="Main navigation">{[['/home','home'],['/talk','talk'],['/support','support'],['/journal','journal'],['/more','more']].map(([path,label])=><NavLink end={path==='/home'} key={path} to={path}>{t(label)}</NavLink>)}</nav><div className="victim-sidebar-note">Synthetic demo<br/><span>No live emergency connection</span></div></aside><main id="main" className="main"><div className="demo-banner">Development demo · Synthetic records · No live counseling or emergency connection</div><Routes><Route path="/home" element={<Home/>}/><Route path="/talk" element={<PersonalCare/>}/><Route path="/support" element={<Support/>}/><Route path="/journal" element={<Journal/>}/><Route path="/more" element={<Resources/>}/><Route path="*" element={<Home/>}/></Routes></main></div></div></>;
}

export function App(){return <Routes><Route path="/" element={<LandingPage/>}/><Route path="/*" element={<VictimWorkspace/>}/></Routes>}
