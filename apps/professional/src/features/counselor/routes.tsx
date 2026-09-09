import { type RouteObject } from 'react-router-dom';
import { motion } from 'motion/react';
import { Access } from '../../session';
import { CounselorQueueView } from './components/CounselorQueueView';
import { VictimSupportWorkspace } from './components/VictimSupportWorkspace';
import { AppointmentsView } from './components/AppointmentsView';
import { ClinicalSupervisionView } from './components/ClinicalSupervisionView';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

export const counselorRoutes: RouteObject[] = [
  {
    path: '/counselor',
    element: (
      <Access roles={['counselor']}>
        <PageTransition>
          <CounselorQueueView />
        </PageTransition>
      </Access>
    )
  },
  {
    path: '/counselor/cases/:caseId',
    element: (
      <Access roles={['counselor']}>
        <PageTransition>
          <VictimSupportWorkspace />
        </PageTransition>
      </Access>
    )
  },
  {
    path: '/counselor/appointments',
    element: (
      <Access roles={['counselor']}>
        <PageTransition>
          <AppointmentsView />
        </PageTransition>
      </Access>
    )
  },
  {
    path: '/counselor/supervision',
    element: (
      <Access roles={['counselor']}>
        <PageTransition>
          <ClinicalSupervisionView />
        </PageTransition>
      </Access>
    )
  }
];
