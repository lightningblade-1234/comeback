import {useEffect,useRef,useState} from 'react';
import {Button,Panel} from '@haven/ui';

type Message={id:number;sender:'haven'|'user';content:string;time:string};
const starter="Hello, I’m Haven. I’m here to listen and help you find the next useful step. What feels most important to talk about today?";
const replies=[
 "Thank you for telling me. I’m listening. What has been making this feel especially difficult lately?",
 "That sounds heavy to carry. Would you like to tell me what happened, or focus first on what would help you feel safer today?",
 "You do not have to solve everything at once. What is one small, practical kind of support you would like us to explore?"
];

export function PersonalCare(){
 const [messages,setMessages]=useState<Message[]>([{id:1,sender:'haven',content:starter,time:'Now'}]);
 const [draft,setDraft]=useState('');
 const [mode,setMode]=useState<'text'|'voice'>('text');
 const [listening,setListening]=useState(false);
 const [typing,setTyping]=useState(false);
 const timer=useRef<number|undefined>(undefined);
 useEffect(()=>()=>{if(timer.current)window.clearTimeout(timer.current)},[]);
 const send=()=>{
  const content=draft.trim(); if(!content||typing)return;
  setMessages(prev=>[...prev,{id:Date.now(),sender:'user',content,time:'Now'}]);setDraft('');setTyping(true);
  timer.current=window.setTimeout(()=>{setMessages(prev=>[...prev,{id:Date.now()+1,sender:'haven',content:replies[prev.length%replies.length],time:'Now'}]);setTyping(false)},850);
 };
 return <div className="victim-page">
  <div className="victim-page__heading"><div><div className="eyebrow">Your conversation space</div><h1>Talk with Haven</h1><p className="muted">A text and voice conversation that keeps context when you switch modes.</p></div><span className="status-pill">● Private demo</span></div>
  <div className="victim-chat-layout">
   <section className="victim-card victim-chat-card" aria-label="Haven conversation">
    <div className="victim-chat-card__top"><div className="haven-avatar" aria-hidden="true">H</div><div><strong>Haven</strong><p className="muted">Calm, attentive support companion</p></div><span className="status-pill">{mode==='voice'?'Voice mode':'Text mode'}</span></div>
    <div className="victim-chat-messages" aria-live="polite">{messages.map(message=><div className={`victim-message victim-message--${message.sender}`} key={message.id}><div className="victim-message__bubble">{message.content}<small>{message.time}</small></div></div>)}{typing&&<div className="victim-message victim-message--haven"><div className="victim-message__bubble victim-typing"><i/><i/><i/></div></div>}</div>
    <div className="victim-chat-controls"><div className="victim-mode-toggle" role="group" aria-label="Conversation mode"><button className={mode==='text'?'active':''} onClick={()=>setMode('text')}>Text</button><button className={mode==='voice'?'active':''} onClick={()=>setMode('voice')}>Voice</button></div><div className="victim-composer"><input value={draft} onChange={event=>setDraft(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')send()}} placeholder="Share what is on your mind…" aria-label="Message Haven" disabled={mode==='voice'}/><Button onClick={send} disabled={!draft.trim()||typing||mode==='voice'}>Send</Button><Button className={listening?'recording':''} onClick={()=>setListening(value=>!value)} aria-pressed={listening}>{listening?'Stop mic':'Mic'}</Button></div><p className="muted victim-chat-disclaimer">Haven is an AI companion. It does not replace a counselor. Urgent help remains available through the support flow.</p></div>
   </section>
   <aside className="victim-chat-side"><Panel title="A gentle next step"><p>Try writing one sentence about what you need right now. Haven can help you turn it into a support request.</p><Button onClick={()=>setDraft('I would like help with ')}>Start with a prompt</Button></Panel><Panel title="Conversation controls"><ul className="victim-checklist"><li>Switch between text and voice</li><li>Stop the microphone at any time</li><li>Request a counselor when you need one</li></ul></Panel></aside>
  </div>
 </div>;
}
