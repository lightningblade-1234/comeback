import {useNavigate} from 'react-router-dom';
import {Button} from '@haven/ui';
import './landing.css';

function HeartIcon(){
 return <svg aria-hidden="true" className="haven-legacy-landing__heart" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg>;
}

export function LandingPage(){
 const navigate=useNavigate();
 return <div className="haven-legacy-landing">
  <div className="haven-legacy-landing__overlay" aria-hidden="true"/>
  <header className="haven-legacy-landing__header">
   <nav className="haven-legacy-landing__nav" aria-label="Main navigation">
    <div className="haven-legacy-landing__identity"><HeartIcon/><h1>Haven</h1></div>
    <div className="haven-legacy-landing__links"><a href="#">About</a><a href="#">Services</a><a href="#">Contact</a></div>
    <button className="haven-legacy-landing__menu" aria-label="Open navigation menu"><svg aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg></button>
   </nav>
  </header>

  <main className="haven-legacy-landing__main">
   <section className="haven-legacy-landing__hero">
    <div>
     <h1>Your Mental Health Journey Starts Here</h1>
     <p>A safe, supportive platform designed for students to take control of their mental wellbeing. Connect with professional counselors, track your mood, and access a wealth of resources, all in one place.</p>
     <div><Button className="haven-legacy-landing__cta" onClick={()=>navigate('/home')}>Get Started</Button></div>
    </div>
   </section>
  </main>

  <footer className="haven-legacy-landing__footer">
   <div>
    <div className="haven-legacy-landing__footer-brand"><HeartIcon/><h2>Haven</h2></div>
    <p>Supporting student mental health with compassionate, professional care.</p>
    <p className="haven-legacy-landing__copyright">© 2024 Haven. All rights reserved.</p>
   </div>
  </footer>
 </div>;
}
