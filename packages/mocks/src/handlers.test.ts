import {afterAll,afterEach,beforeAll,describe,expect,it} from 'vitest';
import {setupServer} from 'msw/node';
import {handlers,resetFixtures} from './handlers';
const server=setupServer(...handlers);
beforeAll(()=>server.listen({onUnhandledRequest:'error'}));afterEach(()=>resetFixtures());afterAll(()=>server.close());
const get=(path:string,role:string)=>fetch('http://localhost/api'+path,{headers:{'X-Demo-Role':role}});
describe('demo contracts and disclosure',()=>{
 it('does not disclose counselor evidence to district roles',async()=>{expect((await get('/counselor/cases','district')).status).toBe(403);const body=await(await get('/authority/tasks','district')).json();expect(JSON.stringify(body)).not.toContain('statement');expect(JSON.stringify(body)).not.toContain('difficult to sleep');});
 it('provides aggregate national results',async()=>{const body=await(await get('/monitoring','national')).json();expect(body.monitoredVictims).toBe(1);expect(JSON.stringify(body)).not.toContain('Riya');expect(JSON.stringify(body)).not.toContain('DEMO-NHAA');});
 it('acknowledges once without claiming delivery',async()=>{const send=()=>fetch('http://localhost/api/authority/tasks/task-demo-001/acknowledge',{method:'POST',headers:{'X-Demo-Role':'district'}});const result=await send();expect(result.status).toBe(200);expect((await result.json()).status).toBe('ACKNOWLEDGED');expect((await send()).status).toBe(409);});
});

