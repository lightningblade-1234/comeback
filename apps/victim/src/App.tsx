import {Route,Routes} from 'react-router-dom';
import {Toaster} from 'sonner';
import {LandingPage} from './features/landing/LandingPage';
import {PersonalCare} from './legacy/pages/PersonalCare';
import {Journal} from './legacy/pages/Journal';
import {BookSession} from './legacy/pages/BookSession';
import {ResourcesAndSelfCare} from './legacy/pages/ResourcesAndSelfCare';
import './legacy.css';

export function App(){return <><Toaster position="top-right"/><Routes><Route path="/" element={<LandingPage/>}/><Route path="/home" element={<PersonalCare/>}/><Route path="/talk" element={<PersonalCare/>}/><Route path="/support" element={<BookSession/>}/><Route path="/journal" element={<Journal/>}/><Route path="/more" element={<ResourcesAndSelfCare/>}/><Route path="/student-dashboard" element={<PersonalCare/>}/><Route path="/student-dashboard/resources" element={<ResourcesAndSelfCare/>}/><Route path="/student-dashboard/journal" element={<Journal/>}/><Route path="/student-dashboard/booking" element={<BookSession/>}/><Route path="*" element={<PersonalCare/>}/></Routes></>}
