import {type ReactNode} from 'react';
import {Badge} from '@haven/ui';
import {priorityLabels,statusLabel} from '@haven/contracts';
export type AuthorityTaskItem=Awaited<ReturnType<(typeof import('@haven/api-client'))['api']['authorityTasks']>>[number];
const formatter=new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'});
export const formatDateTime=(value:string)=>formatter.format(new Date(value));
export const formatStatus=(value:string)=>statusLabel(value).replace(/\b\w/g,letter=>letter.toUpperCase());
export const taskIsOverdue=(item:AuthorityTaskItem)=>new Date(item.task.dueAt)<new Date()&&item.task.status!=='ACKNOWLEDGED';
export function AuthorityPageHeader({eyebrow,title,children}:{eyebrow:string;title:string;children:ReactNode}){return <header className="authority-page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{children}</p></header>;}
export function PriorityBadge({value}:{value:string}){return <Badge>{value} · {priorityLabels[value]}</Badge>;}
export function StatusBadge({value}:{value:string}){return <Badge>{formatStatus(value)}</Badge>;}