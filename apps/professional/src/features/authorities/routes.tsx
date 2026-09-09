import {type RouteObject} from 'react-router-dom';
import {Access} from '../../session';
import {AuthorityLanding,type WorkspaceRole} from './AuthorityLanding';
import './authorities.css';
import {DistrictOverview} from './DistrictOverview';
import {AlertCentre} from './AlertCentre';
import {InterventionQueue} from './InterventionQueue';
import {AssignedCases} from './AssignedCases';
import {ServiceCapacity} from './ServiceCapacity';
import {EscalationQueue} from './EscalationQueue';
import {ActionHistory} from './ActionHistory';
import {DistrictTaskDetail} from './DistrictTaskDetail';
import {MonitoringDashboard} from './MonitoringDashboard';
import {StateOverview} from './StateOverview';
import {StateDistrictComparison} from './StateDistrictComparison';
import {StateResourceGaps} from './StateResourceGaps';
import {StateCrossDistrictWork} from './StateCrossDistrictWork';
import {StateEscalations} from './StateEscalations';
import {NationalOverview} from './NationalOverview';
import {NationalStateComparison} from './NationalStateComparison';
import {NationalCoverage} from './NationalCoverage';
import {NationalSystemicGaps} from './NationalSystemicGaps';
import {NationalEscalations} from './NationalEscalations';
export function createAuthorityRoutes(onSelect:(role:WorkspaceRole)=>void):RouteObject[]{return [
 {path:'/authorities',element:<Access roles={['counselor','district','state','national']}><AuthorityLanding onSelect={onSelect}/></Access>},
 {path:'/authorities/district',element:<Access roles={['district']}><DistrictOverview/></Access>},
 {path:'/authorities/district/alerts',element:<Access roles={['district']}><AlertCentre/></Access>},
 {path:'/authorities/district/interventions',element:<Access roles={['district']}><InterventionQueue/></Access>},
 {path:'/authorities/district/cases',element:<Access roles={['district']}><AssignedCases/></Access>},
 {path:'/authorities/district/capacity',element:<Access roles={['district']}><ServiceCapacity/></Access>},
 {path:'/authorities/district/escalations',element:<Access roles={['district']}><EscalationQueue/></Access>},
 {path:'/authorities/district/history',element:<Access roles={['district']}><ActionHistory/></Access>},
 {path:'/authorities/district/tasks/:taskId',element:<Access roles={['district']}><DistrictTaskDetail/></Access>},
 {path:'/authorities/state',element:<Access roles={['state']}><StateOverview/></Access>},
 {path:'/authorities/state/districts',element:<Access roles={['state']}><StateDistrictComparison/></Access>},
 {path:'/authorities/state/capacity',element:<Access roles={['state']}><StateResourceGaps/></Access>},
 {path:'/authorities/state/cross-district',element:<Access roles={['state']}><StateCrossDistrictWork/></Access>},
 {path:'/authorities/state/escalations',element:<Access roles={['state']}><StateEscalations/></Access>},
 {path:'/authorities/state/reporting',element:<Access roles={['state']}><StateOverview/></Access>},
 {path:'/authorities/national',element:<Access roles={['national']}><NationalOverview/></Access>},
 {path:'/authorities/national/states',element:<Access roles={['national']}><NationalStateComparison/></Access>},
 {path:'/authorities/national/coverage',element:<Access roles={['national']}><NationalCoverage/></Access>},
 {path:'/authorities/national/gaps',element:<Access roles={['national']}><NationalSystemicGaps/></Access>},
 {path:'/authorities/national/escalations',element:<Access roles={['national']}><NationalEscalations/></Access>},
 {path:'/authorities/national/reporting',element:<Access roles={['national']}><NationalOverview/></Access>},
];}