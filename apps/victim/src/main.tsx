import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter} from 'react-router-dom';
import '@haven/ui/styles.css';
import './i18n';
import {App} from './App';

const queryClient=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:15000}}});
async function start(){
 if(import.meta.env.VITE_ENABLE_MOCKS==='false'){
  ReactDOM.createRoot(document.getElementById('root')!).render(<main className="main"><h1>Backend connection not configured</h1><p>This foundation runs with mock APIs. Enable mocks to explore it.</p></main>);return;
 }
 const {worker}=await import('@haven/mocks/browser');
 await worker.start({serviceWorker:{url:'/mockServiceWorker.js'},onUnhandledRequest(request,print){if(new URL(request.url).pathname.startsWith('/api/'))print.error();}});
 ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><BrowserRouter><App/></BrowserRouter></QueryClientProvider></React.StrictMode>);
}
start().catch(()=>{document.getElementById('root')!.textContent='The demo could not start. Reload the page or check that service workers are available.';});

