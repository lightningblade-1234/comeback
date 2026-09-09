import {createContext,useContext,useMemo,useState,type ReactNode} from 'react';
import {createDemoState,type DemoState} from './shared-support-demo';

type SharedSupportContextValue={state:DemoState;patch:(next:Partial<DemoState>)=>void;reset:()=>void;lastPersonal:string;lastShared:string;rememberPersonal:(path:string)=>void;rememberShared:(path:string)=>void};
const SharedSupportContext=createContext<SharedSupportContextValue|null>(null);

export function SharedSupportProvider({children}:{children:ReactNode}){
 const [state,setState]=useState(createDemoState);
 const [lastPersonal,setLastPersonal]=useState('/home');
 const [lastShared,setLastShared]=useState('/shared-support');
 const value=useMemo(()=>({state,patch:(next:Partial<DemoState>)=>setState(current=>({...current,...next})),reset:()=>setState(createDemoState()),lastPersonal,lastShared,rememberPersonal:setLastPersonal,rememberShared:setLastShared}),[state,lastPersonal,lastShared]);
 return <SharedSupportContext.Provider value={value}>{children}</SharedSupportContext.Provider>;
}
export function useSharedSupport(){const value=useContext(SharedSupportContext);if(!value)throw new Error('Shared Support state is unavailable.');return value;}
