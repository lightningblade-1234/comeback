import {useEffect,useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {api,queryKeys} from '@haven/api-client';
import {Badge,Button,ErrorState,Loading,Panel} from '@haven/ui';
import {CalendarDays,CheckCircle2,ChevronRight,Clock3,HeartHandshake,Info,MessageCircle,PhoneCall,ShieldAlert,UserRound} from 'lucide-react';
import {DashboardLayout} from '../../legacy/components/DashboardLayout';
import './home.css';
import './home-overrides.css';

type EmotionalFeeling='STEADY'|'LOW'|'ANXIOUS'|'OVERWHELMED'|'UNSURE';
const feelingOptions:{value:EmotionalFeeling}[]=[{value:'STEADY'},{value:'LOW'},{value:'ANXIOUS'},{value:'OVERWHELMED'},{value:'UNSURE'}];

const assistanceLabels:Record<string,string>={CREATED:'Created',SENT:'Sent for review',ACKNOWLEDGED:'Acknowledged',ASSIGNED:'Assigned',IN_PROGRESS:'In progress',HANDED_OFF:'Handed off',FAILED:'Needs attention',CLOSED:'Closed'};
const actionRoutes:Record<string,string>={OPEN_TALK:'/talk',VIEW_SUPPORT:'/support',VIEW_CASE:'/more',OPEN_JOURNAL:'/journal',VIEW_RESOURCES:'/more'};
const demoCaseEvent={kind:'HEARING',title:'Next case hearing',startsAt:'2026-09-12T05:30:00.000Z',locationOrMode:'District court · Pune'};
const demoContactAttempt={from:'COUNSELOR',displayName:'Demo Counselor',status:'ATTEMPTING',attemptedAt:'2026-09-08T09:05:00.000Z'};

function dateTime(value:string,locale='en'){return new Intl.DateTimeFormat(locale==='en'?'en-IN':locale,{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'}).format(new Date(value))+' IST';}
function dateOnly(value:string,locale='en'){return new Intl.DateTimeFormat(locale==='en'?'en-IN':locale,{timeZone:'Asia/Kolkata',dateStyle:'full'}).format(new Date(value));}
function appointmentMode(value:string){return value.toLowerCase().replace('_',' ');}
async function loadVictimHome(){
 try{return await api.victimHome();}
 catch(error){if(error instanceof SyntaxError)throw new Error('The demo service is still connecting. Please try again in a moment.');throw error;}
}

function UrgentHelpDialog({open,onClose}:{open:boolean;onClose:()=>void}){
 const {t}=useTranslation();
 const closeButton=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  closeButton.current?.focus();
  const handleKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
  window.addEventListener('keydown',handleKeyDown);
  return ()=>window.removeEventListener('keydown',handleKeyDown);
 },[open,onClose]);
 if(!open)return null;
 return <div className="victim-urgent-layer" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
  <section className="victim-urgent-dialog" role="dialog" aria-modal="true" aria-labelledby="urgent-help-title">
   <div className="victim-urgent-dialog__icon" aria-hidden="true"><ShieldAlert/></div>
   <div className="victim-urgent-dialog__heading"><div><div className="eyebrow">{t('homePage.urgentEyebrow')}</div><h2 id="urgent-help-title">{t('homePage.urgentTitle')}</h2></div><button ref={closeButton} className="victim-urgent-dialog__close" onClick={onClose} aria-label={t('homePage.closeUrgent')}>×</button></div>
   <p>{t('homePage.urgentDescription')}</p>
   <div className="victim-urgent-dialog__notice"><Info size={18} aria-hidden="true"/><span>{t('homePage.urgentNotice')}</span></div>
   <div className="victim-urgent-dialog__actions"><Link className="button" to="/talk" onClick={onClose}><MessageCircle size={17}/> {t('homePage.talkNow')}</Link><Link className="button victim-button--outline" to="/support" onClick={onClose}>{t('homePage.urgentSupport')}</Link></div>
  </section>
 </div>;
}

export function HomePage(){
 const {t,i18n}=useTranslation();
 const navigate=useNavigate();
 const today=useQuery({queryKey:queryKeys.victim,queryFn:loadVictimHome});
 const [feeling,setFeeling]=useState<EmotionalFeeling|null>(null);
 const [lastCheckIn,setLastCheckIn]=useState<{feeling:EmotionalFeeling;submittedAt:string}|null>(null);
 const [checkInSaved,setCheckInSaved]=useState(false);
 const [urgentOpen,setUrgentOpen]=useState(false);
 const urgentTrigger=useRef<HTMLButtonElement>(null);
 const data=today.data;
 const selectedFeeling=feeling??lastCheckIn?.feeling??null;
 const onCloseUrgent=()=>{setUrgentOpen(false);window.setTimeout(()=>urgentTrigger.current?.focus(),0);};
 const saveCheckIn=()=>{if(!selectedFeeling)return;setLastCheckIn({feeling:selectedFeeling,submittedAt:new Date().toISOString()});setCheckInSaved(true);};
 const locale=i18n.language;

 return <DashboardLayout userType="victim" displayName={data?.case.preferredName}>
  <div className="victim-page victim-home">
   <div className="victim-page__heading victim-home__heading">
     <div><div className="eyebrow">{t('homePage.eyebrow')}</div><h1>{t('homePage.title',{name:data?.case.preferredName?`, ${data.case.preferredName}`:''})}</h1><p className="muted">{t('homePage.subtitle')}</p></div>
     <button ref={urgentTrigger} className="button victim-home__urgent" onClick={()=>setUrgentOpen(true)}><ShieldAlert size={18}/> {t('homePage.urgentHelp')}</button>
   </div>

   {today.isPending&&<div className="victim-home__status-card"><Loading/><p className="muted">{t('homePage.loading')}</p></div>}
   {today.isError&&<div className="victim-home__error"><ErrorState message={today.error.message} onRetry={()=>void today.refetch()}/><Link className="button victim-button--outline" to="/talk"><MessageCircle size={17}/> {t('homePage.talkToHaven')}</Link></div>}

   {data&&<>
     {demoContactAttempt&&<section className="victim-home__contact" aria-label="Contact notice"><div className="victim-home__contact-icon" aria-hidden="true"><PhoneCall size={20}/></div><div><strong>{demoContactAttempt.from==='COUNSELOR'?t('homePage.contactCounselor'):t('homePage.contactOfficial')}</strong><p>{demoContactAttempt.status==='MESSAGE_AVAILABLE'?t('homePage.newMessage'):t('homePage.contactAttempt',{name:demoContactAttempt.displayName,date:dateTime(demoContactAttempt.attemptedAt,locale)})}</p></div><button className="button victim-button--outline" onClick={()=>navigate('/support')}>{demoContactAttempt.status==='MESSAGE_AVAILABLE'?t('homePage.viewMessage'):t('homePage.openContact')}<ChevronRight size={16}/></button></section>}

     <div className="victim-home__court-card"><Panel title={t('homePage.eventTitle')}><div className="victim-home__card-icon" aria-hidden="true"><CalendarDays size={19}/></div>{demoCaseEvent?<><div className="victim-home__card-title-row"><h3>{demoCaseEvent.title}</h3><Badge>{t(`homePage.${demoCaseEvent.kind==='HEARING'?'hearing':demoCaseEvent.kind==='SCHEDULED_CALL'?'scheduledCall':'caseEvent'}`)}</Badge></div><p className="muted"><Clock3 size={15} aria-hidden="true"/> {dateOnly(demoCaseEvent.startsAt,locale)}</p><p className="victim-home__event-detail">{demoCaseEvent.locationOrMode??t('homePage.detailsWhenConfirmed')}</p></>:<><h3>{t('homePage.noEvent')}</h3><p className="muted">{t('homePage.eventDescription')}</p></>}</Panel></div>

     <div className="victim-home__top-grid">
     <section className="victim-card victim-home__checkin" id="daily-checkin" aria-labelledby="checkin-title">
       <div className="victim-home__section-heading"><div><div className="eyebrow">{t('homePage.checkInEyebrow')}</div><h2 id="checkin-title">{t('homePage.checkInTitle')}</h2></div><HeartHandshake size={25} aria-hidden="true"/></div>
       <fieldset className="victim-home__feelings"><legend className="sr-only">{t('homePage.chooseFeeling')}</legend>{feelingOptions.map(option=><label className={`victim-home__feeling${selectedFeeling===option.value?' selected':''}`} key={option.value}><input type="radio" name="feeling" value={option.value} checked={selectedFeeling===option.value} onChange={()=>{setFeeling(option.value);setCheckInSaved(false)}}/><span><strong>{t(`homePage.feelings.${option.value}.label`)}</strong><small>{t(`homePage.feelings.${option.value}.description`)}</small></span></label>)}</fieldset>
       <div className="victim-home__checkin-footer"><Button onClick={saveCheckIn} disabled={!selectedFeeling}>{t(lastCheckIn?'homePage.updateCheckIn':'homePage.saveCheckIn')}</Button>{lastCheckIn&&<span className="muted">{t('homePage.lastShared',{date:dateTime(lastCheckIn.submittedAt,locale)})}</span>}</div>
       {checkInSaved&&<p className="victim-home__inline-status" role="status"><CheckCircle2 size={16}/> {t('homePage.savedDemo')}</p>}
     </section>

     <section className="victim-card victim-home__talk-card" aria-labelledby="talk-title"><div className="victim-home__talk-mark" aria-hidden="true"><MessageCircle size={26}/></div><div className="eyebrow">{t('homePage.talkEyebrow')}</div><h2 id="talk-title">{t('homePage.talkTitle')}</h2><p className="muted">{t('homePage.talkDescription')}</p><Link className="button" to="/talk">{t('homePage.startConversation')} <ChevronRight size={17}/></Link><p className="victim-home__small-note"><Info size={14} aria-hidden="true"/> {t('homePage.companionNote')}</p></section>
    </div>

    <div className="victim-home__summary-grid">
     <Panel title={t('homePage.counselingTitle')}><div className="victim-home__card-icon" aria-hidden="true"><UserRound size={19}/></div>{data.appointment?<><div className="victim-home__card-title-row"><h3>{data.appointment.counselorName}</h3><Badge>{appointmentMode(data.appointment.mode)}</Badge></div><p className="muted"><Clock3 size={15} aria-hidden="true"/> {dateTime(data.appointment.startsAt,locale)}</p><Link className="button victim-button--outline" to="/support">{t('homePage.viewSupport')}</Link></>:<><h3>{t('homePage.noSession')}</h3><p className="muted">{t('homePage.sessionDescription')}</p><Link className="button victim-button--outline" to="/support">{t('homePage.findSupport')}</Link></>}</Panel>
    </div>

    <section className="victim-card victim-home__assistance" aria-labelledby="assistance-title"><div className="victim-home__section-heading"><div><div className="eyebrow">{t('homePage.assistanceEyebrow')}</div><h2 id="assistance-title">{t('homePage.assistanceTitle')}</h2></div><HeartHandshake size={25} aria-hidden="true"/></div>{data.support.length===0?<p className="muted">{t('homePage.noAssistance')}</p>:<div className="victim-home__assistance-list">{data.support.map(request=><div className="victim-home__assistance-row" key={request.id}><div><strong>{request.title}</strong><p className="muted">{t('homePage.supportStatus')}</p><small>{t('homePage.demoStatus')}</small></div><Badge>{assistanceLabels[request.status]??request.status}</Badge></div>)}</div>}<Link className="button victim-button--outline" to="/support">{t('homePage.openSupport')} <ChevronRight size={16}/></Link></section>

    <section className="victim-card victim-home__actions" aria-labelledby="actions-title"><div className="victim-home__section-heading"><div><div className="eyebrow">{t('homePage.actionsEyebrow')}</div><h2 id="actions-title">{t('homePage.actionsTitle')}</h2></div><ChevronRight size={22} aria-hidden="true"/></div><div className="victim-home__action-list"><button className="victim-home__action" onClick={()=>document.getElementById('daily-checkin')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}><span><strong>{t('homePage.checkInAction')}</strong><small>{t('homePage.checkInActionDescription')}</small></span><ChevronRight size={18} aria-hidden="true"/></button><Link className="victim-home__action" to="/support"><span><strong>{t('homePage.homeSupportAction')}</strong><small>{t('homePage.homeSupportActionDescription')}</small></span><ChevronRight size={18} aria-hidden="true"/></Link><Link className="victim-home__action" to={actionRoutes.VIEW_RESOURCES}><span><strong>{t('homePage.homeResourcesAction')}</strong><small>{t('homePage.homeResourcesActionDescription')}</small></span><ChevronRight size={18} aria-hidden="true"/></Link></div></section>
   </>}
  </div>
  <UrgentHelpDialog open={urgentOpen} onClose={onCloseUrgent}/>
 </DashboardLayout>;
}
