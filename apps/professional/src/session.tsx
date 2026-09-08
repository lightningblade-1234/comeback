import {createContext,useContext,type PropsWithChildren} from 'react';
import {type DemoRole} from '@haven/contracts';
export const SessionContext=createContext<DemoRole>('counselor');
export function useDemoRole(){return useContext(SessionContext);}
export function Access({roles,children}:PropsWithChildren<{roles:DemoRole[]}>){const role=useDemoRole();return roles.includes(role)?children:<section className="panel"><h1>Access restricted</h1><p>This demo role cannot open this workspace. Choose the matching role to explore it.</p></section>;}

