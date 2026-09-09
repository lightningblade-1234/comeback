import {Route,Routes} from 'react-router-dom';
import {Toaster} from 'sonner';
import {LandingPage} from './features/landing/LandingPage';
import {PersonalCare} from './legacy/pages/PersonalCare';
import {Journal} from './legacy/pages/Journal';
import {BookSession} from './legacy/pages/BookSession';
import {HomePage} from './features/home/HomePage';
import {MySupportPage} from './features/support/MySupportPage';
import {CasePage,MoreHubPage,ResourcesPage,SelfCarePage} from './features/more/MorePages';
import {SharedSupportPage} from './features/shared-support/SharedSupportPage';
import {SharedSupportProvider} from './features/shared-support/SharedSupportContext';
import './legacy.css';
import './victim.css';

export function App(){return <SharedSupportProvider><Toaster position="top-right"/><Routes><Route path="/" element={<LandingPage/>}/><Route path="/home" element={<HomePage/>}/><Route path="/talk" element={<PersonalCare/>}/><Route path="/support" element={<MySupportPage/>}/><Route path="/journal" element={<Journal/>}/><Route path="/more" element={<MoreHubPage/>}/><Route path="/more/case" element={<CasePage/>}/><Route path="/more/resources" element={<ResourcesPage/>}/><Route path="/more/self-care" element={<SelfCarePage/>}/><Route path="/shared-support/*" element={<SharedSupportPage/>}/><Route path="/student-dashboard" element={<PersonalCare/>}/><Route path="/student-dashboard/resources" element={<ResourcesPage/>}/><Route path="/student-dashboard/journal" element={<Journal/>}/><Route path="/student-dashboard/booking" element={<BookSession/>}/><Route path="*" element={<PersonalCare/>}/></Routes></SharedSupportProvider>}
