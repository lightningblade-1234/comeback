import {type ButtonHTMLAttributes,type PropsWithChildren} from 'react';
import {Slot} from '@radix-ui/react-slot';
export function Button({asChild=false,className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{asChild?:boolean}){const Component=asChild?Slot:'button';return <Component className={'button '+className} {...props}/>;}
export function Panel({children,title}:PropsWithChildren<{title?:string}>){return <section className="panel">{title&&<h2>{title}</h2>}{children}</section>;}
export function Badge({children}:PropsWithChildren){return <span className="badge">{children}</span>;}
export function Loading(){return <p role="status">Loading…</p>;}
export function ErrorState({message,onRetry}:{message:string;onRetry:()=>void}){return <div role="alert" className="panel"><p>{message}</p><Button onClick={onRetry}>Try again</Button></div>;}

