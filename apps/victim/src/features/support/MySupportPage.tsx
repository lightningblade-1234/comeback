import {useEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {api,queryKeys} from '@haven/api-client';
import {Badge,Button,ErrorState,Loading,Panel} from '@haven/ui';
import {CalendarClock,CheckCircle2,ChevronRight,ClipboardCheck,Clock3,FileText,HeartHandshake,Info,Languages,ListChecks,MessageCircle,PhoneCall,ShieldAlert,UserRound,Video} from 'lucide-react';
import {DashboardLayout} from '../../legacy/components/DashboardLayout';
import {assistanceOptions,counselorMessages,counselorProfiles,followUpTasks,sampleSupportPlan,sampleTimeSlots,scheduledCheckIn,supportFormats,type DemoSupportStatus,type SupportFormat} from './support-demo';
import './support.css';

type AppointmentFlow='BOOK'|'RESCHEDULE'|'CANCEL';

function formatDateTime(value:string,locale='en'){
 return new Intl.DateTimeFormat(locale==='en'?'en-IN':locale,{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'}).format(new Date(value))+' IST';
}

function formatDate(value:string,locale='en'){
 return new Intl.DateTimeFormat(locale==='en'?'en-IN':locale,{timeZone:'Asia/Kolkata',dateStyle:'medium'}).format(new Date(value));
}

function supportStatus(value:string):DemoSupportStatus{
 if(value==='ASSIGNED'||value==='IN_PROGRESS'||value==='COMPLETED')return value;
 if(value==='CLOSED'||value==='CLOSED_BY_HUMAN')return 'COMPLETED';
 return 'SUBMITTED';
}

function formatLabel(t:(key:string)=>string,format:SupportFormat){
 return t(`supportPage.formats.${format}`);
}

function SupportDialog({open,flow,currentFormat,onClose}:{open:boolean;flow:AppointmentFlow;currentFormat:SupportFormat;onClose:()=>void}){
 const {t}=useTranslation();
 const dialogRef=useRef<HTMLElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const [counselorId,setCounselorId]=useState(counselorProfiles[0].id);
 const [format,setFormat]=useState<SupportFormat>(currentFormat);
 const [slot,setSlot]=useState('');
 const [error,setError]=useState('');
 const [submitted,setSubmitted]=useState(false);
 const counselor=counselorProfiles.find(item=>item.id===counselorId)??counselorProfiles[0];
 const availableSlots=sampleTimeSlots[format];

 useEffect(()=>{
  if(!open)return;
  setCounselorId(counselorProfiles[0].id);
  setFormat(counselorProfiles[0].formats.includes(currentFormat)?currentFormat:counselorProfiles[0].formats[0]);
  setSlot('');
  setError('');
  setSubmitted(false);
  window.setTimeout(()=>closeButton.current?.focus(),0);
  const handleKeyDown=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){onClose();return;}
   if(event.key!=='Tab'||!dialogRef.current)return;
   const focusable=Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]'));
   if(focusable.length===0)return;
   const first=focusable[0];
   const last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  window.addEventListener('keydown',handleKeyDown);
  return ()=>window.removeEventListener('keydown',handleKeyDown);
 },[currentFormat,onClose,open]);

 if(!open)return null;

 const selectCounselor=(id:string)=>{
  const next=counselorProfiles.find(item=>item.id===id)??counselorProfiles[0];
  setCounselorId(next.id);
  setFormat(next.formats.includes(format)?format:next.formats[0]);
  setSlot('');
  setError('');
 };
 const submit=()=>{
  if(flow!=='CANCEL'&&!slot){setError(t('supportPage.dialog.chooseSlotError'));return;}
  setSubmitted(true);
 };

 return <div className="support-dialog-layer" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
  <section ref={dialogRef} className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-dialog-title" aria-describedby="support-dialog-description">
   <div className="support-dialog__heading"><div><div className="eyebrow">{t('supportPage.dialog.eyebrow')}</div><h2 id="support-dialog-title">{flow==='BOOK'?t('supportPage.dialog.bookTitle'):flow==='RESCHEDULE'?t('supportPage.dialog.rescheduleTitle'):t('supportPage.dialog.cancelTitle')}</h2></div><button ref={closeButton} className="support-dialog__close" onClick={onClose} aria-label={t('supportPage.dialog.close')}>×</button></div>
   {submitted?<div className="support-dialog__result" role="status"><CheckCircle2 size={28} aria-hidden="true"/><h3>{flow==='CANCEL'?t('supportPage.dialog.cancelPreviewTitle'):t('supportPage.dialog.previewTitle')}</h3><p>{t('supportPage.dialog.previewDescription')}</p><Button onClick={onClose}>{t('supportPage.dialog.done')}</Button></div>:flow==='CANCEL'?<>
    <p id="support-dialog-description">{t('supportPage.dialog.cancelDescription')}</p>
    <div className="support-dialog__notice"><Info size={17} aria-hidden="true"/><span>{t('supportPage.demoNotice')}</span></div>
    <div className="support-dialog__actions"><Button className="support-button--secondary" onClick={onClose}>{t('supportPage.dialog.keepSession')}</Button><Button onClick={submit}>{t('supportPage.dialog.previewCancel')}</Button></div>
   </>:<>
    <p id="support-dialog-description">{t(flow==='BOOK'?'supportPage.dialog.bookDescription':'supportPage.dialog.rescheduleDescription')}</p>
    <fieldset className="support-dialog__fieldset"><legend>{t('supportPage.dialog.chooseCounselor')}</legend><div className="support-counselor-choices">{counselorProfiles.map(profile=><button type="button" className={`support-counselor-choice${profile.id===counselorId?' selected':''}`} aria-pressed={profile.id===counselorId} key={profile.id} onClick={()=>selectCounselor(profile.id)}><span className="support-counselor-choice__icon" aria-hidden="true"><UserRound size={18}/></span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></button>)}</div></fieldset>
    <div className="support-dialog__profile"><div><strong>{counselor.name}</strong><p>{counselor.experience}</p></div><span className="status-pill">{counselor.availability}</span><p className="support-dialog__languages"><Languages size={15} aria-hidden="true"/> {counselor.languages.join(' · ')}</p></div>
    <fieldset className="support-dialog__fieldset"><legend>{t('supportPage.dialog.chooseFormat')}</legend><div className="support-format-choices">{supportFormats.map(option=><label className={`support-format-choice${format===option?' selected':''}${counselor.formats.includes(option)?'':' unavailable'}`} key={option}><input type="radio" name="support-format" value={option} checked={format===option} disabled={!counselor.formats.includes(option)} onChange={()=>{setFormat(option);setSlot('');setError('')}}/><span><Video size={17} aria-hidden="true"/><strong>{formatLabel(t,option)}</strong><small>{counselor.formats.includes(option)?t('supportPage.dialog.available'):t('supportPage.dialog.unavailable')}</small></span></label>)}</div></fieldset>
    <fieldset className="support-dialog__fieldset"><legend>{t('supportPage.dialog.chooseSlot')}</legend><div className="support-slot-choices">{availableSlots.map(option=><label className={`support-slot-choice${slot===option?' selected':''}`} key={option}><input type="radio" name="support-slot" value={option} checked={slot===option} onChange={()=>{setSlot(option);setError('')}}/><span>{option}</span></label>)}</div></fieldset>
    {error&&<p className="support-form-error" role="alert">{error}</p>}
    <div className="support-dialog__notice"><Info size={17} aria-hidden="true"/><span>{t('supportPage.dialog.previewNotice')}</span></div>
    <div className="support-dialog__actions"><Button className="support-button--secondary" onClick={onClose}>{t('supportPage.dialog.close')}</Button><Button onClick={submit}>{flow==='BOOK'?t('supportPage.dialog.previewBooking'):t('supportPage.dialog.previewReschedule')}</Button></div>
   </>}
  </section>
 </div>;
}

function UrgentHelpDialog({open,onClose}:{open:boolean;onClose:()=>void}){
 const {t}=useTranslation();
 const dialogRef=useRef<HTMLElement>(null);
 const closeButton=useRef<HTMLButtonElement>(null);
 const [previewed,setPreviewed]=useState(false);
 useEffect(()=>{
  if(!open)return;
  setPreviewed(false);
  window.setTimeout(()=>closeButton.current?.focus(),0);
  const handleKeyDown=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){onClose();return;}
   if(event.key!=='Tab'||!dialogRef.current)return;
   const focusable=Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]'));
   if(focusable.length===0)return;
   const first=focusable[0];
   const last=focusable[focusable.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  };
  window.addEventListener('keydown',handleKeyDown);
  return ()=>window.removeEventListener('keydown',handleKeyDown);
 },[onClose,open]);
 if(!open)return null;
 return <div className="support-dialog-layer" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
  <section ref={dialogRef} className="support-dialog support-dialog--urgent" role="dialog" aria-modal="true" aria-labelledby="support-urgent-title">
   <div className="support-dialog__icon" aria-hidden="true"><ShieldAlert/></div>
   <div className="support-dialog__heading"><div><div className="eyebrow">{t('supportPage.urgent.eyebrow')}</div><h2 id="support-urgent-title">{t('supportPage.urgent.title')}</h2></div><button ref={closeButton} className="support-dialog__close" onClick={onClose} aria-label={t('supportPage.dialog.close')}>×</button></div>
   <p>{t('supportPage.urgent.description')}</p>
   <div className="support-dialog__notice support-dialog__notice--urgent"><Info size={17} aria-hidden="true"/><span>{t('supportPage.urgent.notice')}</span></div>
   {previewed&&<p className="support-dialog__preview" role="status"><CheckCircle2 size={17} aria-hidden="true"/> {t('supportPage.urgent.preview')}</p>}
   <div className="support-dialog__actions"><Link className="button" to="/talk" onClick={onClose}><MessageCircle size={17} aria-hidden="true"/>{t('supportPage.urgent.talk')}</Link><Button className="support-button--secondary" onClick={()=>setPreviewed(true)}>{t('supportPage.urgent.previewAction')}</Button></div>
  </section>
 </div>;
}

export function MySupportPage(){
 const {t,i18n}=useTranslation();
 const query=useQuery({queryKey:queryKeys.victim,queryFn:async()=>{
  try{return await api.victimHome();}
  catch(error){if(error instanceof SyntaxError)throw new Error(t('supportPage.serviceConnecting'));throw error;}
 }});
 const [appointmentFlow,setAppointmentFlow]=useState<AppointmentFlow|null>(null);
 const [urgentOpen,setUrgentOpen]=useState(false);
 const [checkInPreview,setCheckInPreview]=useState(false);
 const [assistanceType,setAssistanceType]=useState<(typeof assistanceOptions)[number]>('COUNSELING');
 const [assistancePreview,setAssistancePreview]=useState(false);
 const [assistanceNote,setAssistanceNote]=useState('');
 const [expandedMessage,setExpandedMessage]=useState<string|null>(null);
 const urgentTrigger=useRef<HTMLButtonElement>(null);
 const locale=i18n.language;
 const data=query.data;
 const currentFormat=(data?.appointment.mode??'VOICE') as SupportFormat;
 const selectedCounselor=useMemo(()=>counselorProfiles.find(profile=>profile.name===data?.appointment.counselorName)??counselorProfiles[0],[data?.appointment.counselorName]);
 const closeUrgent=()=>{setUrgentOpen(false);window.setTimeout(()=>urgentTrigger.current?.focus(),0);};
 const submitAssistance=(event:React.FormEvent<HTMLFormElement>)=>{event.preventDefault();setAssistancePreview(true);setAssistanceNote('');};

 return <DashboardLayout userType="victim" displayName={data?.case.preferredName}>
  <div className="victim-page victim-support-page">
   <div className="victim-page__heading victim-support__heading"><div><div className="eyebrow">{t('supportPage.eyebrow')}</div><h1>{t('supportPage.title')}</h1><p className="muted">{t('supportPage.subtitle')}</p></div><button ref={urgentTrigger} className="button victim-support__urgent" onClick={()=>setUrgentOpen(true)}><ShieldAlert size={18} aria-hidden="true"/>{t('supportPage.urgent.button')}</button></div>
   {query.isPending&&<div className="victim-support__status"><Loading/><p className="muted">{t('supportPage.loading')}</p></div>}
   {query.isError&&<div className="victim-support__error"><ErrorState message={query.error.message} onRetry={()=>void query.refetch()}/><Link className="button support-button--secondary" to="/talk"><MessageCircle size={17} aria-hidden="true"/>{t('supportPage.talkToHaven')}</Link></div>}
   {data&&<>
    <div className="support-demo-banner"><Info size={16} aria-hidden="true"/><span>{t('supportPage.demoBanner')}</span></div>
    <div className="support-overview-grid">
     <Panel title={t('supportPage.session.title')}><div className="support-card__icon" aria-hidden="true"><CalendarClock size={20}/></div><div className="support-card__title-row"><h3>{data.appointment.status==='CANCELLED'?t('supportPage.session.noSession'):data.appointment.counselorName}</h3><Badge>{t(`supportPage.status.${data.appointment.status}`)}</Badge></div>{data.appointment.status==='CANCELLED'?<p className="muted">{t('supportPage.session.noSessionDescription')}</p>:<><p className="muted support-inline"><Clock3 size={15} aria-hidden="true"/>{formatDateTime(data.appointment.startsAt,locale)}</p><p className="support-session-format">{t('supportPage.session.format')}: <strong>{formatLabel(t,currentFormat)}</strong></p><div className="support-actions"><Button onClick={()=>setAppointmentFlow('RESCHEDULE')}>{t('supportPage.session.reschedule')}</Button><Button className="support-button--secondary" onClick={()=>setAppointmentFlow('CANCEL')}>{t('supportPage.session.cancel')}</Button></div></>}<Button className="support-button--text" onClick={()=>setAppointmentFlow('BOOK')}>{t('supportPage.session.bookAnother')} <ChevronRight size={16} aria-hidden="true"/></Button></Panel>
     <Panel title={t('supportPage.counselor.title')}><div className="support-card__icon" aria-hidden="true"><UserRound size={20}/></div><div className="support-counselor-summary"><div><h3>{selectedCounselor.name}</h3><p className="muted">{selectedCounselor.role}</p></div><span className="status-pill">{t('supportPage.sampleLabel')}</span></div><p className="support-inline"><Languages size={15} aria-hidden="true"/>{selectedCounselor.languages.join(' · ')}</p><p className="muted">{selectedCounselor.experience}</p><p className="support-availability"><CheckCircle2 size={15} aria-hidden="true"/>{selectedCounselor.availability}</p><div className="support-format-list" aria-label={t('supportPage.counselor.formats')}>{selectedCounselor.formats.map(format=><span className="status-pill" key={format}>{formatLabel(t,format)}</span>)}</div><Button onClick={()=>setAppointmentFlow('BOOK')}>{t('supportPage.session.bookCounseling')}</Button></Panel>
    </div>

    <div className="support-main-grid">
     <section className="victim-card support-panel support-checkin" aria-labelledby="support-checkin-title"><div className="support-section-heading"><div><div className="eyebrow">{t('supportPage.checkIn.eyebrow')}</div><h2 id="support-checkin-title">{t('supportPage.checkIn.title')}</h2></div><ClipboardCheck size={24} aria-hidden="true"/></div><h3>{scheduledCheckIn.title}</h3><p className="muted">{scheduledCheckIn.prompt}</p><p className="support-inline muted"><Clock3 size={15} aria-hidden="true"/>{formatDateTime(scheduledCheckIn.scheduledFor,locale)}</p><div className="support-checkin-options">{scheduledCheckIn.options.map(option=><button type="button" className="support-checkin-option" key={option} onClick={()=>setCheckInPreview(true)}>{option}<ChevronRight size={15} aria-hidden="true"/></button>)}</div>{checkInPreview&&<p className="support-preview" role="status"><CheckCircle2 size={16} aria-hidden="true"/>{t('supportPage.checkIn.preview')}</p>}</section>
     <section className="victim-card support-panel support-plan" aria-labelledby="support-plan-title"><div className="support-section-heading"><div><div className="eyebrow">{t('supportPage.plan.eyebrow')}</div><h2 id="support-plan-title">{t('supportPage.plan.title')}</h2></div><FileText size={24} aria-hidden="true"/></div><p className="muted">{sampleSupportPlan.summary}</p><div className="support-plan-grid"><div><h3>{t('supportPage.plan.goals')}</h3><ul>{sampleSupportPlan.goals.map(goal=><li key={goal}>{goal}</li>)}</ul></div><div><h3>{t('supportPage.plan.nextSteps')}</h3><ul>{sampleSupportPlan.nextSteps.map(step=><li key={step}>{step}</li>)}</ul></div></div><div className="support-plan-footer"><span className="muted">{t('supportPage.plan.reviewDate', {date:formatDate(sampleSupportPlan.reviewDate,locale)})}</span><span className="status-pill">{t('supportPage.sampleLabel')}</span></div></section>
    </div>

    <section className="victim-card support-panel support-requests" aria-labelledby="support-requests-title"><div className="support-section-heading"><div><div className="eyebrow">{t('supportPage.requests.eyebrow')}</div><h2 id="support-requests-title">{t('supportPage.requests.title')}</h2></div><HeartHandshake size={24} aria-hidden="true"/></div><div className="support-request-list">{data.support.length===0?<p className="muted">{t('supportPage.requests.empty')}</p>:data.support.map(request=><div className="support-request-row" key={request.id}><div><strong>{request.title}</strong><p className="muted">{t('supportPage.requests.currentRequest')}</p></div><Badge>{t(`supportPage.status.${supportStatus(request.status)}`)}</Badge></div>)}</div><form className="support-request-form" onSubmit={submitAssistance}><div><h3>{t('supportPage.requests.newTitle')}</h3><p className="muted">{t('supportPage.requests.newDescription')}</p></div><label className="support-field">{t('supportPage.requests.typeLabel')}<select value={assistanceType} onChange={event=>{setAssistanceType(event.target.value as (typeof assistanceOptions)[number]);setAssistancePreview(false)}}>{assistanceOptions.map(option=><option value={option} key={option}>{t(`supportPage.assistance.${option}`)}</option>)}</select></label><label className="support-field">{t('supportPage.requests.noteLabel')}<textarea value={assistanceNote} onChange={event=>setAssistanceNote(event.target.value)} placeholder={t('supportPage.requests.notePlaceholder')} /></label><div className="support-request-form__footer"><Button type="submit">{t('supportPage.requests.previewAction')}</Button><span className="muted">{t('supportPage.demoNotice')}</span></div>{assistancePreview&&<p className="support-preview" role="status"><CheckCircle2 size={16} aria-hidden="true"/>{t('supportPage.requests.preview', {type:t(`supportPage.assistance.${assistanceType}`)})}</p>}</form></section>

    <div className="support-secondary-grid"><section className="victim-card support-panel" aria-labelledby="support-tasks-title"><div className="support-section-heading"><div><div className="eyebrow">{t('supportPage.tasks.eyebrow')}</div><h2 id="support-tasks-title">{t('supportPage.tasks.title')}</h2></div><ListChecks size={24} aria-hidden="true"/></div><p className="muted support-sample-note">{t('supportPage.sampleContent')}</p><div className="support-task-list">{followUpTasks.map(task=><div className="support-task-row" key={task.id}><div><strong>{task.title}</strong><p className="muted">{task.owner} · {t('supportPage.tasks.due', {date:formatDate(task.due,locale)})}</p></div><Badge>{task.status==='DONE'?t('supportPage.tasks.done'):t('supportPage.tasks.open')}</Badge></div>)}</div></section><section className="victim-card support-panel" aria-labelledby="support-messages-title"><div className="support-section-heading"><div><div className="eyebrow">{t('supportPage.messages.eyebrow')}</div><h2 id="support-messages-title">{t('supportPage.messages.title')}</h2></div><PhoneCall size={24} aria-hidden="true"/></div><p className="muted support-sample-note">{t('supportPage.sampleContent')}</p><div className="support-message-list">{counselorMessages.map(message=><div className="support-message-row" key={message.id}><div className="support-message-row__meta"><span className={message.unread?'support-unread-dot':''} aria-hidden="true"/><strong>{message.subject}</strong></div><p className={expandedMessage===message.id?'':'support-message-row__collapsed'}>{message.preview}</p><button type="button" className="support-button--text" onClick={()=>setExpandedMessage(expandedMessage===message.id?null:message.id)}>{expandedMessage===message.id?t('supportPage.messages.hide'):t('supportPage.messages.read')} <ChevronRight size={15} aria-hidden="true"/></button></div>)}</div></section></div>
   </>}
  </div>
  <SupportDialog open={appointmentFlow!==null} flow={appointmentFlow??'BOOK'} currentFormat={currentFormat} onClose={()=>setAppointmentFlow(null)}/>
  <UrgentHelpDialog open={urgentOpen} onClose={closeUrgent}/>
 </DashboardLayout>;
}
