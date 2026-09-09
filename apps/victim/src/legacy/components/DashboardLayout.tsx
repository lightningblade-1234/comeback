import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button } from './ui/button';
import { Users } from 'lucide-react';
import {useLocation,useNavigate} from 'react-router-dom';
import { InteractiveBackground } from './InteractiveBackground';
import {useSharedSupport} from '../../features/shared-support/SharedSupportContext';
import '../../features/shared-support/workspace-switch.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'student' | 'victim' | 'admin';
  displayName?: string;
  onCommunityToggle?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userType, displayName, onCommunityToggle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate=useNavigate();
  const location=useLocation();
  const {lastShared,rememberPersonal}=useSharedSupport();
  React.useEffect(()=>{if(userType==='victim')rememberPersonal(location.pathname);},[location.pathname,rememberPersonal,userType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wellness-calm/5 to-wellness-peaceful/10 dark:from-background dark:via-wellness-calm/10 dark:to-wellness-peaceful/20 relative">
      <InteractiveBackground />
      
      <div className="flex h-screen relative z-10">
        <Sidebar 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
          userType={userType}
          displayName={displayName}
        />
        
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Top Bar */}
          <header className="h-16 border-b border-white/10 backdrop-blur-xl bg-white/5 dark:bg-gray-900/5 flex items-center justify-end px-6 gap-3">
            {userType==='victim'&&<div className="victim-workspace-switch" aria-label="Workspace navigation"><button className={location.pathname.startsWith('/shared-support')?'':'active'} onClick={()=>navigate(location.pathname.startsWith('/shared-support')?'/home':location.pathname)}>Personal Space</button><button className={location.pathname.startsWith('/shared-support')?'active':''} onClick={()=>navigate(lastShared)}>Shared Support</button></div>}
            {userType === 'student' && onCommunityToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCommunityToggle}
                className="glass-card hover:scale-110 transition-all duration-300"
                title="Community Mode"
              >
                <Users className="h-4 w-4" />
              </Button>
            )}
          </header>
          
          <main className="flex-1 min-w-0 overflow-auto overflow-x-hidden">
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
