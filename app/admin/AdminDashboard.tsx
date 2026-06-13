'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Rec { id: string; createdTime: string; fields: Record<string, unknown> }

interface Stats {
  totalCandidates: number; inPipeline: number; docsIncomplete: number;
  activeVacancies: number; pendingEmployers: number;
  statusBreakdown: Record<string, number>;
  recentCandidates: Array<{ id:string; name:unknown; profession:unknown; status:unknown; country:unknown; docProgress:number }>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DOC_TYPES = [
  'Passport','ID Card','Medical Certificate','Criminal Record Certificate',
  'Apostille','WVG Contract','3L Israel Contract','Deposit Agreement',
  'Notarial Enforcement Agreement','Affidavit','Declaration',
  'Recommendation Letter','CV','Photo',
];
const STATUSES = ['New','Screening','Docs Collection','Ready For Employer','Placed','Rejected'];
const STAGE_COLOR: Record<string,string> = {
  New:'#2563eb', Screening:'#d97706', 'Docs Collection':'#16a34a',
  'Ready For Employer':'#0d9488', Placed:'#0f2557', Rejected:'#dc2626',
};
const STATUS_BG: Record<string,string> = {
  New:'#eff6ff', Screening:'#fffbeb', 'Docs Collection':'#f0fdf4',
  'Ready For Employer':'#ecfdf5', Placed:'#0f2557', Rejected:'#fef2f2',
  Pending:'#fefce8', Approved:'#f0fdf4', Active:'#eff6ff', Inactive:'#f9fafb',
};
const STATUS_COLOR: Record<string,string> = {
  New:'#1e40af', Screening:'#92400e', 'Docs Collection':'#14532d',
  'Ready For Employer':'#065f46', Placed:'#c9a84c', Rejected:'#991b1b',
  Pending:'#a16207', Approved:'#14532d', Active:'#1e40af', Inactive:'#374151',
};

// ── API helper ────────────────────────────────────────────────────────────────

async function api<T = unknown>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (res.status === 401) { window.location.href = '/admin/login'; throw new Error('UNAUTHORIZED'); }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `API ${res.status}`);
  return data as T;
}

// ── Tiny primitives ───────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width:'100%', padding:'8px 12px', border:'1px solid #e2e8f0',
  borderRadius:8, fontSize:13, color:'#1e293b', background:'#fff',
  fontFamily:'inherit', outline:'none', boxSizing:'border-box',
};

function Lbl({ children }: { children: React.ReactNode }) {
  return <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#64748b', marginBottom:5, textTransform:'uppercase', letterSpacing:'.4px' }}>{children}</label>;
}
function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{ marginBottom:14 }}><Lbl>{label}</Lbl>{children}</div>;
}

function Btn({ children, onClick, v='default', sz='md', disabled, type='button' }: {
  children: React.ReactNode; onClick?: () => void;
  v?: 'default'|'primary'|'gold'|'danger'|'ghost';
  sz?: 'sm'|'md'; disabled?: boolean; type?: 'button'|'submit';
}) {
  const bgMap = { default:'#fff', primary:'#0f2557', gold:'#c9a84c', danger:'#fef2f2', ghost:'transparent' };
  const clMap = { default:'#334155', primary:'#fff', gold:'#0f2557', danger:'#dc2626', ghost:'#64748b' };
  const bdMap = { default:'#e2e8f0', primary:'#0f2557', gold:'#c9a84c', danger:'#fca5a5', ghost:'transparent' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding: sz==='sm' ? '4px 10px' : '7px 14px',
      borderRadius:8, border:`1px solid ${bdMap[v]}`,
      background: disabled ? '#f1f5f9' : bgMap[v],
      color: disabled ? '#94a3b8' : clMap[v],
      fontSize: sz==='sm' ? 12 : 13, fontWeight:500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily:'inherit', whiteSpace:'nowrap' as const,
    }}>{children}</button>
  );
}

function Badge({ status }: { status: string }) {
  return (
    <span style={{
      display:'inline-block', padding:'2px 8px', borderRadius:10,
      fontSize:11, fontWeight:600,
      background: STATUS_BG[status] ?? '#f1f5f9',
      color: STATUS_COLOR[status] ?? '#334155',
    }}>{status||'New'}</span>
  );
}

function Spinner() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:13, padding:'20px 0' }}>
      <div style={{ width:14, height:14, border:'2px solid #e2e8f0', borderTopColor:'#0f2557', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      Loading…
    </div>
  );
}

function Toast({ msg, type, onClose }: { msg:string; type:'ok'|'err'; onClose:()=>void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position:'fixed', bottom:20, right:20, zIndex:300,
      background: type==='ok' ? '#0f2557' : '#991b1b',
      color:'#fff', padding:'10px 18px', borderRadius:8, fontSize:13,
      boxShadow:'0 4px 16px rgba(0,0,0,.15)', display:'flex', alignItems:'center', gap:8,
    }}>
      {type==='ok' ? '✓' : '✕'} {msg}
      <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,.6)', cursor:'pointer', fontSize:18, padding:0, marginLeft:4 }}>×</button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: { title:string; onClose:()=>void; children:React.ReactNode; wide?:boolean }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()} style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:200,
      display:'flex', alignItems:'flex-start', justifyContent:'center',
      paddingTop:48, overflowY:'auto',
    }}>
      <div style={{
        background:'#fff', borderRadius:14, padding:28,
        width: wide ? 720 : 580, maxWidth:'95vw',
        position:'relative', maxHeight:'85vh', overflowY:'auto',
        border:'0.5px solid #e2e8f0',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontSize:16, fontWeight:600, color:'#0f2557', margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#94a3b8', padding:4, borderRadius:6, lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── TabBar ────────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t:string)=>void }) {
  return (
    <div style={{ display:'flex', borderBottom:'1px solid #e2e8f0', marginBottom:20 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding:'8px 16px', fontSize:13, cursor:'pointer', background:'none',
          border:'none', fontFamily:'inherit',
          color: active===t ? '#0f2557' : '#64748b',
          borderBottom:`2px solid ${active===t ? '#0f2557' : 'transparent'}`,
          fontWeight: active===t ? 600 : 400, marginBottom:-1,
        }}>{t}</button>
      ))}
    </div>
  );
}

// ── Candidate detail modal (self-contained with tab state) ────────────────────

function CandidateModal({
  candidate, onClose, onSaved, onDocSaved,
}: {
  candidate: Rec; onClose: ()=>void;
  onSaved: (updated: Rec) => void;
  onDocSaved: () => void;
}) {
  const [tab, setTab] = useState<'info'|'docs'|'status'|'edit'>('info');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const f = candidate.fields;
  const docStatus = (f['Document Status'] as Record<string,string>) ?? {};
  const approved = Object.values(docStatus).filter(v=>v==='Approved').length;
  const pct = Math.round((approved/14)*100);

  // Status/payment tab state
  const [newStatus, setNewStatus] = useState(String(f['Candidate Status'] ?? 'New'));
  const [regFee, setRegFee] = useState(Boolean(f['Registration Fee Paid']));
  const [secDep, setSecDep] = useState(Boolean(f['Security Deposit Paid']));

  // Edit tab state
  const [editFields, setEditFields] = useState({
    Name: String(f['Name'] ?? ''),
    Phone: String(f['Phone'] ?? ''),
    WhatsApp: String(f['WhatsApp'] ?? ''),
    Profession: String(f['Profession'] ?? ''),
    'Destination Country': String(f['Destination Country'] ?? ''),
    'Work Experience': String(f['Work Experience'] ?? ''),
    Notes: String(f['Notes'] ?? ''),
  });

  async function saveStatus() {
    setSaving(true);
    try {
      const updated = await api<Rec>(`/candidates/${candidate.id}`, {
        method:'PATCH',
        body: JSON.stringify({ 'Candidate Status': newStatus, 'Registration Fee Paid': regFee, 'Security Deposit Paid': secDep }),
      });
      onSaved(updated);
      setToast('Status saved');
    } catch (e) { setToast((e as Error).message); }
    setSaving(false);
  }

  async function saveEdit() {
    if (!editFields.Name.trim()) { setToast('Name is required'); return; }
    setSaving(true);
    try {
      const updated = await api<Rec>(`/candidates/${candidate.id}`, {
        method:'PATCH', body: JSON.stringify(editFields),
      });
      onSaved(updated);
      setToast('Saved');
    } catch (e) { setToast((e as Error).message); }
    setSaving(false);
  }

  async function updateDoc(docName: string, value: string) {
    try {
      await api(`/candidates/${candidate.id}`, {
        method:'PATCH',
        body: JSON.stringify({ 'Document Status': { ...docStatus, [docName]: value } }),
      });
      onDocSaved();
    } catch (e) { setToast((e as Error).message); }
  }

  return (
    <Modal title={String(f['Name'] ?? '—')} onClose={onClose} wide>
      {toast && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#15803d', marginBottom:12 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <Badge status={String(f['Candidate Status'] ?? 'New')} />
        <span style={{ fontSize:12, color:'#64748b' }}>Docs: {approved}/14 approved ({pct}%)</span>
        <div style={{ flex:1, height:4, background:'#e2e8f0', borderRadius:2, overflow:'hidden', maxWidth:120 }}>
          <div style={{ width:`${pct}%`, height:'100%', background: pct===100?'#22c55e':'#0f2557', borderRadius:2 }} />
        </div>
      </div>

      <TabBar
        tabs={['Info','Documents','Status & Payments','Edit']}
        active={{ info:'Info', docs:'Documents', status:'Status & Payments', edit:'Edit' }[tab]}
        onChange={t => setTab({ Info:'info', Documents:'docs', 'Status & Payments':'status', Edit:'edit' }[t] as typeof tab)}
      />

      {/* ── INFO ── */}
      {tab==='info' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 24px' }}>
          {([
            ['Full Name', f['Name']], ['Profession', f['Profession']],
            ['Status', f['Candidate Status']], ['Destination', f['Destination Country']],
            ['Phone', f['Phone']], ['WhatsApp', f['WhatsApp']],
            ['Date of Birth', f['Date of Birth']], ['Experience', f['Work Experience']],
            ['Has Passport', f['Has Passport'] ? 'Yes' : 'No'],
            ['Worked in Israel', f['Worked in Israel'] ? 'Yes' : 'No'],
            ['Reg. Fee', f['Registration Fee Paid'] ? '✓ Paid (300 GEL)' : '✗ Not paid'],
            ['Security Deposit', f['Security Deposit Paid'] ? '✓ Paid' : '✗ Not paid'],
          ] as [string, unknown][]).map(([l, v]) => (
            <div key={l} style={{ borderBottom:'1px solid #f1f5f9', padding:'7px 0', display:'flex', justifyContent:'space-between', gap:8 }}>
              <span style={{ fontSize:12, color:'#64748b', flexShrink:0 }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:500, textAlign:'right' }}>{String(v??'—')}</span>
            </div>
          ))}
          {!!f['Notes'] && (
            <div style={{ gridColumn:'1/-1', borderBottom:'1px solid #f1f5f9', padding:'7px 0' }}>
              <span style={{ fontSize:12, color:'#64748b' }}>Notes</span>
              <div style={{ fontSize:13, marginTop:4, color:'#475569', lineHeight:1.5 }}>{String(f['Notes'])}</div>
            </div>
          )}
        </div>
      )}

      {/* ── DOCUMENTS ── */}
      {tab==='docs' && (
        <div>
          <p style={{ fontSize:12, color:'#64748b', marginBottom:14 }}>{approved}/14 approved — click a status to update instantly</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:8 }}>
            {DOC_TYPES.map(doc => {
              const st = docStatus[doc] ?? 'Missing';
              const bg = st==='Approved'?'#f0fdf4': st==='Pending'?'#fefce8':'#fef2f2';
              const bd = st==='Approved'?'#bbf7d0': st==='Pending'?'#fef08a':'#fca5a5';
              return (
                <div key={doc} style={{ background:bg, border:`1px solid ${bd}`, borderRadius:8, padding:'8px 10px' }}>
                  <div style={{ fontSize:12, fontWeight:500, marginBottom:5 }}>{doc}</div>
                  <select
                    defaultValue={st}
                    onChange={e => updateDoc(doc, e.target.value)}
                    style={{ ...inp, padding:'3px 7px', fontSize:11, background:'#fff' }}
                  >
                    <option>Missing</option>
                    <option>Pending</option>
                    <option>Approved</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STATUS & PAYMENTS ── */}
      {tab==='status' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <Field label="Candidate Status">
              <select style={inp} value={newStatus} onChange={e=>setNewStatus(e.target.value)}>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Registration Fee 300 GEL">
              <select style={inp} value={regFee?'1':'0'} onChange={e=>setRegFee(e.target.value==='1')}>
                <option value="0">Not Paid</option>
                <option value="1">✓ Paid</option>
              </select>
            </Field>
            <Field label="Security Deposit">
              <select style={inp} value={secDep?'1':'0'} onChange={e=>setSecDep(e.target.value==='1')}>
                <option value="0">Not Paid</option>
                <option value="1">✓ Paid</option>
              </select>
            </Field>
          </div>
          <Btn v="gold" onClick={saveStatus} disabled={saving}>{saving?'Saving…':'Save changes'}</Btn>
        </div>
      )}

      {/* ── EDIT ── */}
      {tab==='edit' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {(['Name','Phone','WhatsApp','Work Experience'] as const).map(k => (
              <Field key={k} label={k}>
                <input style={inp} value={editFields[k as keyof typeof editFields] ?? ''} onChange={e=>setEditFields(p=>({...p,[k]:e.target.value}))} />
              </Field>
            ))}
            <Field label="Profession">
              <select style={inp} value={editFields.Profession} onChange={e=>setEditFields(p=>({...p,Profession:e.target.value}))}>
                {['Construction Worker','Welder','Electrician','Mechanic','Facade Worker','Factory Worker','Industrial Worker','Driver','General Worker','Other'].map(p=><option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Destination Country">
              <select style={inp} value={editFields['Destination Country']} onChange={e=>setEditFields(p=>({...p,'Destination Country':e.target.value}))}>
                <option>Israel</option><option>Germany</option><option>Poland</option><option>Slovakia</option><option>Hungary</option>
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea style={{ ...inp, minHeight:70, resize:'vertical' }} value={editFields.Notes} onChange={e=>setEditFields(p=>({...p,Notes:e.target.value}))} />
          </Field>
          <Btn v="gold" onClick={saveEdit} disabled={saving}>{saving?'Saving…':'Save changes'}</Btn>
        </div>
      )}
    </Modal>
  );
}

// ── Add Candidate modal ───────────────────────────────────────────────────────

function AddCandidateModal({ onClose, onCreated }: { onClose:()=>void; onCreated:(r:Rec)=>void }) {
  const [f, setF] = useState({
    Name:'', Phone:'', WhatsApp:'', Profession:'Construction Worker',
    'Destination Country':'Israel', 'Candidate Status':'New',
    'Date of Birth':'', 'Work Experience':'',
    'Has Passport':'false', 'Worked in Israel':'false',
  });
  const [saving, setSaving] = useState(false);
  const [err2, setErr] = useState('');

  async function submit() {
    if (!f.Name.trim()) { setErr('Full name is required'); return; }
    setSaving(true); setErr('');
    try {
      const record = await api<Rec>('/candidates', {
        method:'POST',
        body: JSON.stringify({ ...f, 'Has Passport':f['Has Passport']==='true', 'Worked in Israel':f['Worked in Israel']==='true' }),
      });
      onCreated(record);
      onClose();
    } catch(e) { setErr((e as Error).message); setSaving(false); }
  }

  return (
    <Modal title="Add candidate" onClose={onClose}>
      {err2 && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#dc2626', marginBottom:12 }}>{err2}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ gridColumn:'1/-1' }}><Field label="Full Name *"><input style={inp} value={f.Name} onChange={e=>setF(p=>({...p,Name:e.target.value}))} placeholder="სახელი გვარი" /></Field></div>
        <Field label="Phone *"><input style={inp} value={f.Phone} onChange={e=>setF(p=>({...p,Phone:e.target.value}))} placeholder="+995 5XX..." /></Field>
        <Field label="WhatsApp"><input style={inp} value={f.WhatsApp} onChange={e=>setF(p=>({...p,WhatsApp:e.target.value}))} placeholder="+995 5XX..." /></Field>
        <Field label="Profession">
          <select style={inp} value={f.Profession} onChange={e=>setF(p=>({...p,Profession:e.target.value}))}>
            {['Construction Worker','Welder','Electrician','Mechanic','Facade Worker','Factory Worker','Industrial Worker','Driver','General Worker','Other'].map(x=><option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Destination Country">
          <select style={inp} value={f['Destination Country']} onChange={e=>setF(p=>({...p,'Destination Country':e.target.value}))}>
            <option>Israel</option><option>Germany</option><option>Poland</option><option>Slovakia</option>
          </select>
        </Field>
        <Field label="Status">
          <select style={inp} value={f['Candidate Status']} onChange={e=>setF(p=>({...p,'Candidate Status':e.target.value}))}>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Date of Birth"><input type="date" style={inp} value={f['Date of Birth']} onChange={e=>setF(p=>({...p,'Date of Birth':e.target.value}))} /></Field>
        <Field label="Experience"><input style={inp} value={f['Work Experience']} onChange={e=>setF(p=>({...p,'Work Experience':e.target.value}))} placeholder="e.g. 3 years" /></Field>
        <Field label="Has Passport">
          <select style={inp} value={f['Has Passport']} onChange={e=>setF(p=>({...p,'Has Passport':e.target.value}))}>
            <option value="false">No</option><option value="true">Yes</option>
          </select>
        </Field>
        <Field label="Worked in Israel Before">
          <select style={inp} value={f['Worked in Israel']} onChange={e=>setF(p=>({...p,'Worked in Israel':e.target.value}))}>
            <option value="false">No</option><option value="true">Yes</option>
          </select>
        </Field>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <Btn v="gold" onClick={submit} disabled={saving}>{saving?'Creating…':'Create candidate'}</Btn>
        <Btn onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}

// ── Vacancy modal ─────────────────────────────────────────────────────────────

function VacancyModal({ vacancy, onClose, onSaved }: { vacancy?:Rec; onClose:()=>void; onSaved:(r:Rec)=>void }) {
  const f = vacancy?.fields ?? {};
  const [vals, setVals] = useState({
    'Position Name': String(f['Position Name']??''),
    Country: String(f.Country??'Israel'),
    Salary: String(f.Salary??''),
    'Workers Needed': String(f['Workers Needed']??'1'),
    Status: String(f.Status??'Active'),
    Schedule: String(f.Schedule??''),
    Notes: String(f.Notes??''),
  });
  const [saving, setSaving] = useState(false);
  const [err2, setErr] = useState('');

  async function submit() {
    if (!vals['Position Name'].trim()) { setErr('Position name is required'); return; }
    setSaving(true); setErr('');
    try {
      const body = { ...vals, 'Workers Needed': Number(vals['Workers Needed']) || 1 };
      const record = vacancy
        ? await api<Rec>(`/vacancies/${vacancy.id}`, { method:'PATCH', body:JSON.stringify(body) })
        : await api<Rec>('/vacancies', { method:'POST', body:JSON.stringify(body) });
      onSaved(record);
      onClose();
    } catch(e) { setErr((e as Error).message); setSaving(false); }
  }

  return (
    <Modal title={vacancy ? 'Edit vacancy' : 'Create vacancy'} onClose={onClose}>
      {err2 && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:6, padding:'6px 12px', fontSize:12, color:'#dc2626', marginBottom:12 }}>{err2}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <Field label="Position Name *"><input style={inp} value={vals['Position Name']} onChange={e=>setVals(p=>({...p,'Position Name':e.target.value}))} /></Field>
        </div>
        <Field label="Country"><input style={inp} value={vals.Country} onChange={e=>setVals(p=>({...p,Country:e.target.value}))} /></Field>
        <Field label="Salary"><input style={inp} value={vals.Salary} onChange={e=>setVals(p=>({...p,Salary:e.target.value}))} placeholder="e.g. $1800–2400/mo" /></Field>
        <Field label="Workers Needed"><input type="number" min={1} style={inp} value={vals['Workers Needed']} onChange={e=>setVals(p=>({...p,'Workers Needed':e.target.value}))} /></Field>
        <Field label="Status">
          <select style={inp} value={vals.Status} onChange={e=>setVals(p=>({...p,Status:e.target.value}))}>
            <option>Active</option><option>Inactive</option><option>Draft</option>
          </select>
        </Field>
        <Field label="Schedule"><input style={inp} value={vals.Schedule} onChange={e=>setVals(p=>({...p,Schedule:e.target.value}))} placeholder="6/1, 5/2…" /></Field>
      </div>
      <Field label="Notes / Requirements">
        <textarea style={{ ...inp, minHeight:70, resize:'vertical' }} value={vals.Notes} onChange={e=>setVals(p=>({...p,Notes:e.target.value}))} />
      </Field>
      <div style={{ display:'flex', gap:8, marginTop:4 }}>
        <Btn v="gold" onClick={submit} disabled={saving}>{saving?'Saving…': vacancy?'Save changes':'Create vacancy'}</Btn>
        <Btn onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard({ username }: { username: string }) {
  const router = useRouter();
  const [panel, setPanel] = useState('dashboard');

  // Data
  const [stats, setStats] = useState<Stats|null>(null);
  const [candidates, setCandidates] = useState<Rec[]>([]);
  const [vacancies, setVacancies] = useState<Rec[]>([]);
  const [employers, setEmployers] = useState<Rec[]>([]);
  const [docCands, setDocCands] = useState<(Rec & {_docPct:number;_docApproved:number})[]>([]);
  const [monitoring, setMonitoring] = useState<Rec[]>([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [detailCandidate, setDetailCandidate] = useState<Rec|null>(null);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [editVacancy, setEditVacancy] = useState<Rec|null|'new'>(null);

  // Toast
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null);
  const showToast = (msg:string, type:'ok'|'err'='ok') => setToast({msg,type});

  // Filters
  const [candSearch, setCandSearch] = useState('');
  const [candStatus, setCandStatus] = useState('');
  const [docFilter, setDocFilter] = useState('missing');
  const [empFilter, setEmpFilter] = useState('');

  // ── Loaders ───────────────────────────────────────────────────────────────

  const loadCore = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c, v, e] = await Promise.all([
        api<Stats>('/stats'),
        api<Rec[]>('/candidates'),
        api<Rec[]>('/vacancies'),
        api<Rec[]>('/employers'),
      ]);
      setStats(s); setCandidates(c); setVacancies(v); setEmployers(e);
    } catch(e) {
      if ((e as Error).message!=='UNAUTHORIZED') showToast('Failed to load data','err');
    } finally { setLoading(false); }
  }, []);

  const loadDocs = useCallback(async () => {
    try { setDocCands(await api(`/documents?filter=${docFilter}`)); }
    catch(e) { showToast((e as Error).message,'err'); }
  }, [docFilter]);

  const loadMonitoring = useCallback(async () => {
    try { setMonitoring(await api('/monitoring')); }
    catch(e) { showToast((e as Error).message,'err'); }
  }, []);

  useEffect(() => { loadCore(); }, [loadCore]);
  useEffect(() => { if (panel==='documents') loadDocs(); }, [panel, docFilter, loadDocs]);
  useEffect(() => { if (panel==='monitoring') loadMonitoring(); }, [panel, loadMonitoring]);

  // ── Employer action ───────────────────────────────────────────────────────

  async function updateEmployerStatus(id:string, status:string) {
    try {
      const updated = await api<Rec>(`/employers/${id}`, { method:'PATCH', body:JSON.stringify({status}) });
      setEmployers(prev => prev.map(e=>e.id===id?updated:e));
      showToast(`Marked as ${status}`);
      loadCore();
    } catch(e) { showToast((e as Error).message,'err'); }
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const filteredCandidates = candidates.filter(c => {
    const f = c.fields;
    const q = candSearch.toLowerCase();
    return (
      (!q || String(f.Name??'').toLowerCase().includes(q) || String(f.Profession??'').toLowerCase().includes(q) || String(f.Phone??'').includes(q)) &&
      (!candStatus || f['Candidate Status']===candStatus)
    );
  });

  const filteredEmployers = empFilter ? employers.filter(e=>e.fields['Request Status']===empFilter) : employers;

  const pipelineGroups = STATUSES.reduce((acc,s) => {
    acc[s] = candidates.filter(c=>(c.fields['Candidate Status']??'New')===s);
    return acc;
  }, {} as Record<string,Rec[]>);

  // ── Nav items ─────────────────────────────────────────────────────────────

  const nav = [
    { id:'dashboard', icon:'⊞', label:'Dashboard' },
    { id:'candidates', icon:'👥', label:'Candidates', badge:candidates.length },
    { id:'pipeline', icon:'📋', label:'Pipeline' },
    { id:'documents', icon:'📁', label:'Documents', badge:stats?.docsIncomplete, btype:'danger' as const },
    { id:'vacancies', icon:'💼', label:'Vacancies', badge:stats?.activeVacancies, btype:'green' as const },
    { id:'employers', icon:'🏢', label:'Employers', badge:stats?.pendingEmployers, btype:'amber' as const },
    { id:'monitoring', icon:'🛰️', label:'Israel Monitor' },
  ];

  const badgeBg:Record<string,string> = { danger:'#fef2f2', green:'#f0fdf4', amber:'#fefce8', default:'#f1f5f9' };
  const badgeCl:Record<string,string> = { danger:'#dc2626', green:'#15803d', amber:'#a16207', default:'#475569' };

  // ── Sidebar helper ────────────────────────────────────────────────────────

  async function logout() {
    await fetch('/api/admin/auth/logout', { method:'POST' });
    router.push('/admin/login');
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Inter',system-ui,sans-serif", fontSize:14, background:'#f8fafc' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        input:focus,select:focus,textarea:focus{border-color:#0f2557!important;box-shadow:0 0 0 2px rgba(15,37,87,.1)!important;outline:none!important}
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{ width:220, flexShrink:0, background:'#fff', borderRight:'0.5px solid #e2e8f0', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'16px 14px 12px', borderBottom:'0.5px solid #e2e8f0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:34, height:34, background:'#0f2557', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#c9a84c', letterSpacing:-.5, flexShrink:0 }}>WVG</div>
          <div>
            <div style={{ fontWeight:600, fontSize:13, color:'#0f2557' }}>Admin Panel</div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>Workforce OS</div>
          </div>
        </div>

        <nav style={{ padding:'10px 8px', flex:1 }}>
          {nav.map(item => (
            <div key={item.id} onClick={()=>setPanel(item.id)} style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'7px 10px', borderRadius:8, cursor:'pointer',
              background: panel===item.id ? '#0f2557' : 'transparent',
              color: panel===item.id ? '#fff' : '#64748b',
              fontSize:13, marginBottom:2, transition:'background .12s',
            }}>
              <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge!==undefined && item.badge>0 && (
                <span style={{
                  fontSize:10, fontWeight:700, padding:'1px 6px', borderRadius:10,
                  background: badgeBg[item.btype??'default'],
                  color: badgeCl[item.btype??'default'],
                }}>{item.badge}</span>
              )}
            </div>
          ))}
        </nav>

        <div style={{ padding:'10px 8px', borderTop:'0.5px solid #e2e8f0' }}>
          <div style={{ fontSize:11, color:'#94a3b8', padding:'4px 10px', marginBottom:6 }}>
            Signed in as <strong style={{ color:'#475569' }}>{username}</strong>
          </div>
          <button onClick={logout} style={{ width:'100%', padding:'7px 10px', background:'none', border:'1px solid #e2e8f0', borderRadius:8, fontSize:12, color:'#64748b', cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>
            ⎋ Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Topbar */}
        <div style={{ height:52, background:'#fff', borderBottom:'0.5px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0 }}>
          <div style={{ fontWeight:600, fontSize:15, color:'#0f2557' }}>
            {nav.find(n=>n.id===panel)?.label ?? 'Dashboard'}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#64748b', padding:'4px 10px', background:'#f8fafc', borderRadius:20, border:'0.5px solid #e2e8f0' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e' }} /> Airtable
            </div>
            <Btn sz="sm" onClick={loadCore}>↻ Refresh</Btn>
            <Btn sz="sm" v="gold" onClick={()=>setShowAddCandidate(true)}>+ Candidate</Btn>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:24 }}>

          {/* ── DASHBOARD ── */}
          {panel==='dashboard' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
                {[
                  {label:'Total Candidates', value:stats?.totalCandidates, to:'candidates'},
                  {label:'In Pipeline', value:stats?.inPipeline, to:'pipeline'},
                  {label:'Missing Docs', value:stats?.docsIncomplete, to:'documents', danger:true},
                  {label:'Active Vacancies', value:stats?.activeVacancies, to:'vacancies'},
                  {label:'Employer Requests', value:stats?.pendingEmployers, to:'employers'},
                ].map(s => (
                  <div key={s.label} onClick={()=>setPanel(s.to)} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16, cursor:'pointer' }}>
                    <div style={{ fontSize:12, color:'#64748b', marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontSize:28, fontWeight:600, color: s.danger ? '#dc2626' : '#0f2557', lineHeight:1 }}>
                      {loading ? '…' : (s.value ?? '—')}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                    <strong style={{ color:'#0f2557' }}>Recent Candidates</strong>
                    <Btn sz="sm" onClick={()=>setPanel('candidates')}>View all</Btn>
                  </div>
                  {loading ? <Spinner /> : (stats?.recentCandidates ?? []).map(c => {
                    const cRec = candidates.find(r=>r.id===c.id);
                    return (
                      <div key={c.id} onClick={()=>cRec&&setDetailCandidate(cRec)}
                        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'0.5px solid #f1f5f9', cursor:'pointer' }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500 }}>{String(c.name??'—')}</div>
                          <div style={{ fontSize:11, color:'#94a3b8' }}>{String(c.profession??'')}</div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <Badge status={String(c.status??'New')} />
                          <span style={{ fontSize:11, fontWeight:600, color: c.docProgress===100?'#15803d':c.docProgress>=70?'#a16207':'#dc2626' }}>
                            {c.docProgress}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:20 }}>
                  <strong style={{ color:'#0f2557', display:'block', marginBottom:14 }}>Status Breakdown</strong>
                  {loading ? <Spinner /> : Object.entries(stats?.statusBreakdown ?? {}).map(([s,n]) => (
                    <div key={s} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'0.5px solid #f1f5f9' }}>
                      <Badge status={s} />
                      <span style={{ fontWeight:600, fontSize:14 }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CANDIDATES ── */}
          {panel==='candidates' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
                <input placeholder="Search name, phone, profession…" value={candSearch} onChange={e=>setCandSearch(e.target.value)}
                  style={{ ...inp, width:260, padding:'7px 12px' }} />
                <select value={candStatus} onChange={e=>setCandStatus(e.target.value)} style={{ ...inp, width:190 }}>
                  <option value="">All statuses</option>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
                <Btn v="primary" onClick={()=>setShowAddCandidate(true)}>+ Add</Btn>
              </div>
              <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
                  <thead>
                    <tr style={{ background:'#f8fafc' }}>
                      {[['Name',160],['Profession',120],['Status',110],['Country',80],['Docs',60],['Phone',110],[' ',90]].map(([h,w])=>(
                        <th key={String(h)} style={{ width:w as number, padding:'9px 12px', fontSize:11, fontWeight:600, color:'#64748b', textAlign:'left', borderBottom:'0.5px solid #e2e8f0', textTransform:'uppercase', letterSpacing:'.4px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} style={{ padding:24 }}><Spinner /></td></tr>
                    ) : filteredCandidates.length===0 ? (
                      <tr><td colSpan={7} style={{ padding:32, textAlign:'center', color:'#94a3b8' }}>No candidates found</td></tr>
                    ) : filteredCandidates.map(c => {
                      const f = c.fields;
                      const ds = (f['Document Status'] as Record<string,string>) ?? {};
                      const pct = Math.round((Object.values(ds).filter(v=>v==='Approved').length/14)*100);
                      return (
                        <tr key={c.id} onClick={()=>setDetailCandidate(c)} style={{ cursor:'pointer', borderBottom:'0.5px solid #f1f5f9' }}>
                          <td style={{ padding:'10px 12px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Name??'—')}</td>
                          <td style={{ padding:'10px 12px', color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Profession??'—')}</td>
                          <td style={{ padding:'10px 12px' }}><Badge status={String(f['Candidate Status']??'New')} /></td>
                          <td style={{ padding:'10px 12px', color:'#475569' }}>{String(f['Destination Country']??'—')}</td>
                          <td style={{ padding:'10px 12px', fontWeight:600, color: pct===100?'#15803d':pct>=70?'#a16207':'#dc2626' }}>{pct}%</td>
                          <td style={{ padding:'10px 12px', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Phone??'—')}</td>
                          <td style={{ padding:'10px 12px' }} onClick={e=>e.stopPropagation()}>
                            <div style={{ display:'flex', gap:4 }}>
                              <Btn sz="sm" onClick={()=>setDetailCandidate(c)}>Open</Btn>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PIPELINE ── */}
          {panel==='pipeline' && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
              {STATUSES.map(stage => (
                <div key={stage} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:10, padding:10, minHeight:140 }}>
                  <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:STAGE_COLOR[stage], display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:80 }}>{stage}</span>
                    <span style={{ background:`${STAGE_COLOR[stage]}20`, color:STAGE_COLOR[stage], padding:'1px 6px', borderRadius:8, fontWeight:700, flexShrink:0 }}>
                      {pipelineGroups[stage]?.length??0}
                    </span>
                  </div>
                  {pipelineGroups[stage]?.map(c=>(
                    <div key={c.id} onClick={()=>setDetailCandidate(c)} style={{ background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:6, padding:'7px 8px', marginBottom:5, cursor:'pointer' }}>
                      <div style={{ fontSize:12, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(c.fields.Name??'—')}</div>
                      <div style={{ fontSize:11, color:'#94a3b8', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(c.fields.Profession??'')}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {panel==='documents' && (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                <select value={docFilter} onChange={e=>setDocFilter(e.target.value)} style={{ ...inp, width:220 }}>
                  <option value="missing">Missing docs first</option>
                  <option value="all">All candidates</option>
                  <option value="complete">Complete only</option>
                </select>
              </div>
              {docCands.length===0 ? <Spinner /> : docCands.map(c => {
                const f = c.fields;
                const ds = (f['Document Status'] as Record<string,string>) ?? {};
                return (
                  <div key={c.id} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16, marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <div>
                        <div style={{ fontWeight:600 }}>{String(f.Name??'—')}</div>
                        <div style={{ fontSize:12, color:'#64748b' }}>{String(f.Profession??'')} · {String(f['Destination Country']??'')}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ width:80, height:4, background:'#e2e8f0', borderRadius:2, overflow:'hidden' }}>
                            <div style={{ width:`${c._docPct}%`, height:'100%', background: c._docPct===100?'#22c55e':'#0f2557', borderRadius:2 }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:600 }}>{c._docApproved}/14</span>
                        </div>
                        <Btn sz="sm" v="primary" onClick={()=>setDetailCandidate(c)}>Edit docs</Btn>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5 }}>
                      {DOC_TYPES.map(doc => {
                        const st = ds[doc] ?? 'Missing';
                        const bg = st==='Approved'?'#f0fdf4': st==='Pending'?'#fefce8':'#fef2f2';
                        const cl = st==='Approved'?'#15803d': st==='Pending'?'#a16207':'#dc2626';
                        return (
                          <div key={doc} style={{ background:bg, borderRadius:5, padding:'4px 6px' }}>
                            <div style={{ fontSize:9, fontWeight:600, color:'#475569', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{doc}</div>
                            <div style={{ fontSize:9, color:cl, fontWeight:700 }}>{st}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── VACANCIES ── */}
          {panel==='vacancies' && (
            <div>
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
                <Btn v="gold" onClick={()=>setEditVacancy('new')}>+ New vacancy</Btn>
              </div>
              {vacancies.length===0 ? <Spinner /> : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
                  {vacancies.map(v => {
                    const f = v.fields;
                    return (
                      <div key={v.id} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:16 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                          <h4 style={{ margin:0, fontSize:14, fontWeight:600, color:'#0f2557' }}>{String(f['Position Name']??'—')}</h4>
                          <Badge status={String(f.Status??'Active')} />
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                          {!!f.Country && <span style={{ background:'#f1f5f9', color:'#475569', borderRadius:4, padding:'2px 7px', fontSize:11 }}>📍 {String(f.Country)}</span>}
                          {!!f.Salary && <span style={{ background:'#f1f5f9', color:'#475569', borderRadius:4, padding:'2px 7px', fontSize:11 }}>💰 {String(f.Salary)}</span>}
                          {!!f['Workers Needed'] && <span style={{ background:'#f1f5f9', color:'#475569', borderRadius:4, padding:'2px 7px', fontSize:11 }}>👷 {String(f['Workers Needed'])}</span>}
                        </div>
                        <Btn sz="sm" onClick={()=>setEditVacancy(v)}>Edit</Btn>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── EMPLOYERS ── */}
          {panel==='employers' && (
            <div>
              <div style={{ marginBottom:16 }}>
                <select value={empFilter} onChange={e=>setEmpFilter(e.target.value)} style={{ ...inp, width:200 }}>
                  <option value="">All statuses</option>
                  <option>Pending</option><option>Approved</option><option>Active</option><option>Rejected</option>
                </select>
              </div>
              {filteredEmployers.length===0 ? (
                <div style={{ textAlign:'center', padding:48, color:'#94a3b8' }}>No employer requests</div>
              ) : filteredEmployers.map(e => {
                const f = e.fields;
                return (
                  <div key={e.id} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, padding:18, marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:15 }}>{String(f['Company Name']??'—')}</div>
                        <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{String(f.Country??'')} · {String(f['Contact Email']??'')}</div>
                      </div>
                      <Badge status={String(f['Request Status']??'Pending')} />
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 }}>
                      {[
                        ['Profession', String(f['Required Profession']??'')],
                        ['Workers needed', String(f['Workers Needed']??'')],
                        ['Received', String(f['Created Date']??f.Date??'').split('T')[0]],
                      ].filter(([,v])=>v).map(([l,v])=>(
                        <div key={l}><div style={{ fontSize:11, color:'#94a3b8' }}>{l}</div><div style={{ fontSize:13, fontWeight:500 }}>{v}</div></div>
                      ))}
                    </div>
                    {!!f.Notes && <div style={{ fontSize:12, color:'#64748b', marginBottom:12, background:'#f8fafc', borderRadius:6, padding:'6px 10px' }}>{String(f.Notes)}</div>}
                    <div style={{ display:'flex', gap:8 }}>
                      <Btn sz="sm" v="primary" onClick={()=>updateEmployerStatus(e.id,'Approved')}>✓ Approve</Btn>
                      <Btn sz="sm" onClick={()=>updateEmployerStatus(e.id,'Active')}>▶ Mark Active</Btn>
                      <Btn sz="sm" v="danger" onClick={()=>updateEmployerStatus(e.id,'Rejected')}>✕ Reject</Btn>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── ISRAEL MONITORING ── */}
          {panel==='monitoring' && (
            <div>
              <div style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Workers currently deployed in Israel.</p>
              </div>
              {monitoring.length===0 ? (
                <div style={{ textAlign:'center', padding:48, color:'#94a3b8' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🛰️</div>
                  <div>No monitoring records yet.</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Records appear when placed candidates are added to the Israel Monitoring table in Airtable.</div>
                </div>
              ) : (
                <div style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:12, overflow:'hidden' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
                    <thead>
                      <tr style={{ background:'#f8fafc' }}>
                        {[['Worker',160],['Employer',140],['Arrival',90],['Contract End',100],['Status',110],['Last Contact',100],['Notes',160]].map(([h,w])=>(
                          <th key={String(h)} style={{ width:w as number, padding:'9px 12px', fontSize:11, fontWeight:600, color:'#64748b', textAlign:'left', borderBottom:'0.5px solid #e2e8f0', textTransform:'uppercase', letterSpacing:'.4px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {monitoring.map(m => {
                        const f = m.fields;
                        const status = String(f['Status In Israel']??'Active');
                        return (
                          <tr key={m.id} style={{ borderBottom:'0.5px solid #f1f5f9' }}>
                            <td style={{ padding:'10px 12px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Name??'—')}</td>
                            <td style={{ padding:'10px 12px', color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Employer??'—')}</td>
                            <td style={{ padding:'10px 12px', color:'#475569' }}>{String(f['Arrival Date']??'—').split('T')[0]}</td>
                            <td style={{ padding:'10px 12px', color:'#475569' }}>{String(f['Contract End Date']??'—').split('T')[0]}</td>
                            <td style={{ padding:'10px 12px' }}><Badge status={status} /></td>
                            <td style={{ padding:'10px 12px', color:'#475569' }}>{String(f['Last Contact']??'—').split('T')[0]}</td>
                            <td style={{ padding:'10px 12px', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{String(f.Notes??'—')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Modals ── */}
      {detailCandidate && (
        <CandidateModal
          candidate={detailCandidate}
          onClose={()=>setDetailCandidate(null)}
          onSaved={updated => {
            setCandidates(prev=>prev.map(c=>c.id===updated.id?updated:c));
            setDetailCandidate(updated);
            showToast('Saved');
            loadCore();
          }}
          onDocSaved={() => { loadDocs(); loadCore(); showToast('Document updated'); }}
        />
      )}

      {showAddCandidate && (
        <AddCandidateModal
          onClose={()=>setShowAddCandidate(false)}
          onCreated={rec => { setCandidates(prev=>[rec,...prev]); showToast('Candidate created'); loadCore(); }}
        />
      )}

      {editVacancy && (
        <VacancyModal
          vacancy={editVacancy==='new' ? undefined : editVacancy}
          onClose={()=>setEditVacancy(null)}
          onSaved={rec => {
            if (editVacancy==='new') setVacancies(prev=>[rec,...prev]);
            else setVacancies(prev=>prev.map(v=>v.id===rec.id?rec:v));
            showToast(editVacancy==='new'?'Vacancy created':'Vacancy updated');
            loadCore();
          }}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
}
