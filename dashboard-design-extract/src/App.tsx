import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import {
  LayoutDashboard, Wallet, BookOpen, Map, Award,
  Zap, Headphones, User, Sun, Moon, Bell, Search,
  TrendingUp, TrendingDown, Check, X, Plus, Trash2,
  AlertCircle, RotateCcw, Pencil, Save, Camera,
  LogOut, Play, MessageSquare, Clock, Menu,
  CheckCircle2, XCircle, ChevronLeft, BarChart3,
  ClipboardList, CreditCard, Settings
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Transaction { id: number; desc: string; amount: number; date: string; type: 'credit' | 'debit' }
interface TestResult  { id: number; name: string; score: number; date: string; pass: boolean }
interface Bootcamp    { id: number; title: string; startDate: string; endDate: string; status: 'active'|'open'|'ended'; endMs?: number }
interface Course      { id: number; title: string; progress: number; status: 'learning'|'completed'|'notStarted'; color: string }
interface Ticket      { id: number; title: string; status: 'open'|'inProgress'|'closed'; category: string; date: string }
interface Message     { id: number; sender: string; initials: string; subject: string; summary: string; date: string; unread: boolean }
interface TodoItem    { id: string; text: string; done: boolean; createdAt: string }
interface Profile     { firstName: string; lastName: string; email: string; phone: string; city: string; bio: string }

// ── Mock Data ─────────────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  { id:1, desc:'خرید دوره React پیشرفته',         amount:-250000,  date:'۱۴۰۳/۰۵/۱۲', type:'debit'  },
  { id:2, desc:'شارژ کیف پول',                    amount: 500000,  date:'۱۴۰۳/۰۵/۱۰', type:'credit' },
  { id:3, desc:'ثبت‌نام بوت‌کمپ فرانت‌اند',      amount:-1200000, date:'۱۴۰۳/۰۵/۰۸', type:'debit'  },
  { id:4, desc:'بازگشت وجه دوره لغو‌شده',         amount: 150000,  date:'۱۴۰۳/۰۵/۰۵', type:'credit' },
  { id:5, desc:'خرید دوره Python پایه',           amount:-180000,  date:'۱۴۰۳/۰۵/۰۱', type:'debit'  },
]
const TESTS: TestResult[] = [
  { id:1, name:'JavaScript پایه',            score:88, date:'۱۴۰۳/۰۵/۱۰', pass:true  },
  { id:2, name:'React Hooks',                score:72, date:'۱۴۰۳/۰۵/۰۵', pass:true  },
  { id:3, name:'الگوریتم و ساختار داده',    score:45, date:'۱۴۰۳/۰۴/۲۸', pass:false },
  { id:4, name:'CSS پیشرفته',                score:91, date:'۱۴۰۳/۰۴/۱۵', pass:true  },
]
const BOOTCAMPS: Bootcamp[] = [
  { id:1, title:'بوت‌کمپ فرانت‌اند ۱۴۰۳',    startDate:'۱۴۰۳/۰۶/۰۱', endDate:'۱۴۰۳/۰۹/۳۰', status:'open' },
  { id:2, title:'چالش ۳۰ روزه TypeScript',   startDate:'۱۴۰۳/۰۵/۰۱', endDate:'۱۴۰۳/۰۵/۳۱', status:'active', endMs: Date.now() + 8*24*60*60*1000 },
]
const COURSES: Course[] = [
  { id:1, title:'React پیشرفته',       progress:65,  status:'learning',    color:'#1f6e8c' },
  { id:2, title:'Node.js و Express',   progress:100, status:'completed',   color:'#1a7a5c' },
  { id:3, title:'طراحی UI/UX',         progress:0,   status:'notStarted',  color:'#c9a959' },
  { id:4, title:'مسیر فرانت‌اند',      progress:40,  status:'learning',    color:'#2e8a99' },
  { id:5, title:'TypeScript مقدماتی',  progress:80,  status:'learning',    color:'#8b5cf6' },
  { id:6, title:'Docker و DevOps',     progress:0,   status:'notStarted',  color:'#f59e0b' },
]
const TICKETS: Ticket[] = [
  { id:1, title:'مشکل در دسترسی به ویدیوی دوره React', status:'inProgress', category:'فنی',      date:'۱۴۰۳/۰۵/۱۲' },
  { id:2, title:'سوال درباره صدور گواهینامه',           status:'open',       category:'اداری',    date:'۱۴۰۳/۰۵/۰۹' },
  { id:3, title:'درخواست تمدید مهلت تکلیف هفته سوم',   status:'closed',     category:'آموزشی',   date:'۱۴۰۳/۰۴/۲۰' },
]
const MESSAGES: Message[] = [
  { id:1, sender:'تیم پشتیبانی کیا', initials:'ک', subject:'تأیید ثبت‌نام بوت‌کمپ',      summary:'ثبت‌نام شما در بوت‌کمپ فرانت‌اند با موفقیت تأیید شد. جلسه اول در...',  date:'۱۴۰۳/۰۵/۱۳', unread:true  },
  { id:2, sender:'مدیریت آکادمی',     initials:'م', subject:'اطلاعیه: جلسه معارفه آنلاین', summary:'جلسه معارفه بوت‌کمپ فرانت‌اند روز شنبه ۱۸ مرداد ساعت ۱۶ برگزار می‌شود...', date:'۱۴۰۳/۰۵/۱۰', unread:true  },
  { id:3, sender:'استاد محمدی',       initials:'ا', subject:'تکلیف هفته سوم منتشر شد',    summary:'لطفاً پروژه هفته سوم را تا پایان جمعه ۱۲ مرداد آپلود کنید...',           date:'۱۴۰۳/۰۵/۰۸', unread:false },
]
const ACTIVITY = [
  { id:1, text:'درس ۶ از ۱۰ دوره React پیشرفته تکمیل شد',    time:'۲ روز پیش',    emoji:'📚' },
  { id:2, text:'گام ۲ از ۵ مسیر یادگیری فرانت‌اند',           time:'۴ روز پیش',    emoji:'🗺️' },
  { id:3, text:'آزمون JavaScript با نمره ۸۸٪ پاس شد',         time:'۵ روز پیش',    emoji:'✅' },
  { id:4, text:'دوره Node.js با موفقیت به پایان رسید',          time:'۱ هفته پیش',   emoji:'🏆' },
]
const SKILLS = [
  { label:'فرانت‌اند', value:72 }, { label:'JavaScript', value:85 },
  { label:'React',    value:65 }, { label:'CSS',        value:90 },
  { label:'Git',      value:80 },
]
const NAV = [
  { id:'dashboard', label:'داشبورد',         Icon: LayoutDashboard },
  { id:'courses',   label:'دوره‌ها',          Icon: BookOpen        },
  { id:'roadmap',   label:'مسیر یادگیری',    Icon: Map             },
  { id:'tests',     label:'آزمون‌ها',         Icon: ClipboardList   },
  { id:'bootcamps', label:'بوت‌کمپ‌ها',       Icon: Zap             },
  { id:'wallet',    label:'کیف پول',          Icon: Wallet          },
  { id:'support',   label:'پشتیبانی',        Icon: Headphones      },
  { id:'profile',   label:'پروفایل',         Icon: User            },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtNum(n: number) { return Math.abs(n).toLocaleString('fa-IR') }

function useCountdown(endMs?: number) {
  const [str, setStr] = useState('')
  useEffect(() => {
    if (!endMs) return
    const tick = () => {
      const diff = endMs - Date.now()
      if (diff <= 0) { setStr('پایان یافت'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setStr(`${d.toLocaleString('fa-IR')} روز  ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [endMs])
  return str
}

const TODOS_KEY = 'kia-academy:todos'
function loadTodos(): TodoItem[] { try { return JSON.parse(localStorage.getItem(TODOS_KEY) || '[]') } catch { return [] } }
function saveTodos(t: TodoItem[]) { localStorage.setItem(TODOS_KEY, JSON.stringify(t)) }

// ── Card Shell ────────────────────────────────────────────────────────────────
function Card({ title, icon, ctaLabel, onCta, loading, children, span }: {
  title: string; icon: ReactNode; ctaLabel?: string; onCta?: () => void
  loading?: boolean; children: ReactNode; span?: 'full' | 2
}) {
  const s: CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--card-border)',
    borderRadius: '16px',
    boxShadow: '0 1px 6px rgba(10,47,68,0.07)',
    overflow: 'hidden',
    transition: 'box-shadow 220ms cubic-bezier(0.22,1,0.36,1)',
    gridColumn: span === 'full' ? '1 / -1' : span === 2 ? 'span 2' : undefined,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }
  return (
    <div style={s} className="card-hover anim-fade-up">
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--card-border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ color:'var(--kia-accent)', display:'flex' }}>{icon}</span>
          <span style={{ fontWeight:600, fontSize:'14px', color:'var(--text)' }}>{title}</span>
        </div>
        {ctaLabel && onCta && (
          <button onClick={onCta} className="btn-ghost" aria-label={ctaLabel}>{ctaLabel}</button>
        )}
      </div>
      <div style={{ padding:'20px', flex:1 }}>
        {loading ? <SkeletonLines /> : children}
      </div>
    </div>
  )
}

function SkeletonLines({ rows=3 }: { rows?: number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {Array.from({length:rows}).map((_,i) => (
        <div key={i} className="shimmer-anim" style={{ height:'14px', borderRadius:'7px', width: i%2===0?'85%':'60%' }} />
      ))}
    </div>
  )
}

function Empty({ icon, text, cta, onCta }: { icon: ReactNode; text: string; cta?: string; onCta?: () => void }) {
  return (
    <div style={{ textAlign:'center', padding:'28px 16px', color:'var(--text-dim)' }}>
      <div style={{ fontSize:'32px', marginBottom:'8px' }}>{icon}</div>
      <p style={{ fontSize:'13px', marginBottom:'12px', color:'var(--text-faint)' }}>{text}</p>
      {cta && onCta && <button onClick={onCta} className="btn-primary">{cta}</button>}
    </div>
  )
}

function ProgressBar({ value, color = 'var(--kia-accent)', height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div style={{ background:'var(--card-border)', borderRadius:'4px', height, overflow:'hidden' }}>
      <div className="progress-bar-fill" style={{ width:`${value}%`, background:color, height:'100%' }} />
    </div>
  )
}

// ── Section 1: Financial Card ─────────────────────────────────────────────────
function FinancialCard({ loading }: { loading?: boolean }) {
  const [showTx, setShowTx] = useState(false)
  return (
    <Card title="کیف پول و تراکنش‌ها" icon={<CreditCard size={16} />} ctaLabel={showTx ? 'بستن' : 'مشاهده همه تراکنش‌ها'} onCta={() => setShowTx(v => !v)} loading={loading} span={2}>
      {/* Bank card */}
      <div style={{
        background:'linear-gradient(135deg, #0a2f44 0%, #1f6e8c 60%, #2e8a99 100%)',
        borderRadius:'16px', padding:'22px', color:'#fff', position:'relative', overflow:'hidden', maxWidth:'360px', margin:'0 auto'
      }}>
        <div style={{ position:'absolute', top:'-30px', left:'-30px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', bottom:'-20px', right:'-20px', width:'100px', height:'100px', borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <span style={{ fontWeight:800, fontSize:'15px', letterSpacing:'1px' }}>Kia Academy</span>
            <span style={{ fontSize:'11px', opacity:0.7 }}>کیف پول دیجیتال</span>
          </div>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'clamp(24px,4vw,32px)', fontWeight:700, marginBottom:'4px' }}>
            {(1250000).toLocaleString('fa-IR')}
          </div>
          <div style={{ fontSize:'12px', opacity:0.75, marginBottom:'20px' }}>تومان موجودی</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'12px', opacity:0.8, letterSpacing:'2px' }}>**** **** **** ۱۲۳۴</span>
            <span style={{ fontSize:'11px', opacity:0.7 }}>۰۶/۲۷</span>
          </div>
        </div>
      </div>
      {/* Transactions — visible only when toggled */}
      {showTx && (
        <div style={{ marginTop:'20px' }}>
          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text-dim)', marginBottom:'12px', marginTop:0 }}>آخرین تراکنش‌ها</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {TRANSACTIONS.map(t => (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'8px', background:'rgba(31,110,140,0.04)' }}>
                <div style={{ width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: t.type==='credit' ? 'rgba(26,122,92,0.12)' : 'rgba(192,57,43,0.1)', flexShrink:0 }}>
                  {t.type==='credit' ? <TrendingUp size={13} color="var(--emerald)" /> : <TrendingDown size={13} color="var(--danger)" />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.desc}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-faint)' }}>{t.date}</div>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'13px', fontWeight:600, color: t.type==='credit' ? 'var(--emerald)' : 'var(--danger)', flexShrink:0 }}>
                  {t.type==='credit' ? '+' : '-'}{fmtNum(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

// ── Section 2: Test Results ───────────────────────────────────────────────────
function TestResultsCard({ loading }: { loading?: boolean }) {
  return (
    <Card title="آخرین نتایج آزمون" icon={<ClipboardList size={16} />} ctaLabel="شرکت در آزمون" onCta={() => {}} loading={loading}>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        <div style={{ marginBottom:'4px' }}>
          <p style={{ fontSize:'12px', color:'var(--text-dim)', margin:'0 0 10px' }}>ارزیابی مهارت‌ها</p>
          {SKILLS.map(s => (
            <div key={s.label} style={{ marginBottom:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                <span style={{ fontSize:'12px', color:'var(--text-dim)' }}>{s.label}</span>
                <span style={{ fontSize:'12px', fontFamily:"'JetBrains Mono', monospace", color:'var(--kia-accent)' }}>{s.value.toLocaleString('fa-IR')}٪</span>
              </div>
              <ProgressBar value={s.value} />
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--card-border)', paddingTop:'12px' }}>
          <p style={{ fontSize:'12px', color:'var(--text-dim)', margin:'0 0 8px' }}>آزمون‌های اخیر</p>
          {TESTS.map(t => (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              {t.pass
                ? <CheckCircle2 size={14} color="var(--emerald)" aria-label="قبول" />
                : <XCircle      size={14} color="var(--danger)"  aria-label="رد"   />}
              <span style={{ flex:1, fontSize:'12px', color:'var(--text)' }}>{t.name}</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'12px', fontWeight:600, color: t.pass ? 'var(--emerald)' : 'var(--danger)' }}>
                {t.score.toLocaleString('fa-IR')}٪
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// ── Section 3: Progress Chart ─────────────────────────────────────────────────
function ProgressCard({ loading }: { loading?: boolean }) {
  const pct = 65
  const r = 44, circ = 2 * Math.PI * r, dash = (pct/100)*circ
  return (
    <Card title="پیشرفت کلی" icon={<BarChart3 size={16} />} loading={loading}>
      <div style={{ display:'flex', gap:'20px', alignItems:'center', marginBottom:'16px' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink:0 }} aria-label={`پیشرفت ${pct} درصد`}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--card-border)" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--kia-accent)" strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition:'stroke-dasharray 800ms cubic-bezier(0.22,1,0.36,1)' }}
          />
          <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--text)" fontFamily="Vazirmatn">{pct.toLocaleString('fa-IR')}</text>
          <text x="50" y="60" textAnchor="middle" fontSize="9" fill="var(--text-faint)" fontFamily="Vazirmatn">درصد</text>
        </svg>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>پیشرفت تحصیلی</div>
          <div style={{ fontSize:'12px', color:'var(--text-dim)' }}>بر اساس دوره‌ها و آزمون‌های شما</div>
          <div style={{ display:'flex', gap:'12px', marginTop:'10px' }}>
            {[{l:'دوره‌ها',v:'۴'},{ l:'آزمون‌ها',v:'۴'},{ l:'گواهینامه',v:'۱'}].map(x=>(
              <div key={x.l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'16px', fontWeight:700, color:'var(--kia-accent)' }}>{x.v}</div>
                <div style={{ fontSize:'10px', color:'var(--text-faint)' }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop:'1px solid var(--card-border)', paddingTop:'12px' }}>
        <p style={{ fontSize:'12px', color:'var(--text-dim)', margin:'0 0 8px' }}>فعالیت‌های اخیر</p>
        {ACTIVITY.map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'7px' }}>
            <span style={{ fontSize:'14px' }} aria-hidden="true">{a.emoji}</span>
            <span style={{ flex:1, fontSize:'12px', color:'var(--text)' }}>{a.text}</span>
            <span style={{ fontSize:'11px', color:'var(--text-faint)', flexShrink:0 }}>{a.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section 4: Bootcamps ──────────────────────────────────────────────────────
function BootcampsCard({ loading }: { loading?: boolean }) {
  const countdown = useCountdown(BOOTCAMPS.find(b=>b.status==='active')?.endMs)
  const statusColor = { active:'var(--kia-soft)', open:'var(--kia-gold)', ended:'var(--text-faint)' }
  const statusLabel = { active:'در حال برگزاری', open:'ثبت‌نام باز', ended:'پایان یافته' }
  return (
    <Card title="بوت‌کمپ‌ها و چالش‌ها" icon={<Zap size={16} />} ctaLabel="مشاهده همه" onCta={() => {}} loading={loading}>
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {BOOTCAMPS.map(b => (
          <div key={b.id} style={{ border:'1px solid var(--card-border)', borderRadius:'10px', padding:'14px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
              <span style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{b.title}</span>
              <span className="tag" style={{ background: `${statusColor[b.status]}22`, color: statusColor[b.status], fontSize:'10px' }}>
                {statusLabel[b.status]}
              </span>
            </div>
            <div style={{ fontSize:'11px', color:'var(--text-faint)', marginBottom:'8px' }}>
              {b.startDate} — {b.endDate}
            </div>
            {b.status === 'active' && countdown && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--kia-gold)' }}>
                  <Clock size={12} aria-hidden="true" />
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'12px' }}>{countdown}</span>
                </div>
                <button className="btn-primary" style={{ fontSize:'11px', padding:'4px 10px' }}>ورود به چالش</button>
              </div>
            )}
            {b.status === 'open' && (
              <button className="btn-primary" style={{ fontSize:'11px', padding:'4px 10px', marginTop:'4px' }}>ثبت‌نام</button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section 5: Todo List ──────────────────────────────────────────────────────
function TodoListCard({ loading }: { loading?: boolean }) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [input, setInput] = useState('')
  const [showAll, setShowAll] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTodos(loadTodos()) }, [])

  const update = (next: TodoItem[]) => { setTodos(next); saveTodos(next) }
  const add = () => {
    const text = input.trim()
    if (!text) return
    update([...todos, { id: Date.now().toString(), text, done:false, createdAt: new Date().toISOString() }])
    setInput('')
    inputRef.current?.focus()
  }
  const toggle = (id: string) => update(todos.map(t => t.id===id ? {...t, done:!t.done} : t))
  const remove  = (id: string) => update(todos.filter(t => t.id!==id))

  const visible = showAll ? todos : todos.slice(0,5)
  const remaining = todos.length - 5

  return (
    <Card title="وظایف روزانه" icon={<Check size={16} />} loading={loading}>
      <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
        <input
          ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && add()}
          placeholder="وظیفه جدید..."
          style={{ flex:1, padding:'8px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'transparent', color:'var(--text)', fontSize:'13px', direction:'rtl' }}
          aria-label="وظیفه جدید"
        />
        <button onClick={add} className="btn-primary" style={{ padding:'8px 12px' }} aria-label="افزودن وظیفه">
          <Plus size={14} />
        </button>
      </div>
      {todos.length === 0
        ? <Empty icon="✅" text="هیچ وظیفه‌ای ندارید. از کجا شروع کنیم؟" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {visible.map(t => (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', borderRadius:'8px', background:'rgba(31,110,140,0.04)', opacity: t.done ? 0.6 : 1, transition:'opacity 200ms' }}>
                <button
                  onClick={() => toggle(t.id)}
                  aria-label={t.done ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}
                  style={{ width:'18px', height:'18px', borderRadius:'5px', border:`2px solid ${t.done ? 'var(--emerald)' : 'var(--card-border)'}`, background: t.done ? 'var(--emerald)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'all 160ms' }}
                >
                  {t.done && <Check size={10} color="#fff" aria-hidden="true" />}
                </button>
                <span style={{ flex:1, fontSize:'13px', color:'var(--text)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
                <button onClick={() => remove(t.id)} aria-label="حذف وظیفه" style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-faint)', display:'flex', padding:'2px' }}>
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
            {!showAll && remaining > 0 && (
              <button onClick={() => setShowAll(true)} className="btn-ghost" style={{ width:'100%', marginTop:'4px', textAlign:'center' }}>
                مشاهده همه ({remaining.toLocaleString('fa-IR')} مورد دیگر)
              </button>
            )}
          </div>
        )
      }
    </Card>
  )
}

// ── Section 6: Enrolled Courses ───────────────────────────────────────────────
function CoursesCard({ loading }: { loading?: boolean }) {
  const statusLabel  = { learning:'در حال یادگیری', completed:'تکمیل‌شده', notStarted:'آغاز نشده' }
  const statusColor  = { learning:'var(--kia-accent)', completed:'var(--emerald)', notStarted:'var(--text-faint)' }
  const btnLabel     = { learning:'ادامه', completed:'مرور', notStarted:'شروع' }
  return (
    <Card title="دوره‌ها و مسیرهای یادگیری" icon={<BookOpen size={16} />} ctaLabel="مشاهده همه" onCta={() => {}} loading={loading} span="full">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px' }}>
        {COURSES.map(c => (
          <div key={c.id} style={{ border:'1px solid var(--card-border)', borderRadius:'12px', overflow:'hidden' }}>
            <div style={{ height:'80px', background:`linear-gradient(135deg, ${c.color}33 0%, ${c.color}11 100%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', position:'relative' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'12px', background: c.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <BookOpen size={20} color="#fff" aria-hidden="true" />
              </div>
              <span className="tag" style={{ position:'absolute', top:'8px', right:'8px', background:`${statusColor[c.status]}22`, color:statusColor[c.status], fontSize:'9px' }}>
                {statusLabel[c.status]}
              </span>
            </div>
            <div style={{ padding:'12px' }}>
              <div style={{ fontWeight:600, fontSize:'13px', color:'var(--text)', marginBottom:'8px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
              <div style={{ marginBottom:'8px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontSize:'11px', color:'var(--text-faint)' }}>پیشرفت</span>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:'11px', color: c.color }}>{c.progress.toLocaleString('fa-IR')}٪</span>
                </div>
                <ProgressBar value={c.progress} color={c.color} height={5} />
              </div>
              <button className="btn-primary" style={{ width:'100%', fontSize:'12px', padding:'6px 8px', background: c.color }}>
                <Play size={10} style={{ display:'inline', marginLeft:'4px' }} aria-hidden="true" /> {btnLabel[c.status]}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Section 7: Support Tickets ────────────────────────────────────────────────
function TicketsCard({ loading }: { loading?: boolean }) {
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title:'', category:'فنی', desc:'' })
  const [submitting, setSubmitting] = useState(false)

  const statusColor = { open:'var(--warning)', inProgress:'var(--kia-accent)', closed:'var(--text-faint)' }
  const statusLabel = { open:'باز', inProgress:'در بررسی', closed:'بسته' }

  const submit = () => {
    if (!form.title.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      const now = new Date()
      const persian = `${now.getFullYear()-621}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`
      setTickets(prev => [{ id: Date.now(), title:form.title, status:'open', category:form.category, date:persian }, ...prev])
      setForm({ title:'', category:'فنی', desc:'' })
      setShowModal(false)
      setSubmitting(false)
    }, 800)
  }

  return (
    <>
      <Card title="تیکت‌های پشتیبانی" icon={<Headphones size={16} />} ctaLabel="تیکت جدید" onCta={() => setShowModal(true)} loading={loading} span={2}>
        {tickets.length === 0
          ? <Empty icon="🎫" text="هیچ تیکتی ثبت نشده است" cta="ارسال اولین تیکت" onCta={() => setShowModal(true)} />
          : (
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              {tickets.slice(0,4).map(t => (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderRadius:'8px', borderRight:'3px solid', borderColor: statusColor[t.status] as string, background:'rgba(31,110,140,0.04)' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'13px', color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize:'11px', color:'var(--text-faint)' }}>{t.category} · {t.date}</div>
                  </div>
                  <span className="tag" style={{ background:`${statusColor[t.status]}22`, color:statusColor[t.status], flexShrink:0, fontSize:'10px' }}>
                    {statusLabel[t.status]}
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </Card>
      {showModal && (
        <div role="dialog" aria-modal="true" aria-label="تیکت جدید" style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
          <div onClick={() => setShowModal(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} />
          <div style={{ position:'relative', background:'var(--bg-card)', backdropFilter:'blur(16px)', border:'1px solid var(--card-border)', borderRadius:'16px', padding:'24px', width:'100%', maxWidth:'440px', zIndex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ margin:0, fontSize:'16px', fontWeight:700 }}>تیکت جدید</h2>
              <button onClick={() => setShowModal(false)} aria-label="بستن" style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--text-faint)', display:'flex' }}><X size={18} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ fontSize:'13px', color:'var(--text-dim)', display:'block', marginBottom:'6px' }}>موضوع</label>
                <input value={form.title} onChange={e => setForm(p => ({...p, title:e.target.value}))} placeholder="موضوع تیکت را بنویسید"
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'transparent', color:'var(--text)', fontSize:'13px', direction:'rtl' }} />
              </div>
              <div>
                <label style={{ fontSize:'13px', color:'var(--text-dim)', display:'block', marginBottom:'6px' }}>دسته‌بندی</label>
                <select value={form.category} onChange={e => setForm(p => ({...p, category:e.target.value}))}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'var(--bg)', color:'var(--text)', fontSize:'13px' }}>
                  {['فنی','اداری','آموزشی','مالی'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'13px', color:'var(--text-dim)', display:'block', marginBottom:'6px' }}>توضیحات</label>
                <textarea value={form.desc} onChange={e => setForm(p => ({...p, desc:e.target.value}))} placeholder="جزئیات مشکل را شرح دهید..." rows={4}
                  style={{ width:'100%', padding:'10px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'transparent', color:'var(--text)', fontSize:'13px', resize:'vertical', direction:'rtl' }} />
              </div>
              <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'4px' }}>
                <button onClick={() => setShowModal(false)} className="btn-ghost">انصراف</button>
                <button onClick={submit} className="btn-primary" disabled={submitting}>
                  {submitting ? 'در حال ارسال...' : 'ارسال تیکت'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Section 8: Admin Messages ─────────────────────────────────────────────────
function MessagesCard({ loading }: { loading?: boolean }) {
  const unreadCount = MESSAGES.filter(m => m.unread).length
  return (
    <Card title="پیام‌های مدیریت" icon={<MessageSquare size={16} />} ctaLabel="مشاهده همه" onCta={() => {}} loading={loading}>
      {MESSAGES.length === 0
        ? <Empty icon="📬" text="پیام جدیدی ندارید" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {unreadCount > 0 && (
              <div style={{ fontSize:'11px', color:'var(--kia-gold)', marginBottom:'2px' }}>
                {unreadCount.toLocaleString('fa-IR')} پیام خوانده‌نشده
              </div>
            )}
            {MESSAGES.map(m => (
              <div key={m.id} style={{ display:'flex', gap:'10px', padding:'10px', borderRadius:'10px', background:'rgba(31,110,140,0.04)', borderRight: m.unread ? '3px solid var(--kia-accent)' : '3px solid transparent' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'var(--kia-deep)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'14px', flexShrink:0 }}>
                  {m.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2px' }}>
                    <span style={{ fontSize:'13px', fontWeight: m.unread ? 700 : 500, color:'var(--text)' }}>{m.subject}</span>
                    <span style={{ fontSize:'10px', color:'var(--text-faint)', flexShrink:0 }}>{m.date}</span>
                  </div>
                  <div style={{ fontSize:'11px', color:'var(--text-faint)' }}>{m.sender}</div>
                  <div style={{ fontSize:'12px', color:'var(--text-dim)', marginTop:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.summary}</div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </Card>
  )
}

// ── Section 9: Profile Editor ─────────────────────────────────────────────────
function ProfileCard({ loading }: { loading?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    firstName:'علی', lastName:'محمدی', email:'ali.mohammadi@example.com',
    phone:'۰۹۱۲۳۴۵۶۷۸۹', city:'تهران', bio:'توسعه‌دهنده فرانت‌اند علاقه‌مند به React و TypeScript'
  })
  const [draft, setDraft] = useState(profile)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setProfile(draft); setSaving(false); setEditing(false); setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 800)
  }
  const handleCancel = () => { setDraft(profile); setEditing(false) }
  const f = (k: keyof Profile, v: string) => setDraft(p => ({...p, [k]:v}))

  return (
    <Card title="پروفایل من" icon={<User size={16} />} ctaLabel={editing ? undefined : 'ویرایش'} onCta={() => setEditing(true)} loading={loading} span="full">
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'28px', alignItems:'start' }}>
        {/* Avatar */}
        <div style={{ textAlign:'center' }}>
          <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'linear-gradient(135deg, var(--kia-deep) 0%, var(--kia-accent) 100%)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:'24px', fontWeight:700, color:'#fff', position:'relative' }}>
            {profile.firstName[0]}{profile.lastName[0]}
            {editing && (
              <button aria-label="تغییر تصویر" style={{ position:'absolute', bottom:0, left:0, width:'24px', height:'24px', borderRadius:'50%', background:'var(--kia-accent)', border:'2px solid var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <Camera size={11} color="#fff" aria-hidden="true" />
              </button>
            )}
          </div>
          <div style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>{profile.firstName} {profile.lastName}</div>
          <div style={{ fontSize:'11px', color:'var(--text-faint)', marginTop:'2px' }}>دانشجوی فرانت‌اند</div>
        </div>
        {/* Fields */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          {([
            ['نام',        'firstName', 'text'],
            ['نام خانوادگی','lastName',  'text'],
            ['شماره موبایل','phone',     'tel'],
            ['شهر',        'city',      'text'],
          ] as [string, keyof Profile, string][]).map(([label, key, type]) => (
            <div key={key}>
              <label style={{ fontSize:'12px', color:'var(--text-dim)', display:'block', marginBottom:'5px' }}>{label}</label>
              <input type={type} value={editing ? draft[key] : profile[key]} readOnly={!editing}
                onChange={e => f(key, e.target.value)}
                style={{ width:'100%', padding:'8px 12px', borderRadius:'8px', border:'1px solid', borderColor: editing ? 'var(--kia-accent)' : 'var(--card-border)', background: editing ? 'transparent' : 'rgba(31,110,140,0.03)', color:'var(--text)', fontSize:'13px', direction:'rtl', cursor: editing ? 'text' : 'default' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-dim)', display:'block', marginBottom:'5px' }}>ایمیل</label>
            <input type="email" value={profile.email} readOnly
              style={{ width:'100%', padding:'8px 12px', borderRadius:'8px', border:'1px solid var(--card-border)', background:'rgba(31,110,140,0.03)', color:'var(--text-faint)', fontSize:'13px', direction:'ltr', textAlign:'right', cursor:'not-allowed' }} />
          </div>
          <div>
            <label style={{ fontSize:'12px', color:'var(--text-dim)', display:'block', marginBottom:'5px' }}>درباره من</label>
            <textarea value={editing ? draft.bio : profile.bio} readOnly={!editing}
              onChange={e => f('bio', e.target.value)} rows={2}
              style={{ width:'100%', padding:'8px 12px', borderRadius:'8px', border:'1px solid', borderColor: editing ? 'var(--kia-accent)' : 'var(--card-border)', background: editing ? 'transparent' : 'rgba(31,110,140,0.03)', color:'var(--text)', fontSize:'13px', resize:'none', direction:'rtl', cursor: editing ? 'text' : 'default' }} />
          </div>
          {editing && (
            <div style={{ display:'flex', gap:'8px', alignItems:'center', gridColumn:'1 / -1' }}>
              <button onClick={handleSave} className="btn-primary" disabled={saving}>
                <Save size={13} style={{ display:'inline', marginLeft:'4px' }} aria-hidden="true" />
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <button onClick={handleCancel} className="btn-ghost">انصراف</button>
            </div>
          )}
          {saved && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--emerald)', fontSize:'13px', gridColumn:'1 / -1' }}>
              <CheckCircle2 size={14} aria-hidden="true" /> اطلاعات با موفقیت ذخیره شد
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav }: { activeNav: string; setActiveNav: (s: string) => void }) {
  return (
    <aside style={{ position:'fixed', top:0, right:0, height:'100vh', width:'220px', background:'var(--bg-sidebar)', display:'flex', flexDirection:'column', zIndex:100, borderLeft:'1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div style={{ padding:'22px 20px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg, var(--kia-accent), var(--kia-soft))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:'14px' }}>K</div>
          <div>
            <div style={{ fontWeight:800, fontSize:'15px', color:'#fff', lineHeight:1.1 }}>Kia Academy</div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.45)' }}>پلتفرم آموزشی</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex:1, padding:'14px 12px', overflowY:'auto' }} aria-label="منوی اصلی">
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActiveNav(item.id)}
            className={`nav-link${activeNav===item.id ? ' active' : ''}`}
            aria-current={activeNav===item.id ? 'page' : undefined}>
            <item.Icon size={16} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
      {/* User + logout */}
      <div style={{ padding:'14px 12px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', borderRadius:'10px', background:'rgba(255,255,255,0.06)' }}>
          <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, var(--kia-accent), var(--kia-soft))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'12px', flexShrink:0 }}>علم</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'12px', fontWeight:600, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>علی محمدی</div>
            <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.45)' }}>دانشجو</div>
          </div>
          <button aria-label="خروج از حساب" style={{ background:'transparent', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', display:'flex', padding:'4px' }}>
            <LogOut size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────────
function TopBar({ dark, setDark, unread }: { dark: boolean; setDark: (v: boolean) => void; unread: number }) {
  return (
    <header style={{ position:'fixed', top:0, right:'220px', left:0, height:'54px', background: dark ? 'rgba(7,24,33,0.92)' : 'rgba(232,241,246,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--card-border)', display:'flex', alignItems:'center', padding:'0 20px', gap:'12px', zIndex:99 }}>
      <span style={{ fontWeight:700, fontSize:'15px', color:'var(--text)', flex:1 }}>داشبورد دانشجو</span>
      {/* Search */}
      <button aria-label="جستجو" style={{ background:'transparent', border:'1px solid var(--card-border)', borderRadius:'8px', padding:'6px 12px', color:'var(--text-faint)', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', fontSize:'12px' }}>
        <Search size={14} aria-hidden="true" /> جستجو...
      </button>
      {/* Notifications */}
      <button aria-label={`${unread} اعلان خوانده‌نشده`} style={{ position:'relative', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-dim)', display:'flex', padding:'6px' }}>
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && (
          <span style={{ position:'absolute', top:'4px', left:'4px', width:'8px', height:'8px', borderRadius:'50%', background:'var(--danger)' }} aria-hidden="true" />
        )}
      </button>
      {/* Theme toggle */}
      <button onClick={() => setDark(!dark)} aria-label={dark ? 'تم روشن' : 'تم تاریک'}
        style={{ background:'var(--card-border)', border:'none', borderRadius:'20px', padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', color:'var(--text-dim)' }}>
        {dark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
        <span style={{ fontSize:'11px' }}>{dark ? 'روشن' : 'تاریک'}</span>
      </button>
      {/* Lang */}
      <button aria-label="انتخاب زبان" style={{ background:'transparent', border:'1px solid var(--card-border)', borderRadius:'6px', padding:'4px 8px', cursor:'pointer', color:'var(--text-dim)', fontSize:'11px', fontWeight:600 }}>
        FA
      </button>
    </header>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]         = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const unread = MESSAGES.filter(m => m.unread).length

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <TopBar dark={dark} setDark={setDark} unread={unread} />
      <main style={{ marginRight:'220px', paddingTop:'54px' }} id="root-content">
        <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'24px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'18px', alignItems:'stretch' }}>

          {/* Row 1: Financial (2 cols) + Bootcamps (1 col) */}
          <FinancialCard  loading={loading} />
          <BootcampsCard  loading={loading} />

          {/* Row 2: Progress + Tests + Todo */}
          <ProgressCard    loading={loading} />
          <TestResultsCard loading={loading} />
          <TodoListCard    loading={loading} />

          {/* Row 3: Courses (full width, 3 cols internal) */}
          <CoursesCard loading={loading} />

          {/* Row 4: Tickets (2/3) + Messages (1/3) */}
          <TicketsCard   loading={loading} />
          <MessagesCard  loading={loading} />

          {/* Row 6: Profile (full width) */}
          <ProfileCard loading={loading} />

        </div>
      </main>
    </div>
  )
}
