import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend, CartesianGrid, LineChart, Line
} from 'recharts';
import {
  Fish, Baby, Package, Skull, AlertTriangle, Search, Plus,
  X, Thermometer, Droplets, Bell, Calendar, TrendingUp,
  BarChart3, LayoutDashboard, Database, Waves, ArrowRightLeft,
  Users, Wrench, FileText, Check, RotateCw, Printer, Trash2,
  ChevronRight, ChevronDown, User, ShieldAlert
} from 'lucide-react';
import './index.css';

// ─── DATA CONSTANTS (Do not change structures) ──────────────────────────────

const SPECIES_INIT = [
  { id:1,  name:'Guppy (Fancy)',    born:45,  exported:30, died:5,  min:50,  price:80   },
  { id:2,  name:'Arowana (Silver)', born:3,   exported:5,  died:1,  min:8,   price:3500 },
  { id:3,  name:'Discus (Blue)',    born:8,   exported:12, died:2,  min:10,  price:1200 },
  { id:4,  name:'Neon Tetra',       born:60,  exported:80, died:10, min:30,  price:60   },
  { id:5,  name:'Betta (Red)',       born:10,  exported:8,  died:1,  min:8,   price:250  },
  { id:6,  name:'Koi (Kohaku)',      born:4,   exported:6,  died:0,  min:5,   price:2000 },
  { id:7,  name:'Oscar',            born:2,   exported:4,  died:1,  min:5,   price:450  },
  { id:8,  name:'Angel Fish',       born:15,  exported:10, died:3,  min:10,  price:180  },
  { id:9,  name:'Goldfish (Fancy)', born:20,  exported:25, died:4,  min:15,  price:150  },
  { id:10, name:'Clownfish',        born:5,   exported:8,  died:2,  min:8,   price:600  },
];

const TANK_STOCK_INIT = {
  1:  { A: 150, C: 90  },
  2:  { B: 12          },
  3:  { C: 22, D: 13   },
  4:  { A: 180         },
  5:  { D: 28          },
  6:  { E: 18          },
  7:  { B: 9           },
  8:  { C: 42          },
  9:  { A: 65          },
  10: { F: 22          },
};

const TANKS_DATA = [
  { id:'A', capacity:600, temp:'26°C', ph:'7.2', type:'Freshwater' },
  { id:'B', capacity:120, temp:'27°C', ph:'6.8', type:'Freshwater' },
  { id:'C', capacity:200, temp:'28°C', ph:'6.5', type:'Freshwater' },
  { id:'D', capacity:60,  temp:'26°C', ph:'7.0', type:'Freshwater' },
  { id:'E', capacity:300, temp:'22°C', ph:'7.4', type:'Freshwater' },
  { id:'F', capacity:100, temp:'25°C', ph:'8.2', type:'Marine'     },
];

const TREND_DATA = [
  { month:'Feb', total:580, born:82,  exported:68 },
  { month:'Mar', total:620, born:94,  exported:74 },
  { month:'Apr', total:590, born:71,  exported:88 },
  { month:'May', total:680, born:110, exported:70 },
  { month:'Jun', total:710, born:98,  uploaded: 80, exported:82 },
  { month:'Jul', total:651, born:72,  exported:90 },
];

const ACTIVITY_INIT = [
  { id:1, type:'birth',  species:'Guppy (Fancy)',    count:12, tank:'A', time:'2 hrs ago',  note:'Natural breeding cycle' },
  { id:2, type:'export', species:'Arowana (Silver)', count:2,  tank:'B', time:'5 hrs ago',  note:'AquaWorld Mumbai order' },
  { id:3, type:'death',  species:'Discus (Blue)',    count:1,  tank:'C', time:'Yesterday',  note:'pH imbalance detected' },
  { id:4, type:'export', species:'Neon Tetra',       count:30, tank:'A', time:'Yesterday',  note:'Bulk retail order' },
  { id:5, type:'birth',  species:'Koi (Kohaku)',     count:4,  tank:'E', time:'2 days ago', note:'Spring spawn' },
  { id:6, type:'export', species:'Betta (Red)',      count:5,  tank:'D', time:'2 days ago', note:'PetZone Pune' },
];

const WORKERS_INIT = [
  { id:1, name:'Rajan Patil',   role:'Senior Handler',  avatar:'RP' },
  { id:2, name:'Suresh Kamble', role:'Tank Operator',   avatar:'SK' },
  { id:3, name:'Amol Shinde',   role:'Sales Assistant', avatar:'AS' },
  { id:4, name:'Deepak More',   role:'Maintenance',     avatar:'DM' },
];

const EXPENSES_INIT = [
  { id:1, category:'Fish Food',       amount:3200,  description:'Hikari pellets — 5kg',          date:'2026-07-20', tank:null,  worker:'Rajan Patil',   status:'approved' },
  { id:2, category:'Equipment Repair',amount:8500,  description:'Tank B pump replacement',        date:'2026-07-18', tank:'B',   worker:'Deepak More',   status:'approved' },
  { id:3, category:'Medications',     amount:1800,  description:'Melafix antibiotic treatment',   date:'2026-07-15', tank:'C',   worker:'Rajan Patil',   status:'approved' },
  { id:4, category:'Utilities',       amount:4200,  description:'Electricity bill — July',        date:'2026-07-10', tank:null,  worker:null,             status:'approved' },
  { id:5, category:'Filter/Equipment',amount:2600,  description:'Carbon filter replacements x4',  date:'2026-07-08', tank:null,  worker:'Deepak More',   status:'approved' },
  { id:6, category:'Fish Food',       amount:1400,  description:'Live bloodworms — weekly',       date:'2026-07-25', tank:null,  worker:'Suresh Kamble', status:'approved' },
  { id:7, category:'Tank Repair',     amount:12000, description:'Tank E glass crack repair',      date:'2026-07-22', tank:'E',   worker:'Deepak More',   status:'approved' },
  { id:8, category:'Labour',          amount:24000, description:'Worker wages — July',            date:'2026-07-01', tank:null,  worker:null,             status:'approved' },
];

const SALES_INIT = [
  { id:1, speciesId:1, speciesName:'Guppy (Fancy)', qty:30, unitPrice:80,   total:2400,  buyer:'PetZone Pune',         payMode:'UPI',  payStatus:'paid',    date:'2026-07-25', worker:'Amol Shinde',   approved:true,  tankId: 'A' },
  { id:2, speciesId:2, speciesName:'Arowana (Silver)', qty:2,  unitPrice:3500, total:7000,  buyer:'AquaWorld Mumbai',     payMode:'Cash', payStatus:'paid',    date:'2026-07-24', worker:'Rajan Patil',   approved:true,  tankId: 'B' },
  { id:3, speciesId:4, speciesName:'Neon Tetra',       qty:50, unitPrice:60,   total:3000,  buyer:'FishMart Nashik',      payMode:'UPI',  payStatus:'pending', date:'2026-07-23', worker:'Amol Shinde',   approved:true,  tankId: 'A' },
  { id:4, speciesId:6, speciesName:'Koi (Kohaku)',     qty:3,  unitPrice:2000, total:6000,  buyer:'Royal Aquatics',       payMode:'Cash', payStatus:'paid',    date:'2026-07-22', worker:'Rajan Patil',   approved:true,  tankId: 'E' },
  { id:5, speciesId:8, speciesName:'Angel Fish',       qty:10, unitPrice:180,  total:1800,  buyer:'PetZone Pune',         payMode:'UPI',  payStatus:'paid',    date:'2026-07-21', worker:'Amol Shinde',   approved:false, tankId: 'C' },
  { id:6, speciesId:5, speciesName:'Betta (Red)',      qty:5,  unitPrice:250,  total:1250,  buyer:'HomeAqua Kolhapur',    payMode:'Cash', payStatus:'paid',    date:'2026-07-20', worker:'Suresh Kamble', approved:true,  tankId: 'D' },
];

const CUSTOMERS_INIT = [
  { id:1, name:'PetZone Pune',      contact:'9876543210', totalOrders:8,  totalValue:18400, lastOrder:'2026-07-25', topSpecies:'Guppy (Fancy)'    },
  { id:2, name:'AquaWorld Mumbai',  contact:'9823456789', totalOrders:5,  totalValue:42000, lastOrder:'2026-07-24', topSpecies:'Arowana (Silver)' },
  { id:3, name:'FishMart Nashik',   contact:'9845612378', totalOrders:3,  totalValue:9800,  lastOrder:'2026-07-23', topSpecies:'Neon Tetra'        },
  { id:4, name:'Royal Aquatics',    contact:'9812345670', totalOrders:6,  totalValue:28500, lastOrder:'2026-07-22', topSpecies:'Koi (Kohaku)'      },
  { id:5, name:'HomeAqua Kolhapur', contact:'9867453210', totalOrders:2,  totalValue:3800,  lastOrder:'2026-07-20', topSpecies:'Betta (Red)'       },
];

const EQUIPMENT_INIT = [
  { id:1, name:'Tank A — Main Filter',  type:'Filter', tank:'A', purchaseDate:'2024-03-10', lastService:'2026-04-10', nextService:'2026-07-10', cost:4500,  status:'overdue'   },
  { id:2, name:'Tank B — Water Pump',   type:'Pump',   tank:'B', purchaseDate:'2025-01-15', lastService:'2026-06-15', nextService:'2026-09-15', cost:3200,  status:'ok'        },
  { id:3, name:'Tank C — Heater',       type:'Heater', tank:'C', purchaseDate:'2024-08-20', lastService:'2026-05-20', nextService:'2026-08-20', cost:1800,  status:'due-soon'  },
  { id:4, name:'Tank D — Aerator',      type:'Aerator',tank:'D', purchaseDate:'2025-06-01', lastService:'2026-06-01', nextService:'2026-09-01', cost:900,   status:'ok'        },
  { id:5, name:'Tank E — Filter',       type:'Filter', tank:'E', purchaseDate:'2024-11-12', lastService:'2026-04-12', nextService:'2026-07-12', cost:3800,  status:'overdue'   },
  { id:6, name:'Tank F — Marine Pump',  type:'Pump',   tank:'F', purchaseDate:'2025-03-05', lastService:'2026-05-05', nextService:'2026-08-05', cost:5500,  status:'due-soon'  },
];

const WATER_LOG_INIT = [
  { id:1, tank:'A', date:'2026-07-27', ph:7.1, temp:26.2, ammonia:0.0, loggedBy:'Suresh Kamble', status:'normal' },
  { id:2, tank:'B', date:'2026-07-27', ph:6.9, temp:27.0, ammonia:0.1, loggedBy:'Suresh Kamble', status:'normal' },
  { id:3, tank:'C', date:'2026-07-27', ph:8.4, temp:28.5, ammonia:0.3, loggedBy:'Rajan Patil',   status:'warning'},
  { id:4, tank:'D', date:'2026-07-27', ph:7.0, temp:26.0, ammonia:0.0, loggedBy:'Rajan Patil',   status:'normal' },
  { id:5, tank:'E', date:'2026-07-27', ph:7.3, temp:22.1, ammonia:0.0, loggedBy:'Deepak More',   status:'normal' },
  { id:6, tank:'F', date:'2026-07-27', ph:8.1, temp:25.0, ammonia:0.2, loggedBy:'Deepak More',   status:'normal' },
];

const EXPENSE_CATEGORIES = ['Fish Food','Medications','Filter/Equipment','Tank Repair','Equipment Repair','Utilities','Labour','Miscellaneous'];
const PAYMENT_MODES = ['Cash','UPI','Bank Transfer','Credit'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().slice(0, 10);
const formatDate = (dStr) => {
  if (!dStr) return '';
  const d = new Date(dStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Get status based on bounds
function getWaterStatus(ph, temp, ammonia) {
  if (ph < 6.0 || ph > 9.0 || ammonia > 0.5) return 'critical';
  if (ph < 6.5 || ph > 8.0 || temp < 22 || temp > 28 || ammonia > 0.2) return 'warning';
  return 'normal';
}

function getStatus(sp) {
  if (sp.stock <= sp.min * 0.5) return 'critical';
  if (sp.stock <= sp.min * 1.5) return 'low';
  return 'healthy';
}

// ─── COUNTER TICK EFFECT COMPONENT ───────────────────────────────────────────

function AnimatedNumber({ value, prefix = "" }) {
  const isSigned = typeof value === 'string' && (value.startsWith('+') || value.startsWith('-'));
  const numValue = isSigned ? parseInt(value.slice(1), 10) : parseInt(value, 10);
  const sign = isSigned ? value.charAt(0) : "";
  
  const [display, setDisplay] = useState(numValue);

  useEffect(() => {
    let start = display;
    let end = numValue;
    if (start === end) return;
    
    let duration = 400;
    let startTime = null;
    let handle;

    function animate(time) {
      if (!startTime) startTime = time;
      let progress = Math.min((time - startTime) / duration, 1);
      let cur = Math.round(start + (end - start) * progress);
      setDisplay(cur);
      if (progress < 1) {
        handle = requestAnimationFrame(animate);
      }
    }
    handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [numValue]);

  return <span className="tabular-nums">{prefix}{sign}{display.toLocaleString('en-IN')}</span>;
}

// ─── STATUS PILL ─────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const label = status === 'critical' ? 'Critical' : status === 'low' || status === 'due-soon' || status === 'warning' ? 'Low' : 'Healthy';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', color: '#FFFFFF',
      borderRadius: 12, padding: '2px 9px', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.03em',
    }}>
      {label}
    </span>
  );
}

// ─── RECHARTS TOOLTIP ────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:'#141414', border:'1px solid rgba(255,255,255,0.12)',
      borderRadius:8, padding:'10px 14px', fontSize:12,
    }}>
      <div style={{ color:'#A0A0A0', marginBottom:4, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', fontSize:10 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: '#FFFFFF', display:'flex', gap:8, alignItems:'center', margin:'2px 0' }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:p.color || '#FFFFFF', display:'inline-block' }} />
          <span style={{ color:'#A0A0A0' }}>{p.name}:</span>
          <span style={{ color:'#FFFFFF', fontWeight:700 }}>{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

// ─── INLINE SPARKLINE ────────────────────────────────────────────────────────

function Sparkline({ born, exported }) {
  const net = born - exported;
  let points = "3,13 20,10 37,4"; // positive trend
  let strokeColor = "#FFFFFF";
  
  if (net < 0) {
    points = "3,4 20,10 37,13"; // negative
    strokeColor = "#666666";
  } else if (net === 0) {
    points = "3,9 20,9 37,9"; // flat
    strokeColor = "#888888";
  }
  
  return (
    <svg width="40" height="20" style={{ overflow: 'visible', display:'inline-block', verticalAlign:'middle' }}>
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

// ─── INLINE ACCORDION FORM FOR INVENTORY ROW ──────────────────────────────────

function InlineLogForm({ species, type, onConfirm, onClose, tankStock }) {
  const [count, setCount] = useState('');
  const [tank, setTank] = useState('');
  const [note, setNote] = useState('');
  const [shake, setShake] = useState(false);
  const countRef = useRef(null);

  // Get list of tanks for this species
  const tanks = useMemo(() => {
    return Object.keys(tankStock[species.id] || {});
  }, [species, tankStock]);

  useEffect(() => {
    if (tanks.length > 0) setTank(tanks[0]);
  }, [tanks]);

  const textColors = {
    birth: '#FFFFFF',
    export: '#AAAAAA',
    death: '#666666'
  };
  const buttonConfigs = {
    birth: { bg: '#FFFFFF', text: '#000000' },
    export: { bg: '#FFFFFF', text: '#000000' },
    death: { bg: '#1A1A1A', text: '#FFFFFF' }
  };
  const placeholders = {
    birth: 'e.g. Spring breeding cycle...',
    export: 'e.g. Bulk retail order...',
    death: 'e.g. pH spike, disease...'
  };

  const handleConfirm = () => {
    const val = parseInt(count, 10);
    if (!val || val <= 0 || !tank) {
      setShake(true);
      countRef.current?.focus();
      setTimeout(() => setShake(false), 400);
      return;
    }
    onConfirm({ type, species, tankId: tank, count: val, note: note.trim() });
    onClose();
  };

  const btnCfg = buttonConfigs[type];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontSize: 13, textTransform: 'capitalize', fontWeight: 600, color: textColors[type] }}>
          Log {type}:
        </span>
      </div>
      <div style={{ width: 100, flexShrink: 0 }}>
        <select value={tank} onChange={e => setTank(e.target.value)} style={{ height: 32, padding: '4px 8px' }}>
          {tanks.map(tId => (
            <option key={tId} value={tId}>Tank {tId}</option>
          ))}
        </select>
      </div>
      <div style={{ width: 100, flexShrink: 0 }}>
        <input
          ref={countRef}
          type="number"
          min={1}
          value={count}
          onChange={e => setCount(e.target.value)}
          placeholder="Quantity"
          className={shake ? 'shake' : ''}
          style={{ border: shake ? '1px solid #666666' : undefined, height: 32, padding: '4px 8px' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={placeholders[type]}
          style={{ height: 32, padding: '4px 8px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={handleConfirm}
          style={{
            height: 32,
            padding: '0 12px',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 11,
            background: btnCfg.bg,
            color: btnCfg.text,
            border: type === 'death' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
          }}
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          style={{
            height: 32,
            padding: '0 8px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--secondary)',
            fontWeight: 500
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── TAX INVOICE OVERLAY VIEW ────────────────────────────────────────────────

function TaxInvoiceOverlay({ sale, onClose }) {
  if (!sale) return null;
  const grandTotal = sale.total;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#FFFFFF', color: '#000000',
      zIndex: 999, padding: '40px', display: 'flex', flexDirection: 'column',
      fontFamily: 'Courier, monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: 15 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>AQUAVAULT</h2>
          <span style={{ fontSize: 12, color: '#555' }}>Aquarium Fish Inventory Management</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>TAX INVOICE</h2>
          <span style={{ fontSize: 12 }}>Invoice No: SALE-{sale.id}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0', fontSize: 12 }}>
        <div>
          <strong>Billed To:</strong><br />
          {sale.buyer}<br />
          Contact: Available on file
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong>Details:</strong><br />
          Date: {formatDate(sale.date)}<br />
          Pay Mode: {sale.payMode}<br />
          Tank: System {sale.tankId}
        </div>
      </div>

      <table style={{ width: '100%', margin: '20px 0', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', color: '#000' }}>Description</th>
            <th style={{ textAlign: 'center', padding: '8px 0', color: '#000' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '8px 0', color: '#000' }}>Unit Price</th>
            <th style={{ textAlign: 'right', padding: '8px 0', color: '#000' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <td style={{ padding: '12px 0', color: '#000' }}>{sale.speciesName} (Aquarium Stock)</td>
            <td style={{ textAlign: 'center', padding: '12px 0', color: '#000' }}>{sale.qty}</td>
            <td style={{ textAlign: 'right', padding: '12px 0', color: '#000' }}>₹{sale.unitPrice.toLocaleString('en-IN')}</td>
            <td style={{ textAlign: 'right', padding: '12px 0', color: '#000' }}>₹{sale.total.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colSpan={2} />
            <td style={{ textAlign: 'right', padding: '12px 0', fontWeight: 'bold' }}>Subtotal:</td>
            <td style={{ textAlign: 'right', padding: '12px 0' }}>₹{sale.total.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colSpan={2} />
            <td style={{ textAlign: 'right', padding: '4px 0', fontWeight: 'bold' }}>Tax (0%):</td>
            <td style={{ textAlign: 'right', padding: '4px 0' }}>₹0</td>
          </tr>
          <tr style={{ borderTop: '2px solid #000' }}>
            <td colSpan={2} />
            <td style={{ textAlign: 'right', padding: '12px 0', fontWeight: 'bold', fontSize: 16 }}>Grand Total:</td>
            <td style={{ textAlign: 'right', padding: '12px 0', fontWeight: 'bold', fontSize: 16 }}>₹{grandTotal.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #000', paddingTop: 10, fontSize: 11, textAlign: 'center', color: '#666' }}>
        Thank you for your purchase. All sales are final.
      </div>

      <div className="no-print" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
        <button
          onClick={() => window.print()}
          style={{ padding: '8px 24px', background: '#000000', color: '#FFFFFF', fontWeight: 'bold', borderRadius: 6 }}
        >
          Print Invoice
        </button>
        <button
          onClick={onClose}
          style={{ padding: '8px 24px', background: '#FFFFFF', color: '#000000', border: '1px solid #000', fontWeight: 'bold', borderRadius: 6 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────

function DashboardTab({
  species,
  activity,
  alertRef,
  onViewAllLowStock,
  onConfirmLog,
  kpiFlash,
  tankStock,
  totalRevenue,
  pendingRevenue,
  totalExpenses,
  netProfit,
  pendingSales,
  overdueCount,
  waterWarnings,
  onNavigateTab,
  highUrgentIssues
}) {
  const totalFish     = useMemo(() => species.reduce((s,sp)=>s+sp.stock, 0), [species]);
  const totalBorn     = useMemo(() => species.reduce((s,sp)=>s+sp.born, 0), [species]);
  const totalExported = useMemo(() => species.reduce((s,sp)=>s+sp.exported, 0), [species]);
  const totalDied     = useMemo(() => species.reduce((s,sp)=>s+sp.died, 0), [species]);
  const lowStock      = useMemo(() => species.filter(sp=>sp.stock<=sp.min*1.5), [species]);

  // Quick Log State
  const [quickType, setQuickType] = useState('birth');
  
  // Dynamic list of tank-species options for the dropdown
  const spOptions = useMemo(() => {
    return species.flatMap(sp => {
      const spTanks = Object.entries(tankStock[sp.id] || {});
      if (spTanks.length === 0) {
        return [{ id: sp.id, tankId: 'A', name: sp.name, count: 0 }];
      }
      return spTanks.map(([tId, count]) => ({
        id: sp.id,
        tankId: tId,
        name: sp.name,
        count
      }));
    });
  }, [species, tankStock]);

  const [selectedOptIndex, setSelectedOptIndex] = useState(0);

  const [quickCount, setQuickCount] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickShake, setQuickShake] = useState(false);
  const [confirmFlash, setConfirmFlash] = useState(false);
  const [localToast, setLocalToast] = useState(null);
  
  const quickCountRef = useRef(null);

  const quickTypeConfig = {
    birth:  { textCol: '#FFFFFF', bg: '#FFFFFF', btnText: '#000000', label: 'Confirm Birth',  placeholder: 'e.g. Spring breeding, batch spawn...' },
    export: { textCol: '#AAAAAA', bg: '#FFFFFF', btnText: '#000000', label: 'Confirm Export', placeholder: 'e.g. PetZone Pune, AquaWorld Mumbai...' },
    death:  { textCol: '#666666', bg: '#1A1A1A', btnText: '#FFFFFF', label: 'Confirm Death',  placeholder: 'e.g. pH spike, disease, old age...' },
  };
  const cfg = quickTypeConfig[quickType];

  const handleQuickLogConfirm = () => {
    const val = parseInt(quickCount, 10);
    if (!val || val <= 0) {
      setQuickShake(true);
      quickCountRef.current?.focus();
      setTimeout(() => setQuickShake(false), 400);
      return;
    }
    
    const opt = spOptions[selectedOptIndex];
    if (!opt) return;
    const sp = species.find(s => s.id === opt.id);
    if (!sp) return;

    // Trigger transaction log
    onConfirmLog({ type: quickType, species: sp, tankId: opt.tankId, count: val, note: quickNote.trim() });

    // Flash button state
    setConfirmFlash(true);

    // Show local toast
    const typeLabel = quickType === 'birth' ? 'birth' : quickType === 'export' ? 'export' : 'death';
    setLocalToast({
      message: `✓ ${val} ${sp.name} — ${typeLabel} recorded in Tank ${opt.tankId}`
    });

    // Reset Form and remove flash
    setTimeout(() => {
      setConfirmFlash(false);
      setQuickCount('');
      setQuickNote('');
    }, 1000);
  };

  useEffect(() => {
    if (localToast) {
      const t = setTimeout(() => setLocalToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [localToast]);

  return (
    <div className="tab-content" style={{ display:'flex', flexDirection:'column', gap:20 }}>
      
      {/* Finance summary strip */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>TOTAL REVENUE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 4 }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>PENDING REVENUE</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#888888', marginTop: 4 }}>
            ₹{pendingRevenue.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>TOTAL EXPENSES</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--secondary)', marginTop: 4 }}>
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
        </div>
        <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>NET PROFIT</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: netProfit >= 0 ? '#FFFFFF' : '#666666', marginTop: 4 }}>
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Dynamic Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div
            ref={alertRef}
            style={{
              display:'flex', alignItems:'center', justifySelf:'stretch', justifyItems:'center',
              background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
              borderRadius:10, padding:'12px 18px', gap:12,
            }}
          >
            <AlertTriangle size={20} color="#888888" style={{ flexShrink:0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color:'#FFFFFF', fontWeight:700, fontSize:13 }}>
                {lowStock.length} species need restocking
              </div>
              <div style={{ color:'var(--secondary)', fontSize:11, marginTop:1 }}>
                {lowStock.map(s=>s.name).join(' · ')}
              </div>
            </div>
            <button
              onClick={onViewAllLowStock}
              style={{
                padding:'6px 12px', background:'#1A1A1A', border:'1px solid rgba(255,255,255,0.12)',
                color:'#FFFFFF', borderRadius:6, fontSize:11, fontWeight:700,
              }}
            >
              View All
            </button>
          </div>
        )}

        {/* Pending Sales Alert */}
        {pendingSales.length > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifySelf:'stretch', justifyItems:'center',
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'12px 18px', gap:12,
          }}>
            <AlertTriangle size={20} color="#888888" style={{ flexShrink:0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color:'#FFFFFF', fontWeight:700, fontSize:13 }}>
                {pendingSales.length} sales pending your approval
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('sales')}
              style={{
                padding:'6px 12px', background:'#1A1A1A', border:'1px solid rgba(255,255,255,0.12)',
                color:'#FFFFFF', borderRadius:6, fontSize:11, fontWeight:700,
              }}
            >
              Review
            </button>
          </div>
        )}

        {/* Equipment Service Overdue Alert */}
        {overdueCount > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifySelf:'stretch', justifyItems:'center',
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'12px 18px', gap:12,
          }}>
            <AlertTriangle size={20} color="#888888" style={{ flexShrink:0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color:'#FFFFFF', fontWeight:700, fontSize:13 }}>
                {overdueCount} equipment items overdue for service
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('equipment')}
              style={{
                padding:'6px 12px', background:'#1A1A1A', border:'1px solid rgba(255,255,255,0.12)',
                color:'#FFFFFF', borderRadius:6, fontSize:11, fontWeight:700,
              }}
            >
              View Equipment
            </button>
          </div>
        )}

        {/* Water Quality Warnings Alert */}
        {waterWarnings.length > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifySelf:'stretch', justifyItems:'center',
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'12px 18px', gap:12,
          }}>
            <AlertTriangle size={20} color="#666666" style={{ flexShrink:0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color:'#FFFFFF', fontWeight:700, fontSize:13 }}>
                Abnormal water quality in Tank {waterWarnings.join(', ')}
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('water')}
              style={{
                padding:'6px 12px', background:'#1A1A1A', border:'1px solid rgba(255,255,255,0.12)',
                color:'#FFFFFF', borderRadius:6, fontSize:11, fontWeight:700,
              }}
            >
              View Details
            </button>
          </div>
        )}

        {/* Worker High Urgency Issues Alert */}
        {highUrgentIssues.length > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifySelf:'stretch', justifyItems:'center',
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:10, padding:'12px 18px', gap:12,
          }}>
            <ShieldAlert size={20} color="#666666" style={{ flexShrink:0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ color:'#FFFFFF', fontWeight:700, fontSize:13 }}>
                High urgency issue reported: {highUrgentIssues[0].details}
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('workers')}
              style={{
                padding:'6px 12px', background:'#1A1A1A', border:'1px solid rgba(255,255,255,0.12)',
                color:'#FFFFFF', borderRadius:6, fontSize:11, fontWeight:700,
              }}
            >
              View Submissions
            </button>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <div className="card" style={{ padding:'18px 16px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.6px', color:'var(--muted)' }}>TOTAL FISH</span>
            <Fish size={18} color="#FFFFFF" />
          </div>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-1.5px', color:'#FFFFFF', marginTop:8 }}>
            <AnimatedNumber value={totalFish} />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>across all tanks</span>
        </div>

        <div className="card" style={{ padding:'18px 16px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.6px', color:'var(--muted)' }}>BORN</span>
            <Baby size={18} color="#FFFFFF" />
          </div>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-1.5px', color:'#FFFFFF', marginTop:8 }}>
            <AnimatedNumber value={totalBorn} prefix="+" />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>this month</span>
        </div>

        <div className="card" style={{ padding:'18px 16px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.6px', color:'var(--muted)' }}>EXPORTED</span>
            <Package size={18} color="#AAAAAA" />
          </div>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-1.5px', color:'#AAAAAA', marginTop:8 }}>
            <AnimatedNumber value={totalExported} />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>units shipped</span>
        </div>

        <div className="card" style={{ padding:'18px 16px', display:'flex', flexDirection:'column', position:'relative' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.6px', color:'var(--muted)' }}>DIED</span>
            <Skull size={18} color="#666666" />
          </div>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-1.5px', color:'#666666', marginTop:8 }}>
            <AnimatedNumber value={totalDied} />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', marginTop:4 }}>this month</span>
        </div>
      </div>

      {/* Section 3 — Main Two-Column Row */}
      <div className="grid-2col" style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>
        
        {/* Left Column — Quick Log Panel */}
        <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', background: '#0D0D0D' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Log Entry</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Record births, exports & deaths instantly</div>
          </div>

          {/* Type Selector */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 18 }}>
            <button
              onClick={() => setQuickType('birth')}
              style={{
                flex: 1, height: 38, borderRadius: 8, fontWeight: 600, fontSize: 12,
                background: quickType === 'birth' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: quickType === 'birth' ? '#FFFFFF' : 'var(--muted)'
              }}
            >
              🐣 Birth
            </button>
            <button
              onClick={() => setQuickType('export')}
              style={{
                flex: 1, height: 38, borderRadius: 8, fontWeight: 600, fontSize: 12,
                background: quickType === 'export' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: quickType === 'export' ? '#AAAAAA' : 'var(--muted)'
              }}
            >
              📦 Export
            </button>
            <button
              onClick={() => setQuickType('death')}
              style={{
                flex: 1, height: 38, borderRadius: 8, fontWeight: 600, fontSize: 12,
                background: quickType === 'death' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: quickType === 'death' ? '#666666' : 'var(--muted)'
              }}
            >
              💀 Death
            </button>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Species & Tank selection combined */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Species & Tank</span>
                <select value={selectedOptIndex} onChange={e => setSelectedOptIndex(Number(e.target.value))}>
                  {spOptions.map((opt, idx) => (
                    <option key={idx} value={idx}>
                      {opt.name} — Tank {opt.tankId} ({opt.count} stock)
                    </option>
                  ))}
                </select>
              </div>

              {/* Count */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Count</span>
                <input
                  ref={quickCountRef}
                  type="number"
                  min={1}
                  value={quickCount}
                  onChange={e => setQuickCount(e.target.value)}
                  placeholder="How many?"
                  className={quickShake ? 'shake' : ''}
                  style={{ border: quickShake ? '1px solid #666666' : undefined }}
                />
              </div>
            </div>

            {/* Note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Note (optional)</span>
              <input
                type="text"
                value={quickNote}
                onChange={e => setQuickNote(e.target.value)}
                placeholder={cfg.placeholder}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleQuickLogConfirm}
            style={{
              width: '100%', height: 44, borderRadius: 10, fontWeight: 700, fontSize: 14,
              marginTop: 16, border: quickType === 'death' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
              color: cfg.btnText,
              background: confirmFlash ? '#FFFFFF' : cfg.bg
            }}
          >
            {confirmFlash ? '✓ Recorded' : cfg.label}
          </button>

          {/* Local Toast inside the panel */}
          {localToast && (
            <div style={{
              marginTop: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 500,
              textAlign: 'center'
            }}>
              {localToast.message}
            </div>
          )}
        </div>

        {/* Right Column — Live Activity Feed */}
        <div className="card" style={{ padding: 18, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Live Activity</span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>Updated just now</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activity.slice(0, 8).map((act, index) => {
              const textColors = { birth: '#FFFFFF', export: '#AAAAAA', death: '#666666', transfer: '#888888', quarantine: '#666666', quarantine_lift: '#FFFFFF' };
              const sign = act.type === 'birth' ? '+' : act.type === 'export' ? '→' : act.type === 'death' ? '−' : '';
              const dotColor = textColors[act.type] || '#FFFFFF';

              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 0',
                    borderBottom: index === 7 ? 'none' : '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    {act.type === 'birth' && <span style={{ fontSize: 13 }}>🐣</span>}
                    {act.type === 'export' && <span style={{ fontSize: 13 }}>📦</span>}
                    {act.type === 'death' && <span style={{ fontSize: 13 }}>💀</span>}
                    {act.type === 'transfer' && <span style={{ fontSize: 13 }}>⇄</span>}
                    {act.type === 'quarantine' && <span style={{ fontSize: 13 }}>🔒</span>}
                    {act.type === 'quarantine_lift' && <span style={{ fontSize: 13 }}>✓</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
                        {sign && <span style={{ color: dotColor, fontWeight: 700, marginRight: 4 }}>{sign}{act.count}</span>}
                        {act.type === 'transfer' ? (
                          <span>⇄ {act.count} {act.species} moved from Tank {act.from} → Tank {act.to}</span>
                        ) : act.type === 'quarantine' ? (
                          <span>🔒 Tank {act.tank} quarantined — {act.note}</span>
                        ) : act.type === 'quarantine_lift' ? (
                          <span>✓ Tank {act.tank} quarantine lifted</span>
                        ) : (
                          <span>{act.species}</span>
                        )}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{act.time}</span>
                    </div>
                    {act.type !== 'quarantine' && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{act.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 4 — Tank Overview Strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Tanks</span>
          <button
            onClick={() => onNavigateTab('tanks')}
            style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', background: 'none' }}
          >
            All Systems
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
          {TANKS_DATA.map(tank => {
            // Count unique species mapping in this tank
            let uniqueSpeciesCount = 0;
            let hasLowStockSpecies = false;
            species.forEach(sp => {
              const stockInTank = tankStock[sp.id]?.[tank.id] ?? 0;
              if (stockInTank > 0) {
                uniqueSpeciesCount++;
                if (stockInTank <= sp.min) {
                  hasLowStockSpecies = true;
                }
              }
            });

            // calculate actual current total dynamically
            const actualCurrent = species.reduce((sum, sp) => sum + (tankStock[sp.id]?.[tank.id] ?? 0), 0);

            const pct = Math.round((actualCurrent / tank.capacity) * 100);
            const fillCol = pct > 85 ? '#666666' : pct > 65 ? '#888888' : '#FFFFFF';
            return (
              <div key={tank.id} className="card" style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                
                {/* Amber dot indicator if species stock is low in this tank */}
                {hasLowStockSpecies && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 6, height: 6, borderRadius: '50%', background: '#888888'
                  }} />
                )}

                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Tank {tank.id}</span>
                
                <span style={{
                  fontSize: 9, fontWeight: 600, color: 'var(--secondary)',
                  background: 'rgba(255,255,255,0.04)', borderRadius: 4,
                  padding: '1px 6px', margin: '4px 0'
                }}>
                  {tank.type.toUpperCase()}
                </span>
                
                {/* Vertical Capacity Bar */}
                <div style={{
                  height: 40, width: 18, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 4, position: 'relative', overflow: 'hidden', margin: '8px 0'
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    width: '100%', height: `${pct}%`, background: fillCol,
                    transition: 'height 0.5s ease',
                    boxShadow: `0 0 6px ${fillCol}40`
                  }} />
                </div>

                <span style={{ fontSize: 11, fontWeight: 700, color: fillCol }}>{pct}%</span>
                
                {/* Unique Species Count */}
                <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>
                  {uniqueSpeciesCount} species
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 5 — Stock Trend Chart */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Stock Trend — Last 6 Months</span>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFFFFF' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFFFFF' }} /> Born
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#AAAAAA' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#AAAAAA' }} /> Exported
            </span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="born" name="Born"
              stroke="#FFFFFF" strokeWidth={2}
              fill="rgba(255,255,255,0.04)"
            />
            <Area
              type="monotone" dataKey="exported" name="Exported"
              stroke="#AAAAAA" strokeWidth={2}
              fill="rgba(255,255,255,0.04)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// ─── INVENTORY TAB ────────────────────────────────────────────────────────────

function InventoryTab({ species, search, onConfirmLog, filterLowStock, onClearFilter, tankStock }) {
  const filtered = useMemo(() => {
    let result = species;
    if (search.trim()) {
      result = result.filter(sp => sp.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (filterLowStock) {
      result = result.filter(sp => sp.stock <= sp.min * 1.5);
    }
    return result;
  }, [species, search, filterLowStock]);

  const [openAccordion, setOpenAccordion] = useState({ speciesId: null, type: null });

  const toggleAccordion = (spId, type) => {
    if (openAccordion.speciesId === spId && openAccordion.type === type) {
      setOpenAccordion({ speciesId: null, type: null });
    } else {
      setOpenAccordion({ speciesId: spId, type });
    }
  };

  return (
    <div className="tab-content" style={{ display:'flex', flexDirection:'column', gap:12 }}>
      
      {/* Toolbar / Search display info if filtering low stock */}
      {filterLowStock && (
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '8px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize:12, color:'#FFFFFF', fontWeight:600 }}>Showing low-stock species only</span>
          <button
            onClick={onClearFilter}
            style={{
              padding: '4px 10px', background: '#1A1A1A',
              borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Toolbar (Standard) */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={14} color="#555555" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)' }} />
          <input
            value={search}
            disabled={true}
            placeholder="Search from global top bar..."
            style={{ paddingLeft:32, color:'var(--muted)', background:'rgba(255,255,255,0.02)' }}
          />
        </div>
        <button
          onClick={() => alert('Coming in full build')}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          <Plus size={14} /> Add Species
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ overflowX:'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Species</th>
              <th>Tanks Mapped</th>
              <th>Stock</th>
              <th>Trend</th>
              <th>Born</th>
              <th>Exported</th>
              <th>Status</th>
              <th style={{ textAlign:'right', paddingRight:20 }}>Quick Log</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sp => {
              const status = getStatus(sp);
              const isLow = status === 'low';
              const isCritical = status === 'critical';
              const rowBg = isCritical ? 'rgba(255,255,255,0.04)' : isLow ? 'rgba(255,255,255,0.02)' : undefined;

              // Extract tank listing
              const mappedTanks = Object.keys(tankStock[sp.id] || {}).join(', ');

              return (
                <tr key={sp.id} style={{ background: rowBg }}>
                  <td style={{ fontWeight:600, color:'var(--text)' }}>{sp.name}</td>
                  <td style={{ color:'var(--secondary)' }}>Tanks: {mappedTanks || 'None'}</td>
                  <td>
                    <span style={{ fontWeight:700, fontSize:14, color: isCritical ? '#666666' : '#FFFFFF' }}>
                      <AnimatedNumber value={sp.stock} />
                    </span>
                  </td>
                  <td><Sparkline born={sp.born} exported={sp.exported} /></td>
                  <td style={{ color:'#FFFFFF', fontWeight:600 }}>+{sp.born}</td>
                  <td style={{ color:'#AAAAAA', fontWeight:600 }}>{sp.exported}</td>
                  <td><StatusPill status={status} /></td>
                  <td style={{ textAlign:'right', paddingRight:14 }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        title="Log Birth"
                        onClick={() => toggleAccordion(sp.id, 'birth')}
                        style={{
                          width:28, height:28, borderRadius:6,
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                          color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                      >
                        🐣
                      </button>
                      <button
                        title="Log Export"
                        onClick={() => toggleAccordion(sp.id, 'export')}
                        style={{
                          width:28, height:28, borderRadius:6,
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                          color: '#AAAAAA', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                      >
                        📦
                      </button>
                      <button
                        title="Log Death"
                        onClick={() => toggleAccordion(sp.id, 'death')}
                        style={{
                          width:28, height:28, borderRadius:6,
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                          color: '#666666', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                      >
                        💀
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {/* accordion placeholder rows */}
            {filtered.map(sp => {
              const isOpen = openAccordion.speciesId === sp.id;
              if (!isOpen) return null;
              return (
                <tr key={`${sp.id}-acc`}>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div style={{
                      maxHeight: isOpen ? '100px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 250ms ease, opacity 250ms ease'
                    }}>
                      <InlineLogForm
                        species={sp}
                        type={openAccordion.type}
                        onConfirm={onConfirmLog}
                        tankStock={tankStock}
                        onClose={() => setOpenAccordion({ speciesId: null, type: null })}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign:'center', color:'var(--muted)', padding:'28px' }}>
                  No species match your query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TANKS TAB (OVERHAULED) ──────────────────────────────────────────────────

function TanksTab({ species, tankStock, quarantinedTanks, setQuarantinedTanks, onConfirmLog, onTransferStock, onAddSpeciesToTank }) {
  const [tankView, setTankView] = useState('species'); // 'species' | 'tanks'
  const [search, setSearch] = useState('');
  
  // Expanded species cards mapping (first is true initially)
  const [expandedSpecies, setExpandedSpecies] = useState({ 1: true });

  const toggleExpand = (spId) => {
    setExpandedSpecies(prev => ({ ...prev, [spId]: !prev[spId] }));
  };

  // Inline forms states inside Species cards
  const [addFormSpId, setAddFormSpId] = useState(null);
  const [addFormTank, setAddFormTank] = useState('');
  const [addFormCount, setAddFormCount] = useState('');
  
  const [transFormSpId, setTransFormSpId] = useState(null);
  const [transFormFrom, setTransFormFrom] = useState('');
  const [transFormTo, setTransFormTo] = useState('');
  const [transFormCount, setTransFormCount] = useState('');

  // Quarantine input state for tank view
  const [quarFormTankId, setQuarFormTankId] = useState(null);
  const [quarReason, setQuarReason] = useState('');

  // Derived values for warning statistic: count of tank-species pairs below minimum
  const lowStockPairsCount = useMemo(() => {
    let count = 0;
    species.forEach(sp => {
      Object.entries(tankStock[sp.id] || {}).forEach(([tankId, stockVal]) => {
        if (stockVal <= sp.min) {
          count++;
        }
      });
    });
    return count;
  }, [species, tankStock]);

  const filteredSpecies = useMemo(() => {
    return species.filter(sp => sp.name.toLowerCase().includes(search.toLowerCase()))
      .map(sp => ({
        ...sp,
        tanks: Object.entries(tankStock[sp.id] || {}).map(([tankId, count]) => ({ tankId, count }))
      }));
  }, [species, tankStock, search]);

  const filteredTanks = useMemo(() => {
    return TANKS_DATA.filter(t => t.id.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // CATEGORIES FOR COLORING SEGS IN MONOCHROME
  const segGrays = ['#666666', '#888888', '#AAAAAA', '#CCCCCC'];

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        {/* Toggle group */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <button
            onClick={() => setTankView('species')}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500,
              background: tankView === 'species' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: tankView === 'species' ? '#FFFFFF' : 'var(--secondary)'
            }}
          >
            By Species
          </button>
          <button
            onClick={() => setTankView('tanks')}
            style={{
              padding: '8px 16px', fontSize: 13, fontWeight: 500,
              background: tankView === 'tanks' ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: tankView === 'tanks' ? '#FFFFFF' : 'var(--secondary)'
            }}
          >
            By Tank
          </button>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ position: 'relative', width: 200 }}>
            <Search size={14} color="#555555" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search species or tank..."
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '6px 12px 6px 32px',
                fontSize: 12
              }}
            />
          </div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {lowStockPairsCount} tank-species pairs below minimum
          </span>
        </div>
      </div>

      {/* VIEW A — BY SPECIES */}
      {tankView === 'species' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredSpecies.map(sp => {
            const isExpanded = expandedSpecies[sp.id];
            const totalStock = sp.tanks.reduce((s,t) => s + t.count, 0);

            // Concentration bar segment calculation
            const maxVal = totalStock || 1;
            const segments = sp.tanks.map((t, idx) => ({
              tankId: t.tankId,
              count: t.count,
              width: `${(t.count / maxVal) * 120}px`,
              color: segGrays[idx % segGrays.length]
            }));

            // Alert pills
            const isLow = totalStock <= sp.min;
            const isCritical = totalStock <= sp.min * 0.5;

            // Prediction metrics
            const avgDailyExport = sp.exported / 30;

            return (
              <div key={sp.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div
                  onClick={() => toggleExpand(sp.id)}
                  style={{
                    padding: '14px 16px', display: 'flex', alignItems: 'center',
                    gap: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.01)'
                  }}
                >
                  <ChevronRight
                    size={16}
                    color="var(--secondary)"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 200ms ease'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{sp.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 2 }}>{totalStock} fish total</div>
                  </div>

                  {/* Right side stats */}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Concentration bar */}
                    {totalStock > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <div style={{ display: 'flex', gap: 1, background: '#fff', borderRadius: 2, overflow: 'hidden', height: 4, width: 120 }}>
                          {segments.map((seg, sidx) => (
                            <div
                              key={sidx}
                              style={{ width: seg.width, height: '100%', background: seg.color }}
                              title={`Tank ${seg.tankId}: ${seg.count}`}
                            />
                          ))}
                        </div>
                        <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                          {sp.tanks.map(t => `${t.tankId}·${t.count}`).join(' ')}
                        </span>
                      </div>
                    )}

                    {isCritical ? (
                      <span style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', color: '#FFFFFF', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
                        ⚠ Critical
                      </span>
                    ) : isLow ? (
                      <span style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', color: '#FFFFFF', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
                        ⚠ Low
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Collapsible Body */}
                <div style={{
                  maxHeight: isExpanded ? '600px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 300ms ease',
                  borderTop: isExpanded ? '1px solid var(--border)' : 'none'
                }}>
                  <div style={{ padding: '16px' }}>
                    
                    {/* Tank Sub-cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: 12 }}>
                      {sp.tanks.map(t => {
                        const isQuarantined = quarantinedTanks[t.tankId] !== undefined;
                        const maxCountForSpecies = Math.max(...sp.tanks.map(tk => tk.count));
                        const fillPct = maxCountForSpecies > 0 ? (t.count / maxCountForSpecies) * 100 : 0;
                        
                        const fillCol = t.count < 10 ? '#666666' : t.count < 30 ? '#888888' : '#FFFFFF';
                        
                        const days = avgDailyExport > 0 ? Math.round(t.count / avgDailyExport) : null;

                        return (
                          <div
                            key={t.tankId}
                            style={{
                              background: isQuarantined ? 'rgba(255,71,87,0.04)' : '#060C18',
                              border: `1px solid ${isQuarantined ? 'rgba(255,71,87,0.15)' : 'rgba(255,255,255,0.07)'}`,
                              borderRadius: 8, padding: 12, position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Tank {t.tankId}</span>
                              {isQuarantined && <span style={{ fontSize: 11 }}>🔒</span>}
                            </div>
                            
                            {/* Value count */}
                            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginTop: 6 }}>
                              {t.count}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--muted)' }}>fish</div>

                            {/* Mini vertical fill bar */}
                            <div style={{
                              position: 'absolute', top: 12, right: 12,
                              height: 40, width: 8, background: 'rgba(255,255,255,0.06)',
                              borderRadius: 4, overflow: 'hidden'
                            }}>
                              <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                width: '100%', height: `${fillPct}%`, background: fillCol
                              }} />
                            </div>

                            {/* Prediction drain */}
                            <div style={{ marginTop: 10 }}>
                              {isQuarantined ? (
                                <span style={{ fontSize: 9, color: '#FF4757', fontWeight: 600 }}>🔒 Quarantined</span>
                              ) : days !== null ? (
                                <span style={{ fontSize: 9, color: 'var(--muted)' }}>Drain in ~{days}d</span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions Row */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setAddFormSpId(addFormSpId === sp.id ? null : sp.id);
                          setTransFormSpId(null);
                        }}
                        style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, background: '#1A1A1A', color: '#fff' }}
                      >
                        ＋ Add to Tank
                      </button>
                      <button
                        onClick={() => {
                          setTransFormSpId(transFormSpId === sp.id ? null : sp.id);
                          setAddFormSpId(null);
                          // Default values
                          if (sp.tanks.length > 0) {
                            setTransFormFrom(sp.tanks[0].tankId);
                            // Find any target tank
                            const others = TANKS_DATA.filter(tk => tk.id !== sp.tanks[0].tankId);
                            if (others.length > 0) setTransFormTo(others[0].id);
                          }
                        }}
                        style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, background: '#1A1A1A', color: '#fff' }}
                      >
                        ⇄ Transfer Stock
                      </button>
                    </div>

                    {/* Inline Add Form */}
                    {addFormSpId === sp.id && (
                      <div style={{
                        marginTop: 10, padding: 12, background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)', borderRadius: 8, display: 'flex',
                        alignItems: 'center', gap: 10, flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>Add to Tank:</span>
                        <select
                          value={addFormTank}
                          onChange={e => setAddFormTank(e.target.value)}
                          style={{ width: 100, height: 32, padding: '4px 8px' }}
                        >
                          <option value="">Select Tank</option>
                          {/* list only tanks where this species is not already or all */}
                          {TANKS_DATA.map(t => (
                            <option key={t.id} value={t.id}>Tank {t.id}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Count"
                          value={addFormCount}
                          onChange={e => setAddFormCount(e.target.value)}
                          style={{ width: 80, height: 32, padding: '4px 8px' }}
                        />
                        <button
                          onClick={() => {
                            const val = parseInt(addFormCount, 10);
                            if (!addFormTank || !val || val <= 0) return;
                            onAddSpeciesToTank(sp.id, addFormTank, val);
                            setAddFormCount('');
                            setAddFormSpId(null);
                          }}
                          style={{ height: 32, padding: '0 12px', background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* Inline Transfer Form */}
                    {transFormSpId === sp.id && (
                      <div style={{
                        marginTop: 10, padding: 12, background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)', borderRadius: 8, display: 'flex',
                        alignItems: 'center', gap: 10, flexWrap: 'wrap'
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600 }}>Transfer:</span>
                        
                        <select
                          value={transFormFrom}
                          onChange={e => setTransFormFrom(e.target.value)}
                          style={{ width: 100, height: 32, padding: '4px 8px' }}
                        >
                          {sp.tanks.map(t => (
                            <option key={t.tankId} value={t.tankId}>From {t.tankId}</option>
                          ))}
                        </select>

                        <select
                          value={transFormTo}
                          onChange={e => setTransFormTo(e.target.value)}
                          style={{ width: 100, height: 32, padding: '4px 8px' }}
                        >
                          {TANKS_DATA.filter(t => t.id !== transFormFrom).map(t => (
                            <option key={t.id} value={t.id}>To {t.id}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          placeholder="Count"
                          value={transFormCount}
                          onChange={e => setTransFormCount(e.target.value)}
                          style={{ width: 80, height: 32, padding: '4px 8px' }}
                        />
                        
                        <button
                          onClick={() => {
                            const val = parseInt(transFormCount, 10);
                            if (!transFormFrom || !transFormTo || !val || val <= 0) return;
                            onTransferStock(sp.id, transFormFrom, transFormTo, val);
                            setTransFormCount('');
                            setTransFormSpId(null);
                          }}
                          style={{ height: 32, padding: '0 12px', background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
                        >
                          Transfer
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW B — BY TANK */}
      {tankView === 'tanks' && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',
          gap:14,
        }}>
          {filteredTanks.map(tank => {
            const isQuarantined = quarantinedTanks[tank.id] !== undefined;
            
            // get species inside this tank dynamically
            const matchingSpecies = species
              .map(s => ({ ...s, count: tankStock[s.id]?.[tank.id] ?? 0 }))
              .filter(s => s.count > 0);

            const actualCurrent = matchingSpecies.reduce((s,sp) => s + sp.count, 0);
            const pct = Math.round((actualCurrent / tank.capacity) * 100);
            const fillCol = pct > 85 ? '#666666' : pct > 65 ? '#888888' : '#FFFFFF';

            return (
              <div
                key={tank.id}
                className="card"
                style={{
                  padding: '16px', display: 'flex', flexDirection: 'column', gap: 14,
                  border: isQuarantined ? '1px solid rgba(255, 71, 87, 0.35)' : undefined
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>Tank {tank.id}</span>
                    {isQuarantined && (
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                        {quarantinedTanks[tank.id].reason}
                      </div>
                    )}
                  </div>
                  {isQuarantined ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(255, 71, 87, 0.12)', color: '#FF4757', borderRadius: 6 }}>
                      🔒 Quarantined
                    </span>
                  ) : (
                    <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, color: 'var(--secondary)' }}>
                      {tank.type}
                    </span>
                  )}
                </div>

                {/* Capacity occupancy */}
                <div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: fillCol }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4 }}>
                    <span style={{ color: 'var(--secondary)' }}>{actualCurrent} / {tank.capacity} Occupied</span>
                    <span style={{ fontWeight: 700, color: fillCol }}>{pct}%</span>
                  </div>
                </div>

                {/* Species List mini table inside tank card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                    Species inside
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {matchingSpecies.map(sp => {
                      const fillW = tank.capacity > 0 ? (sp.count / tank.capacity) * 100 : 0;
                      return (
                        <div key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: '#fff', width: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sp.name}
                          </span>
                          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 1.5 }}>
                            <div style={{ height: '100%', width: `${fillW}%`, background: '#fff' }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', width: 24, textAlign: 'right' }}>
                            {sp.count}
                          </span>
                        </div>
                      );
                    })}
                    {matchingSpecies.length === 0 && (
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>Empty Tank</span>
                    )}
                  </div>
                </div>

                {/* Bottom Quarantine Toggle buttons */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  {isQuarantined ? (
                    <button
                      onClick={() => {
                        setQuarantinedTanks(prev => {
                          const copy = { ...prev };
                          delete copy[tank.id];
                          return copy;
                        });
                        onConfirmLog({ type: 'quarantine_lift', tankId: tank.id });
                      }}
                      style={{ width: '100%', padding: '6px', background: '#FFFFFF', color: '#000000', fontWeight: 'bold', fontSize: 11, borderRadius: 6 }}
                    >
                      Lift Quarantine
                    </button>
                  ) : (
                    <div>
                      {quarFormTankId === tank.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <input
                            type="text"
                            placeholder="Reason for locking..."
                            value={quarReason}
                            onChange={e => setQuarReason(e.target.value)}
                            style={{ height: 30, padding: '4px 8px', fontSize: 11 }}
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => {
                                if (!quarReason.trim()) return;
                                setQuarantinedTanks(prev => ({
                                  ...prev,
                                  [tank.id]: { reason: quarReason.trim(), since: today() }
                                }));
                                onConfirmLog({ type: 'quarantine', tankId: tank.id, note: quarReason.trim() });
                                setQuarReason('');
                                setQuarFormTankId(null);
                              }}
                              style={{ flex: 1, padding: '4px', background: '#FFFFFF', color: '#000000', fontSize: 11, fontWeight: 'bold', borderRadius: 6 }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setQuarFormTankId(null)}
                              style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', color: 'var(--secondary)', fontSize: 11, borderRadius: 6 }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setQuarFormTankId(tank.id)}
                          style={{ width: '100%', padding: '6px', background: '#1A1A1A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.12)', fontSize: 11, borderRadius: 6 }}
                        >
                          Quarantine Tank
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

// ─── REPORTS TAB ─────────────────────────────────────────────────────────────

function ReportsTab({ species }) {
  // Pie chart of species stock distribution
  const stockData = useMemo(() => {
    return species.map(sp => ({
      name: sp.name,
      value: sp.stock
    })).filter(s => s.value > 0);
  }, [species]);

  // Bar chart of transaction stats per species
  const statsData = useMemo(() => {
    return species.map(sp => ({
      name: sp.name,
      Born: sp.born,
      Exported: sp.exported,
      Died: sp.died
    }));
  }, [species]);

  const grays = ['#FFFFFF', '#CCCCCC', '#AAAAAA', '#888888', '#666666', '#444444'];

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {/* Card 1: Species Distribution Chart */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>
            Stock Distribution by Species
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill:'#555555', fontSize:9 }} angle={-45} textAnchor="end" height={60} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Stock" fill="#FFFFFF" radius={[4, 4, 0, 0]}>
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={grays[index % grays.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Card 2: Births / Exports / Deaths Comparison */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>
            Log Comparison by Species
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill:'#555555', fontSize:9 }} angle={-45} textAnchor="end" height={60} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 10 }} />
              <Bar dataKey="Born" fill="#FFFFFF" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Exported" fill="#AAAAAA" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Died" fill="#666666" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── FINANCES TAB ────────────────────────────────────────────────────────────

function FinancesTab({ expenses, setExpenses, sales, onLogLocalToast }) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today());
  const [tankId, setTankId] = useState('All');
  
  const [localPanelToast, setLocalPanelToast] = useState(null);

  // Derived revenue & expenses
  const paidSales = useMemo(() => sales.filter(s => s.payStatus === 'paid'), [sales]);
  const revenueTotal = useMemo(() => paidSales.reduce((sum, s) => sum + s.total, 0), [paidSales]);
  
  const expenseTotal = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const netTotal = revenueTotal - expenseTotal;
  
  const marginPct = revenueTotal > 0 ? Math.round((netTotal / revenueTotal) * 100) : 0;

  // Breakdown metrics
  const foodTotal = useMemo(() => expenses.filter(e => e.category === 'Fish Food').reduce((s,e) => s+e.amount, 0), [expenses]);
  const repairTotal = useMemo(() => expenses.filter(e => e.category === 'Tank Repair' || e.category === 'Equipment Repair').reduce((s,e) => s+e.amount, 0), [expenses]);
  const utilTotal = useMemo(() => expenses.filter(e => e.category === 'Utilities').reduce((s,e) => s+e.amount, 0), [expenses]);

  // Expenses grouped by Category
  const catChartData = useMemo(() => {
    const counts = {};
    EXPENSE_CATEGORIES.forEach(c => { counts[c] = 0; });
    expenses.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + e.amount;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const val = parseInt(amount, 10);
    if (!val || val <= 0 || !description.trim()) return;

    const newExp = {
      id: Date.now(),
      category,
      amount: val,
      description: description.trim(),
      date,
      tank: tankId === 'All' ? null : tankId,
      worker: 'Admin',
      status: 'approved'
    };

    setExpenses(prev => [newExp, ...prev]);

    setLocalPanelToast(`Expense logged — ₹${val.toLocaleString('en-IN')} for ${category}`);
    setTimeout(() => setLocalPanelToast(null), 3000);

    setAmount('');
    setDescription('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Section 1 — P&L Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>REVENUE</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            ₹{revenueTotal.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            from {paidSales.length} confirmed sales
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>EXPENSES</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            ₹{expenseTotal.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Food ₹{foodTotal.toLocaleString('en-IN')} · Repairs ₹{repairTotal.toLocaleString('en-IN')} · Utils ₹{utilTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>NET PROFIT</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: netTotal >= 0 ? '#FFFFFF' : '#666666', marginTop: 6 }}>
            ₹{netTotal.toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Margin {marginPct}%
          </span>
        </div>
      </div>

      {/* Section 2 — Add Expense Form */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Record Expense</div>
        <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          <div style={{ flex: 1, minWidth: 120 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>CATEGORY</span>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ height: 34 }}>
              {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ width: 100 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>AMOUNT (₹)</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 1500"
              style={{ height: 34 }}
            />
          </div>

          <div style={{ flex: 2, minWidth: 150 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>DESCRIPTION</span>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe items bought"
              style={{ height: 34 }}
            />
          </div>

          <div style={{ width: 120 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>DATE</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ height: 34 }}
            />
          </div>

          <div style={{ width: 90 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>TANK</span>
            <select value={tankId} onChange={e => setTankId(e.target.value)} style={{ height: 34 }}>
              <option value="All">All Tanks</option>
              {TANKS_DATA.map(t => <option key={t.id} value={t.id}>Tank {t.id}</option>)}
            </select>
          </div>

          <button
            type="submit"
            style={{
              height: 34, padding: '0 16px', background: '#FFFFFF', color: '#000000',
              fontWeight: 'bold', borderRadius: 8, fontSize: 12
            }}
          >
            Record
          </button>
        </form>

        {localPanelToast && (
          <div style={{
            marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
            color: '#FFFFFF', fontSize: 11, fontWeight: 600
          }}>
            {localPanelToast}
          </div>
        )}
      </div>

      {/* Section 3 — Expense Table */}
      <div className="card" style={{ overflowX: 'auto', padding: '18px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 18px 12px 18px' }}>
          Expense Logs
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Tank</th>
              <th>Logged By</th>
              <th>Amount</th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td>{formatDate(e.date)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 2,
                      background: catChartData.findIndex(cd => cd.name === e.category) % 2 === 0 ? '#FFFFFF' : '#888888'
                    }} />
                    {e.category}
                  </div>
                </td>
                <td style={{ color: 'var(--secondary)' }}>{e.description}</td>
                <td>{e.tank ? `Tank ${e.tank}` : 'All System'}</td>
                <td style={{ color: 'var(--muted)' }}>{e.worker || 'System'}</td>
                <td style={{ fontWeight: 700 }}>₹{e.amount.toLocaleString('en-IN')}</td>
                <td style={{ textAlign: 'right', paddingRight: 16 }}>
                  <button
                    onClick={() => handleDeleteExpense(e.id)}
                    style={{ background: 'none', color: '#666666' }}
                    onMouseEnter={ev => ev.currentTarget.style.color = '#fff'}
                    onMouseLeave={ev => ev.currentTarget.style.color = '#666666'}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', margin: '14px 20px 0 0', fontSize: 13, color: '#fff' }}>
          Total this month: <strong>₹{expenseTotal.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Section 4 — Category Bar Chart */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 16 }}>
          Expenses by Category
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={catChartData} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
            <XAxis type="number" tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill:'#A0A0A0', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#FFFFFF" radius={[0, 4, 4, 0]} maxBarSize={14}>
              {catChartData.map((entry, idx) => (
                <Cell key={idx} fill={idx % 2 === 0 ? '#FFFFFF' : '#888888'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// ─── SALES & ORDERS TAB ──────────────────────────────────────────────────────

function SalesTab({ sales, setSales, species, customers, setCustomers, onDeductStock, onLogLocalToast, onOpenInvoice }) {
  
  // Confirmed Sales
  const confirmed = useMemo(() => sales.filter(s => s.approved), [sales]);
  const confirmedCount = confirmed.length;
  const confirmedValue = confirmed.reduce((sum,s) => sum + s.total, 0);

  // Pending approval list
  const pending = useMemo(() => sales.filter(s => !s.approved), [sales]);
  
  // Top buyer
  const topBuyer = useMemo(() => {
    const buyers = {};
    confirmed.forEach(s => {
      buyers[s.buyer] = (buyers[s.buyer] || 0) + s.total;
    });
    const sortedB = Object.entries(buyers).sort((a,b) => b[1] - a[1]);
    return sortedB[0] ? { name: sortedB[0][0], value: sortedB[0][1] } : null;
  }, [confirmed]);

  // Last 7 days revenue chart
  const revenueChartData = useMemo(() => {
    // Past 7 days dates starting from July 28
    const dates = ['2026-07-22', '2026-07-23', '2026-07-24', '2026-07-25', '2026-07-26', '2026-07-27', '2026-07-28'];
    return dates.map(d => {
      const sum = sales
        .filter(s => s.date === d && s.approved && s.payStatus === 'paid')
        .reduce((sTotal, s) => sTotal + s.total, 0);
      return {
        date: formatDate(d).slice(0, 6),
        revenue: sum
      };
    });
  }, [sales]);

  // Approve Sale action
  const handleApproveSale = (id) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    // Deduct stock per tank stock model logic
    onDeductStock(sale.speciesId, sale.tankId, sale.qty);

    // Update customer records or insert new
    setCustomers(prev => {
      const idx = prev.findIndex(c => c.name.toLowerCase() === sale.buyer.toLowerCase());
      if (idx !== -1) {
        return prev.map((c, i) => i === idx ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalValue: c.totalValue + sale.total,
          lastOrder: sale.date
        } : c);
      } else {
        return [...prev, {
          id: Date.now(),
          name: sale.buyer,
          contact: 'Not listed',
          totalOrders: 1,
          totalValue: sale.total,
          lastOrder: sale.date,
          topSpecies: sale.speciesName
        }];
      }
    });

    // Mark approved
    setSales(prev => prev.map(s => s.id === id ? { ...s, approved: true, payStatus: 'paid' } : s));
  };

  // Reject Sale
  const handleRejectSale = (id) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Section 1 — Sales summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>CONFIRMED SALES</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            {confirmedCount}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Total Value: ₹{confirmedValue.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>PENDING APPROVAL</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: pending.length > 0 ? '#888888' : '#FFFFFF', marginTop: 6 }}>
            {pending.length}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            {pending.length > 0 ? 'Needs review' : 'All clear'}
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>TOP BUYER</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginTop: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {topBuyer ? topBuyer.name : 'N/A'}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            {topBuyer ? `Spent ₹${topBuyer.value.toLocaleString('en-IN')}` : 'No orders recorded'}
          </span>
        </div>
      </div>

      {/* Section 2 — Pending Approvals Panel */}
      {pending.length > 0 && (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Awaiting Approval</span>
            <span style={{
              fontSize: 10, padding: '2px 6px', background: '#1A1A1A', color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.20)', borderRadius: 10, fontWeight: 700
            }}>
              {pending.length}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {pending.map(s => (
              <div key={s.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: 12, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold'
                  }}>
                    {s.worker ? s.worker.split(' ').map(w => w[0]).join('') : 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{s.worker || 'Admin'}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>Logged on {formatDate(s.date)}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12 }}>
                  <strong>{s.speciesName}</strong><br />
                  <span style={{ color: 'var(--secondary)' }}>{s.qty} units from Tank {s.tankId} @ ₹{s.unitPrice} = ₹{s.total}</span>
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Buyer: {s.buyer}
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                  <button
                    onClick={() => handleApproveSale(s.id)}
                    style={{ flex: 1, padding: '6px 0', background: '#FFFFFF', color: '#000000', fontWeight: 'bold', fontSize: 11, borderRadius: 6 }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRejectSale(s.id)}
                    style={{ flex: 1, padding: '6px 0', background: 'rgba(255, 71, 87, 0.12)', border: '1px solid rgba(255, 71, 87, 0.25)', color: '#FF4757', fontWeight: 'bold', fontSize: 11, borderRadius: 6 }}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3 — All Sales Table */}
      <div className="card" style={{ overflowX: 'auto', padding: '18px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 18px 12px 18px' }}>
          Sale & Order Logs
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Species</th>
              <th>Tank</th>
              <th>Qty</th>
              <th>Unit ₹</th>
              <th>Total ₹</th>
              <th>Buyer</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Worker</th>
              <th style={{ textAlign: 'center', paddingRight: 20 }}>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>{formatDate(s.date)}</td>
                <td style={{ fontWeight: 600 }}>{s.speciesName}</td>
                <td>Tank {s.tankId}</td>
                <td>{s.qty}</td>
                <td>₹{s.unitPrice.toLocaleString('en-IN')}</td>
                <td style={{ fontWeight: 700 }}>₹{s.total.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--secondary)' }}>{s.buyer}</td>
                <td style={{ color: 'var(--muted)' }}>{s.payMode}</td>
                <td>
                  <span style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                    background: s.approved ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                    color: s.approved ? '#FFFFFF' : '#888888',
                    border: `1px solid ${s.approved ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`
                  }}>
                    {s.approved ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td style={{ color: 'var(--muted)' }}>{s.worker || 'Admin'}</td>
                <td style={{ textAlign: 'center', paddingRight: 16 }}>
                  {s.approved ? (
                    <button
                      onClick={() => onOpenInvoice(s)}
                      style={{ background: 'none', color: 'var(--secondary)' }}
                      onMouseEnter={ev => ev.currentTarget.style.color = '#fff'}
                      onMouseLeave={ev => ev.currentTarget.style.color = 'var(--secondary)'}
                    >
                      <Printer size={14} />
                    </button>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4 — Revenue Trend Chart */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 16 }}>
          7-Day Revenue Trend
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={revenueChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="revenue" name="Revenue"
              stroke="#FFFFFF" strokeWidth={2} dot={{ r: 4, fill: '#FFFFFF', stroke: '#000000', strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// ─── CUSTOMERS TAB ───────────────────────────────────────────────────────────

function CustomersTab({ customers, setCustomers }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    const newCust = {
      id: Date.now(),
      name: name.trim(),
      contact: contact.trim(),
      totalOrders: 0,
      totalValue: 0,
      lastOrder: '—',
      topSpecies: '—'
    };

    setCustomers(prev => [...prev, newCust]);
    setName('');
    setContact('');
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section 1 — Grid list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {customers.map(c => {
          const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2);
          return (
            <div key={c.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>Contact: {c.contact}</div>
                </div>
              </div>

              <div style={{ fontSize: 12, marginTop: 4 }}>
                <strong>{c.totalOrders}</strong> orders · <strong>₹{c.totalValue.toLocaleString('en-IN')}</strong> lifetime
              </div>

              <div style={{ fontSize: 11, color: 'var(--secondary)' }}>
                Fav: {c.topSpecies || '—'}
              </div>

              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 'auto' }}>
                Last order: {c.lastOrder !== '—' ? formatDate(c.lastOrder) : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2 — Add Customer Mini Form */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Add Customer Profile</div>
        <form onSubmit={handleAddCustomer} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>CUSTOMER NAME</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. PetZone Pune"
              style={{ height: 34 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>CONTACT PHONE</span>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="e.g. 9876543210"
              style={{ height: 34 }}
            />
          </div>
          <button
            type="submit"
            style={{
              height: 34, padding: '0 20px', background: '#FFFFFF', color: '#000000',
              fontWeight: 'bold', borderRadius: 8, fontSize: 12
            }}
          >
            Add Customer
          </button>
        </form>
      </div>

      {/* Section 3 — Table */}
      <div className="card" style={{ overflowX: 'auto', padding: '18px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 18px 12px 18px' }}>
          Customer Master List
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Total Orders</th>
              <th>Lifetime Value</th>
              <th>Top Species</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: 'var(--secondary)' }}>{c.contact}</td>
                <td>{c.totalOrders}</td>
                <td style={{ fontWeight: 700 }}>₹{c.totalValue.toLocaleString('en-IN')}</td>
                <td style={{ color: 'var(--secondary)' }}>{c.topSpecies || '—'}</td>
                <td style={{ color: 'var(--muted)' }}>{c.lastOrder !== '—' ? formatDate(c.lastOrder) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─── WORKERS TAB ─────────────────────────────────────────────────────────────

function WorkersTab({ workers, workerSubmissions }) {
  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Section 1 — Worker Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {workers.map(w => {
          // get worker submissions today count
          const todayStr = today();
          const wSubsToday = workerSubmissions.filter(s => s.worker === w.name && s.date === todayStr);
          
          const salesCount = wSubsToday.filter(s => s.type === 'sale').length;
          const salesTotal = wSubsToday.filter(s => s.type === 'sale').reduce((sum,s) => sum + (s.total || 0), 0);
          
          const taskCount = wSubsToday.filter(s => s.type === 'feeding' || s.type === 'maintenance' || s.type === 'water_log').length;

          const isActive = wSubsToday.length > 0;

          return (
            <div key={w.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold'
                }}>
                  {w.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{w.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{w.role}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, marginTop: 4 }}>
                <div>Sales: <strong>{salesCount}</strong> (₹{salesTotal.toLocaleString('en-IN')})</div>
                <div>Tasks Done: <strong>{taskCount}</strong> logs</div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--muted)',
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'}`
                }}>
                  {isActive ? 'Active today' : 'No activity'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2 — Submissions Feed */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 14 }}>
          Worker Logs Master Feed
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workerSubmissions.map(s => {
            const initials = s.worker.split(' ').map(w => w[0]).join('');
            return (
              <div key={s.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 12, display: 'flex', gap: 10, alignItems: 'center'
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold'
                }}>
                  {initials}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>{s.worker}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{s.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>
                    <span style={{ textTransform: 'uppercase', fontSize: 9, fontWeight: 700, marginRight: 6 }}>
                      {s.type.replace('_', ' ')}
                    </span>
                    {s.details}
                  </div>
                </div>

                <div>
                  <span style={{
                    fontSize: 9, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                    background: s.status === 'approved' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                    color: s.status === 'approved' ? '#FFFFFF' : '#888888',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    {s.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
            {workerSubmissions.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontSize: 12 }}>
                No submissions logged today.
              </div>
            )}
        </div>
      </div>

    </div>
  );
}

// ─── EQUIPMENT TAB ───────────────────────────────────────────────────────────

function EquipmentTab({ equipment, setEquipment, setExpenses }) {
  const [eqId, setEqId] = useState(equipment[0]?.id || '');
  const [cost, setCost] = useState('');
  const [repairDesc, setRepairDesc] = useState('');
  const [repairDate, setRepairDate] = useState(today());
  
  const [localPanelToast, setLocalPanelToast] = useState(null);

  // Status summaries
  const overdueCount = useMemo(() => equipment.filter(e => e.status === 'overdue').length, [equipment]);
  const soonCount = useMemo(() => equipment.filter(e => e.status === 'due-soon').length, [equipment]);
  const okCount = useMemo(() => equipment.filter(e => e.status === 'ok').length, [equipment]);

  // Service trigger
  const handleMarkServiced = (id) => {
    const todayStr = today();
    
    // nextService calculation (+90 days from today)
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 90);
    const nextStr = nextDate.toISOString().slice(0, 10);

    setEquipment(prev => prev.map(e => {
      if (e.id !== id) return e;
      return {
        ...e,
        lastService: todayStr,
        nextService: nextStr,
        status: 'ok'
      };
    }));
  };

  const handleLogRepair = (e) => {
    e.preventDefault();
    const costVal = parseInt(cost, 10);
    const eqItem = equipment.find(eq => eq.id === Number(eqId));
    if (!eqItem || !costVal || costVal <= 0 || !repairDesc.trim()) return;

    // Log to expenses
    const newExp = {
      id: Date.now(),
      category: 'Equipment Repair',
      amount: costVal,
      description: `${eqItem.name}: ${repairDesc.trim()}`,
      date: repairDate,
      tank: eqItem.tank,
      worker: 'Admin',
      status: 'approved'
    };

    setExpenses(prev => [newExp, ...prev]);

    setLocalPanelToast(`Repair logged to Finances — ₹${costVal.toLocaleString('en-IN')}`);
    setTimeout(() => setLocalPanelToast(null), 3000);

    setCost('');
    setRepairDesc('');
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Section 1 — Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>OVERDUE SERVICE</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: overdueCount > 0 ? '#666666' : '#FFFFFF', marginTop: 6 }}>
            {overdueCount}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Requires immediate check
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>DUE SOON</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: soonCount > 0 ? '#888888' : '#FFFFFF', marginTop: 6 }}>
            {soonCount}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Within 30 days
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>SYSTEM OK</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            {okCount}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Healthy operation
          </span>
        </div>
      </div>

      {/* Section 2 — Table */}
      <div className="card" style={{ overflowX: 'auto', padding: '18px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 18px 12px 18px' }}>
          Equipment Schedule
        </div>
        <table>
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Type</th>
              <th>Tank</th>
              <th>Last Serviced</th>
              <th>Next Due</th>
              <th>Purchase Cost</th>
              <th>Status</th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(e => {
              const overdue = e.status === 'overdue';
              const soon = e.status === 'due-soon';
              const statusBg = overdue ? '#1A1A1A' : soon ? '#1A1A1A' : 'transparent';
              const borderCol = overdue ? 'rgba(255,255,255,0.20)' : soon ? 'rgba(255,255,255,0.12)' : 'transparent';

              return (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{e.type}</td>
                  <td>Tank {e.tank}</td>
                  <td>{formatDate(e.lastService)}</td>
                  <td>{formatDate(e.nextService)}</td>
                  <td>₹{e.cost.toLocaleString('en-IN')}</td>
                  <td>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                      background: statusBg, color: '#FFFFFF',
                      border: `1px solid ${borderCol}`
                    }}>
                      {e.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: 16 }}>
                    {e.status !== 'ok' ? (
                      <button
                        onClick={() => handleMarkServiced(e.id)}
                        style={{
                          padding: '4px 10px', background: '#FFFFFF', color: '#000000',
                          borderRadius: 6, fontSize: 11, fontWeight: 'bold'
                        }}
                      >
                        Mark Serviced
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>All Clear</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Section 3 — Log Repair Form */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Log Repair Expense</div>
        <form onSubmit={handleLogRepair} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          <div style={{ flex: 1, minWidth: 150 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>SELECT EQUIPMENT</span>
            <select value={eqId} onChange={e => setEqId(e.target.value)} style={{ height: 34 }}>
              {equipment.map(e => <option key={e.id} value={e.id}>{e.name} (Tank {e.tank})</option>)}
            </select>
          </div>

          <div style={{ width: 100 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>COST (₹)</span>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="Cost"
              style={{ height: 34 }}
            />
          </div>

          <div style={{ flex: 2, minWidth: 150 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>REPAIR NOTES</span>
            <input
              type="text"
              value={repairDesc}
              onChange={e => setRepairDesc(e.target.value)}
              placeholder="Details of repair..."
              style={{ height: 34 }}
            />
          </div>

          <div style={{ width: 120 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>DATE</span>
            <input
              type="date"
              value={repairDate}
              onChange={e => setRepairDate(e.target.value)}
              style={{ height: 34 }}
            />
          </div>

          <button
            type="submit"
            style={{
              height: 34, padding: '0 16px', background: '#FFFFFF', color: '#000000',
              fontWeight: 'bold', borderRadius: 8, fontSize: 12
            }}
          >
            Log Repair
          </button>
        </form>

        {localPanelToast && (
          <div style={{
            marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
            color: '#FFFFFF', fontSize: 11, fontWeight: 600
          }}>
            {localPanelToast}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── WATER QUALITY TAB ───────────────────────────────────────────────────────

function WaterQualityTab({ waterLog }) {
  
  // mock 7 day chart trends per tank
  const get7DayPhData = (tankId, currentPh) => {
    return [
      { day: 'D1', ph: currentPh - 0.1 },
      { day: 'D2', ph: currentPh + 0.1 },
      { day: 'D3', ph: currentPh },
      { day: 'D4', ph: currentPh - 0.15 },
      { day: 'D5', ph: currentPh + 0.05 },
      { day: 'D6', ph: currentPh - 0.05 },
      { day: 'D7', ph: currentPh }
    ];
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Section 1 — Today's readings grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {waterLog.slice(0, 6).map(w => {
          const status = getWaterStatus(w.ph, w.temp, w.ammonia);
          const statusColor = status === 'critical' ? '#666666' : status === 'warning' ? '#888888' : '#FFFFFF';
          
          return (
            <div key={w.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Tank {w.tank}</span>
                <span style={{
                  fontSize: 9, padding: '2px 8px', borderRadius: 4, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', color: statusColor,
                  border: `1px solid ${status === 'normal' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.20)'}`
                }}>
                  {status.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, margin: '8px 0' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>pH</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: (w.ph < 6.5 || w.ph > 8.0) ? statusColor : '#FFFFFF' }}>{w.ph}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Temp</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: (w.temp < 22 || w.temp > 28) ? statusColor : '#FFFFFF' }}>{w.temp}°C</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Ammonia</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: (w.ammonia > 0.0) ? statusColor : '#FFFFFF' }}>{w.ammonia}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>
                <span>By: {w.loggedBy}</span>
                <span>{formatDate(w.date)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2 — 7-Day Trend Per Tank */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 16 }}>
          7-Day pH Trends
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {waterLog.slice(0, 6).map(w => {
            const chartData = get7DayPhData(w.tank, w.ph);
            return (
              <div key={w.tank} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 8, padding: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', display: 'block', marginBottom: 6 }}>Tank {w.tank} pH</span>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={chartData}>
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} hide={true} />
                    <Line type="monotone" dataKey="ph" stroke="#FFFFFF" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ─── WORKER APP PORTION (view = 'worker') ─────────────────────────────────────

function WorkerApp({
  workers,
  activeWorker,
  setActiveWorker,
  species,
  tankStock,
  quarantinedTanks,
  customers,
  workerSubmissions,
  setWorkerSubmissions,
  setSales,
  setWaterLog,
  onTransferStock,
  onConfirmLog,
  setView
}) {
  
  // LOG A SALE STEPS STATE
  const [saleStep, setSaleStep] = useState(1); // 1, 2, 3
  const [saleSpId, setSaleSpId] = useState('');
  const [saleTankId, setSaleTankId] = useState('');
  const [saleQty, setSaleQty] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [saleBuyer, setSaleBuyer] = useState('');
  const [salePayMode, setSalePayMode] = useState('UPI');
  const [saleNote, setSaleNote] = useState('');
  const [saleSuccessMsg, setSaleSuccessMsg] = useState(null);

  // Customer Autocomplete search
  const [showBuyerSuggests, setShowBuyerSuggests] = useState(false);
  const buyerSuggestions = useMemo(() => {
    if (!saleBuyer.trim()) return [];
    return customers.filter(c => c.name.toLowerCase().includes(saleBuyer.toLowerCase()));
  }, [saleBuyer, customers]);

  // LOG FEEDING STATE
  const [feedTank, setFeedTank] = useState('A');
  const [feedChecked, setFeedChecked] = useState({});
  const [feedSuccess, setFeedSuccess] = useState(false);

  // TANK MAINTENANCE STATE
  const [maintTank, setMaintTank] = useState('A');
  const [maintType, setMaintType] = useState('Water Change');
  const [maintNotes, setMaintNotes] = useState('');
  const [maintSuccess, setMaintSuccess] = useState(false);

  // WATER QUALITY STATE
  const [wqTank, setWqTank] = useState('A');
  const [wqPh, setWqPh] = useState('');
  const [wqTemp, setWqTemp] = useState('');
  const [wqAmmonia, setWqAmmonia] = useState('');
  const [wqWarning, setWqWarning] = useState(false);
  const [wqSuccess, setWqSuccess] = useState(false);

  // REPORT AN ISSUE STATE
  const [issueTank, setIssueTank] = useState('A');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueUrgency, setIssueUrgency] = useState('Low');
  const [issueSuccess, setIssueSuccess] = useState(false);

  // TRANSFER STOCK STATE
  const [trSpId, setTrSpId] = useState('');
  const [trFromTank, setTrFromTank] = useState('');
  const [trToTank, setTrToTank] = useState('');
  const [trCount, setTrCount] = useState('');
  const [trSuccess, setTrSuccess] = useState(false);

  // Active worker's tasks list logged today
  const activeWorkerLogs = useMemo(() => {
    return workerSubmissions.filter(s => s.worker === activeWorker?.name);
  }, [workerSubmissions, activeWorker]);

  // Selected species info for sale
  const selectedSp = useMemo(() => species.find(s => s.id === Number(saleSpId)), [species, saleSpId]);

  // Available tanks for selected sale species
  const saleTanks = useMemo(() => {
    if (!selectedSp) return [];
    return Object.entries(tankStock[selectedSp.id] || {}).map(([tankId, count]) => ({
      tankId,
      count,
      isQuarantined: quarantinedTanks[tankId] !== undefined
    }));
  }, [selectedSp, tankStock, quarantinedTanks]);

  // auto select tank if only one exists in sale step 2
  useEffect(() => {
    if (saleStep === 2 && saleTanks.length === 1) {
      if (!saleTanks[0].isQuarantined) {
        setSaleTankId(saleTanks[0].tankId);
        setSaleStep(3);
      }
    }
  }, [saleStep, saleTanks]);

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    const qtyVal = parseInt(saleQty, 10);
    const priceVal = parseInt(salePrice, 10) || selectedSp?.price || 0;
    
    if (!qtyVal || qtyVal <= 0 || !saleBuyer.trim() || !selectedSp || !saleTankId) return;

    // verify quantity limit
    const tankMax = tankStock[selectedSp.id]?.[saleTankId] ?? 0;
    if (qtyVal > tankMax) return;

    const totalVal = qtyVal * priceVal;

    const newSale = {
      id: Date.now(),
      speciesId: selectedSp.id,
      speciesName: selectedSp.name,
      qty: qtyVal,
      unitPrice: priceVal,
      total: totalVal,
      buyer: saleBuyer.trim(),
      payMode: salePayMode,
      payStatus: 'pending',
      date: today(),
      worker: activeWorker.name,
      approved: false,
      tankId: saleTankId
    };

    // Prepend to sales state (awaiting approval)
    setSales(prev => [newSale, ...prev]);

    // Prepend to worker submissions feed
    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'sale',
      details: `${qtyVal} ${selectedSp.name} from Tank ${saleTankId} (₹${totalVal})`,
      time: 'Just now',
      date: today(),
      status: 'pending',
      total: totalVal
    };
    setWorkerSubmissions(prev => [newSub, ...prev]);

    setSaleSuccessMsg(`Sale submitted ✓ — ${qtyVal} ${selectedSp.name} from Tank ${saleTankId} for ₹${totalVal}. Waiting for admin approval.`);

    // Reset Form
    setSaleStep(1);
    setSaleSpId('');
    setSaleTankId('');
    setSaleQty('');
    setSalePrice('');
    setSaleBuyer('');
    setSaleNote('');

    setTimeout(() => setSaleSuccessMsg(null), 4000);
  };

  const handleFeedingSubmit = (e) => {
    e.preventDefault();
    const feedDetails = `Tank ${feedTank} feeding done`;
    
    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'feeding',
      details: feedDetails,
      time: 'Just now',
      date: today(),
      status: 'approved'
    };

    setWorkerSubmissions(prev => [newSub, ...prev]);
    setFeedSuccess(true);
    setTimeout(() => setFeedSuccess(false), 2000);
  };

  const handleMaintSubmit = (e) => {
    e.preventDefault();
    const maintDetails = `Tank ${maintTank} maintenance (${maintType}) ${maintNotes ? '— ' + maintNotes : ''}`;

    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'maintenance',
      details: maintDetails,
      time: 'Just now',
      date: today(),
      status: 'approved'
    };

    setWorkerSubmissions(prev => [newSub, ...prev]);
    setMaintSuccess(true);
    setMaintNotes('');
    setTimeout(() => setMaintSuccess(false), 2000);
  };

  const handleWqSubmit = (e) => {
    e.preventDefault();
    const phVal = parseFloat(wqPh);
    const tempVal = parseFloat(wqTemp);
    const ammVal = parseFloat(wqAmmonia);

    if (isNaN(phVal) || isNaN(tempVal) || isNaN(ammVal)) return;

    const stat = getWaterStatus(phVal, tempVal, ammVal);

    const newLog = {
      id: Date.now(),
      tank: wqTank,
      date: today(),
      ph: phVal,
      temp: tempVal,
      ammonia: ammVal,
      loggedBy: activeWorker.name,
      status: stat
    };

    // Prepend to waterLog
    setWaterLog(prev => [newLog, ...prev]);

    // Prepend to worker submissions feed
    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'water_log',
      details: `Tank ${wqTank} readings: pH ${phVal} | Temp ${tempVal}°C | Ammonia ${ammVal}`,
      time: 'Just now',
      date: today(),
      status: 'approved'
    };

    setWorkerSubmissions(prev => [newSub, ...prev]);
    setWqSuccess(true);
    
    // Warn if abnormal
    if (stat !== 'normal') {
      setWqWarning(true);
    }

    setWqPh('');
    setWqTemp('');
    setWqAmmonia('');
    
    setTimeout(() => {
      setWqSuccess(false);
      setWqWarning(false);
    }, 4000);
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!issueDesc.trim()) return;

    const details = `Tank ${issueTank} Urgency: ${issueUrgency} — ${issueDesc.trim()}`;

    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'observation',
      details: details,
      time: 'Just now',
      date: today(),
      status: 'pending',
      urgency: issueUrgency
    };

    setWorkerSubmissions(prev => [newSub, ...prev]);
    setIssueSuccess(true);
    setIssueDesc('');
    
    setTimeout(() => setIssueSuccess(false), 2000);
  };

  // Transfer Fish Between Tanks
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const qtyVal = parseInt(trCount, 10);
    if (!trSpId || !trFromTank || !trToTank || !qtyVal || qtyVal <= 0) return;

    // verify quantity limit
    const tankMax = tankStock[trSpId]?.[trFromTank] ?? 0;
    if (qtyVal > tankMax) return;

    // Trigger state transfer
    onTransferStock(Number(trSpId), trFromTank, trToTank, qtyVal);

    // Prepend to submissions feed
    const newSub = {
      id: Date.now(),
      worker: activeWorker.name,
      type: 'transfer',
      details: `Transferred ${qtyVal} species ${trSpId} from Tank ${trFromTank} to Tank ${trToTank}`,
      time: 'Just now',
      date: today(),
      status: 'approved'
    };

    setWorkerSubmissions(prev => [newSub, ...prev]);
    setTrSuccess(true);
    
    setTrSpId('');
    setTrFromTank('');
    setTrToTank('');
    setTrCount('');

    setTimeout(() => setTrSuccess(false), 2000);
  };

  // ─── 1. SELECT WORKER SCREEN ───
  if (!activeWorker) {
    return (
      <div style={{
        maxWidth: 480, margin: '40px auto', padding: 16, display: 'flex',
        flexDirection: 'column', gap: 24, alignItems: 'center'
      }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setView('admin')}
            style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff' }}
          >
            ← Back to Admin
          </button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
          Who are you?
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12, width: '100%'
        }}>
          {workers.map(w => (
            <div
              key={w.id}
              onClick={() => setActiveWorker(w)}
              className="card"
              style={{
                padding: 20, display: 'flex', flexDirection: 'column',
                alignItems: 'center', cursor: 'pointer', textAlign: 'center',
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={ev => ev.currentTarget.style.borderColor = '#FFFFFF'}
              onMouseLeave={ev => ev.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold', marginBottom: 12
              }}>
                {w.avatar}
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{w.role}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── 2. WORKER DASHBOARD VIEW ───
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>👋 Hi {activeWorker.name}</h2>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{formatDate(today())}</span>
        </div>
        <button
          onClick={() => setActiveWorker(null)}
          style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 6, fontSize: 11, color: 'var(--secondary)' }}
        >
          Switch Worker
        </button>
      </div>

      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
        <button
          onClick={() => setView('admin')}
          style={{ padding: '6px 12px', background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6, fontSize: 11 }}
        >
          ← Back to Admin view
        </button>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', textAlign: 'center' }}>
        What do you want to log?
      </h3>

      {/* Grid of log entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* Card 1 — Log a Sale */}
        <div className="card" style={{ padding: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid #FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Log a Sale</span>
            <span>📦</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Step 1: Pick Species */}
            <div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>STEP 1: SELECT SPECIES</span>
              <select
                value={saleSpId}
                onChange={e => {
                  setSaleSpId(e.target.value);
                  setSaleTankId('');
                  setSaleStep(2);
                }}
              >
                <option value="">Select Species</option>
                {species.map(s => {
                  const isAvailable = s.stock > 0;
                  return (
                    <option key={s.id} value={s.id} disabled={!isAvailable}>
                      {s.name} ({s.stock} available)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Step 2: Pick Tank (reveals after species selected) */}
            {saleStep >= 2 && selectedSp && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>STEP 2: SELECT TANK TO SELL FROM</span>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {saleTanks.map(t => {
                    const isSelected = saleTankId === t.tankId;
                    const maxStockSpecies = Math.max(...saleTanks.map(tk => tk.count));
                    const isRecommended = t.count === maxStockSpecies;

                    return (
                      <button
                        key={t.tankId}
                        disabled={t.isQuarantined}
                        onClick={() => {
                          setSaleTankId(t.tankId);
                          setSaleStep(3);
                        }}
                        style={{
                          flex: 1, minWidth: 100, padding: '8px', borderRadius: 8, textAlign: 'center',
                          background: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.04)',
                          color: isSelected ? '#000000' : t.isQuarantined ? 'var(--muted)' : '#FFFFFF',
                          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: 12 }}>
                          Tank {t.tankId} {t.isQuarantined && '🔒'}
                        </div>
                        <div style={{ fontSize: 10, marginTop: 2 }}>{t.count} fish</div>
                        {isRecommended && !isSelected && (
                          <div style={{ fontSize: 8, color: 'var(--secondary)', marginTop: 4 }}>Recommended</div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {saleTankId && (
                  <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 8 }}>
                    Tank {saleTankId} selected. You can sell up to {(tankStock[selectedSp.id]?.[saleTankId] ?? 0)} fish.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Sale details */}
            {saleStep === 3 && selectedSp && saleTankId && (
              <form onSubmit={handleSaleSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>STEP 3: SALE DETAILS</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <input
                      type="number"
                      required
                      min={1}
                      max={tankStock[selectedSp.id]?.[saleTankId] ?? 0}
                      placeholder={`Qty (max ${tankStock[selectedSp.id]?.[saleTankId] ?? 0})`}
                      value={saleQty}
                      onChange={e => setSaleQty(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder={`Price (₹${selectedSp.price})`}
                      value={salePrice}
                      onChange={e => setSalePrice(e.target.value)}
                    />
                  </div>
                </div>

                {/* Autocomplete buyer */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Buyer Name"
                    value={saleBuyer}
                    onChange={e => {
                      setSaleBuyer(e.target.value);
                      setShowBuyerSuggests(true);
                    }}
                    onFocus={() => setShowBuyerSuggests(true)}
                  />
                  {showBuyerSuggests && buyerSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: '#141414', border: '1px solid var(--border)',
                      borderRadius: 8, zIndex: 10, maxHeight: 120, overflowY: 'auto'
                    }}>
                      {buyerSuggestions.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSaleBuyer(s.name);
                            setShowBuyerSuggests(false);
                          }}
                          style={{ padding: '8px 12px', color: '#fff', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                        >
                          {s.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* UPI / Cash toggles */}
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  {['UPI', 'Cash', 'Bank Transfer'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSalePayMode(m)}
                      style={{
                        flex: 1, padding: '6px', fontSize: 11,
                        background: salePayMode === m ? '#FFFFFF' : 'transparent',
                        color: salePayMode === m ? '#000000' : 'var(--secondary)'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff', margin: '4px 0' }}>
                  Total: ₹{((parseInt(saleQty, 10) || 0) * (parseInt(salePrice, 10) || selectedSp.price)).toLocaleString('en-IN')}
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: 12, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 8 }}
                >
                  Submit Sale
                </button>
              </form>
            )}

            {saleSuccessMsg && (
              <div style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: 10, color: '#fff', fontSize: 12, textAlign: 'center'
              }}>
                {saleSuccessMsg}
              </div>
            )}
          </div>
        </div>

        {/* Card 2 — Log Feeding Done */}
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 12 }}>Log Feeding Done</span>
          <form onSubmit={handleFeedingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select value={feedTank} onChange={e => setFeedTank(e.target.value)}>
              {TANKS_DATA.map(t => <option key={t.id} value={t.id}>Tank {t.id} ({t.type})</option>)}
            </select>

            <button
              type="submit"
              style={{ padding: 10, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
            >
              Log Feeding
            </button>
            {feedSuccess && <div style={{ fontSize: 12, color: 'var(--secondary)', textAlign: 'center' }}>Feeding logged ✓</div>}
          </form>
        </div>

        {/* Card 3 — Log Tank Maintenance */}
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 12 }}>Log Tank Maintenance</span>
          <form onSubmit={handleMaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select value={maintTank} onChange={e => setMaintTank(e.target.value)}>
              {TANKS_DATA.map(t => <option key={t.id} value={t.id}>Tank {t.id}</option>)}
            </select>
            
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              {['Water Change', 'Filter Clean', 'Glass Wipe'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMaintType(type)}
                  style={{
                    flex: 1, padding: '6px', fontSize: 10,
                    background: maintType === type ? '#FFFFFF' : 'transparent',
                    color: maintType === type ? '#000000' : 'var(--secondary)'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Maintenance Notes (optional)"
              value={maintNotes}
              onChange={e => setMaintNotes(e.target.value)}
            />

            <button
              type="submit"
              style={{ padding: 10, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
            >
              Log Maintenance
            </button>
            {maintSuccess && <div style={{ fontSize: 12, color: 'var(--secondary)', textAlign: 'center' }}>Maintenance logged ✓</div>}
          </form>
        </div>

        {/* Card 4 — Log Water Quality */}
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 12 }}>Log Water Quality</span>
          <form onSubmit={handleWqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select value={wqTank} onChange={e => setWqTank(e.target.value)}>
              {TANKS_DATA.map(t => <option key={t.id} value={t.id}>Tank {t.id}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              <input
                type="text"
                required
                placeholder="pH"
                value={wqPh}
                onChange={e => setWqPh(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Temp (°C)"
                value={wqTemp}
                onChange={e => setWqTemp(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Ammonia"
                value={wqAmmonia}
                onChange={e => setWqAmmonia(e.target.value)}
              />
            </div>

            <button
              type="submit"
              style={{ padding: 10, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
            >
              Submit Reading
            </button>

            {wqWarning && (
              <div style={{ color: '#FF4757', fontSize: 11, textAlign: 'center', fontWeight: 'bold' }}>
                ⚠ Reading outside safe range — admin will be alerted.
              </div>
            )}
            {wqSuccess && !wqWarning && (
              <div style={{ fontSize: 12, color: 'var(--secondary)', textAlign: 'center' }}>
                Water reading logged ✓
              </div>
            )}
          </form>
        </div>

        {/* Card 5 — Report an Issue */}
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 12 }}>Report an Issue</span>
          <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <select value={issueTank} onChange={e => setIssueTank(e.target.value)}>
              {TANKS_DATA.map(t => <option key={t.id} value={t.id}>Tank {t.id}</option>)}
            </select>

            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              {['Low', 'Medium', 'High'].map(urg => (
                <button
                  key={urg}
                  type="button"
                  onClick={() => setIssueUrgency(urg)}
                  style={{
                    flex: 1, padding: '6px', fontSize: 11,
                    background: issueUrgency === urg ? '#FFFFFF' : 'transparent',
                    color: issueUrgency === urg ? '#000000' : 'var(--secondary)'
                  }}
                >
                  {urg} Urgency
                </button>
              ))}
            </div>

            <textarea
              required
              placeholder="Describe observation/issue details..."
              value={issueDesc}
              onChange={e => setIssueDesc(e.target.value)}
              style={{
                fontFamily: 'inherit', background: '#060C18', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: 8, color: '#fff', height: 60, outline: 'none'
              }}
            />

            <button
              type="submit"
              style={{ padding: 10, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
            >
              Report Issue
            </button>
            {issueSuccess && <div style={{ fontSize: 12, color: 'var(--secondary)', textAlign: 'center' }}>Issue submitted ✓</div>}
          </form>
        </div>

        {/* Card 6 — Move Fish (Transfer) */}
        <div className="card" style={{ padding: 18 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', display: 'block', marginBottom: 12 }}>Move Fish (⇄)</span>
          <form onSubmit={handleTransferSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>SELECT SPECIES</span>
            <select value={trSpId} onChange={e => {
              setTrSpId(e.target.value);
              setTrFromTank('');
              setTrToTank('');
            }}>
              <option value="">Select Species</option>
              {species.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.stock} total)</option>
              ))}
            </select>

            {trSpId && (
              <>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>FROM TANK</span>
                <select value={trFromTank} onChange={e => setTrFromTank(e.target.value)}>
                  <option value="">Select Source</option>
                  {Object.entries(tankStock[trSpId] || {}).map(([tkId, cnt]) => (
                    <option key={tkId} value={tkId}>Tank {tkId} ({cnt} fish)</option>
                  ))}
                </select>
              </>
            )}

            {trFromTank && (
              <>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>TO TANK</span>
                <select value={trToTank} onChange={e => setTrToTank(e.target.value)}>
                  <option value="">Select Target</option>
                  {TANKS_DATA.filter(t => t.id !== trFromTank).map(t => (
                    <option key={t.id} value={t.id}>Tank {t.id}</option>
                  ))}
                </select>

                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)', display: 'block' }}>QUANTITY</span>
                <input
                  type="number"
                  required
                  min={1}
                  max={tankStock[trSpId]?.[trFromTank] ?? 0}
                  placeholder={`Qty (max ${tankStock[trSpId]?.[trFromTank] ?? 0})`}
                  value={trCount}
                  onChange={e => setTrCount(e.target.value)}
                />
              </>
            )}

            <button
              type="submit"
              style={{ padding: 10, background: '#FFFFFF', color: '#000000', fontWeight: 'bold', borderRadius: 6 }}
            >
              Transfer Fish
            </button>
            {trSuccess && <div style={{ fontSize: 12, color: 'var(--secondary)', textAlign: 'center' }}>Transfer complete ✓</div>}
          </form>
        </div>

      </div>

      {/* Activity Logs summary feed */}
      <div className="card" style={{ padding: 18, marginTop: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'block', marginBottom: 12 }}>
          Your activity today
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeWorkerLogs.map(log => (
            <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6 }}>
              <div>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                  {log.type.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 12, color: '#fff' }}>{log.details}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{log.status}</span>
            </div>
          ))}
          {activeWorkerLogs.length === 0 && (
            <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>No submissions yet.</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  // states
  const [speciesState, setSpeciesState] = useState(SPECIES_INIT);
  const [tankStock,    setTankStock]    = useState(TANK_STOCK_INIT);
  
  const [activity,   setActivity] = useState(ACTIVITY_INIT);
  const [activeTab,  setActiveTab]= useState('dashboard');
  const [search,     setSearch]   = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [kpiFlash,   setKpiFlash] = useState(false);

  // v3.0 New states
  const [expenses, setExpenses] = useState(EXPENSES_INIT);
  const [sales, setSales] = useState(SALES_INIT);
  const [customers, setCustomers] = useState(CUSTOMERS_INIT);
  const [equipment, setEquipment] = useState(EQUIPMENT_INIT);
  const [waterLog, setWaterLog] = useState(WATER_LOG_INIT);
  const [workers] = useState(WORKERS_INIT);
  
  const [activeWorker, setActiveWorker] = useState(null);
  const [workerSubmissions, setWorkerSubmissions] = useState([]);
  
  const [view, setView] = useState('admin'); // 'admin' | 'worker'

  const [activeInvoice, setActiveInvoice] = useState(null);

  // Quarantine State
  const [quarantinedTanks, setQuarantinedTanks] = useState({
    C: { reason: 'pH imbalance — monitoring', since: '2026-07-26' }
  });

  // Dynamic calculations for totalStock per species
  const getSpeciesTotal = useCallback((speciesId) => {
    return Object.values(tankStock[speciesId] || {}).reduce((a, b) => a + b, 0);
  }, [tankStock]);

  const species = useMemo(() => {
    return speciesState.map(s => ({
      ...s,
      stock: getSpeciesTotal(s.id)
    }));
  }, [speciesState, getSpeciesTotal]);

  // Derived financial values
  const totalRevenue = useMemo(() => {
    return sales.filter(s => s.approved && s.payStatus === 'paid').reduce((a,s) => a + s.total, 0);
  }, [sales]);

  const pendingRevenue = useMemo(() => {
    return sales.filter(s => s.payStatus === 'pending' || !s.approved).reduce((a,s) => a + s.total, 0);
  }, [sales]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((a,e) => a + e.amount, 0);
  }, [expenses]);

  const netProfit = totalRevenue - totalExpenses;
  const pendingSales = useMemo(() => sales.filter(s => !s.approved), [sales]);

  // Overdue count
  const overdueCount = useMemo(() => equipment.filter(e => e.status === 'overdue').length, [equipment]);

  // Water warning tanks
  const waterWarnings = useMemo(() => {
    return waterLog
      .filter(w => w.status === 'warning' || w.status === 'critical')
      .map(w => w.tank);
  }, [waterLog]);

  // High Urgency worker issues list
  const highUrgentIssues = useMemo(() => {
    return workerSubmissions.filter(s => s.urgency === 'High');
  }, [workerSubmissions]);

  // Date formatted: "27 Jul 2026"
  const formattedDate = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date('2026-07-28');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  // Deduct stock helper
  const deductTankStock = useCallback((speciesId, tankId, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [tankId]: Math.max(0, (prev[speciesId]?.[tankId] ?? 0) - qty),
      }
    }));
  }, []);

  // Transfer stock helper
  const transferTankStock = useCallback((speciesId, fromTank, toTank, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [fromTank]: Math.max(0, (prev[speciesId]?.[fromTank] ?? 0) - qty),
        [toTank]: (prev[speciesId]?.[toTank] ?? 0) + qty,
      }
    }));
  }, []);

  // Log new transaction updates
  const handleConfirmLog = useCallback(({ type, species: sp, tankId, count, note }) => {
    
    // Update tank stock
    setTankStock(prev => {
      const currentVal = prev[sp.id]?.[tankId] ?? 0;
      let newVal = currentVal;
      if (type === 'birth') {
        newVal = currentVal + count;
      } else if (type === 'export' || type === 'death') {
        newVal = Math.max(0, currentVal - count);
      }
      return {
        ...prev,
        [sp.id]: {
          ...prev[sp.id],
          [tankId]: newVal
        }
      };
    });

    // Update species metadata counts
    setSpeciesState(prev => prev.map(s => {
      if (s.id !== sp.id) return s;
      if (type === 'birth') {
        return { ...s, born: s.born + count };
      } else if (type === 'export') {
        return { ...s, exported: s.exported + count };
      } else {
        return { ...s, died: s.died + count };
      }
    }));

    // Prepend to activity feed
    setActivity(prev => [{
      id: Date.now(),
      type,
      species: sp.name,
      count,
      tank: tankId,
      time: 'Just now',
      note: note || '—',
    }, ...prev]);

    // Flash KPI
    setKpiFlash(f => !f);
  }, []);

  // Admin Logs (Quarantine/Lift)
  const handleAdminStatusLog = useCallback(({ type, tankId, note }) => {
    setActivity(prev => [{
      id: Date.now(),
      type: type === 'quarantine' ? 'quarantine' : 'quarantine_lift',
      species: '',
      count: 0,
      tank: tankId,
      time: 'Just now',
      note: note || '—',
    }, ...prev]);
  }, []);

  // Add species directly to tankStock
  const handleAddSpeciesToTank = useCallback((spId, tId, count) => {
    setTankStock(prev => ({
      ...prev,
      [spId]: {
        ...prev[spId],
        [tId]: (prev[spId]?.[tId] ?? 0) + count
      }
    }));

    const spName = speciesState.find(s => s.id === spId)?.name || '';

    // Prepend to activity feed
    setActivity(prev => [{
      id: Date.now(),
      type: 'birth',
      species: spName,
      count,
      tank: tId,
      time: 'Just now',
      note: 'Mapped to tank stock',
    }, ...prev]);
  }, [speciesState]);

  // Transfer stock action triggered by Admin UI
  const handleTransferStockAction = useCallback((spId, fromT, toT, count) => {
    transferTankStock(spId, fromT, toT, count);

    const spName = speciesState.find(s => s.id === spId)?.name || '';

    setActivity(prev => [{
      id: Date.now(),
      type: 'transfer',
      species: spName,
      count,
      from: fromT,
      to: toT,
      time: 'Just now',
      note: `Stock reallocation`,
    }, ...prev]);
  }, [transferTankStock, speciesState]);

  // Scroll alerts helper
  const alertRef = useRef(null);

  const handleViewAllLowStock = () => {
    setActiveTab('inventory');
    setFilterLowStock(true);
  };

  const handleBellClick = () => {
    if (activeTab === 'dashboard') {
      alertRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('inventory');
      setFilterLowStock(true);
    }
  };

  // derived warning badge counters in sidebar
  const lowStockPairsCount = useMemo(() => {
    let count = 0;
    species.forEach(sp => {
      Object.entries(tankStock[sp.id] || {}).forEach(([tankId, stockVal]) => {
        if (stockVal <= sp.min) {
          count++;
        }
      });
    });
    return count;
  }, [species, tankStock]);

  const tanksBadge = Object.keys(quarantinedTanks).length + lowStockPairsCount;
  
  // Total pending alerts count for topbar bell badge
  const pendingNotificationCount = pendingSales.length + overdueCount + waterWarnings.length + highUrgentIssues.length;

  return (
    <div className="app-grid">
      
      {/* Render Tax Invoice overlay if selected */}
      {activeInvoice && (
        <TaxInvoiceOverlay sale={activeInvoice} onClose={() => setActiveInvoice(null)} />
      )}

      {/* ─── SIDEBAR (Hidden in Worker View unless layout adapts) ─── */}
      {view === 'admin' && (
        <aside className="sidebar-wrapper" style={{
          background: '#0D0D0D',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '20px 14px'
        }}>
          {/* Logo block */}
          <div className="sidebar-top-section" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: 20 }}>🐠</span>
            </div>
            <div>
              <div className="sidebar-logo-text" style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.4px', lineHeight: 1.2 }}>
                AquaVault
              </div>
              <div className="sidebar-sub-text" style={{ fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2, lineHeight: 1.1 }}>
                Fish Inventory System
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="sidebar-nav-list" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 24, maxHeight: '420px', overflowY: 'auto' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              data-label="Dashboard"
              className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'dashboard' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'dashboard' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'dashboard' ? '0 8px 8px 0' : '8px'
              }}
            >
              <LayoutDashboard size={18} />
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              data-label="Inventory"
              className={`sidebar-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'inventory' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'inventory' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'inventory' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'inventory' ? '0 8px 8px 0' : '8px'
              }}
            >
              <Database size={18} />
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('tanks')}
              data-label="Tanks"
              className={`sidebar-nav-item ${activeTab === 'tanks' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'tanks' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'tanks' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'tanks' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'tanks' ? '0 8px 8px 0' : '8px'
              }}
            >
              <Waves size={18} />
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500, flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Tanks</span>
                {tanksBadge > 0 && (
                  <span style={{ fontSize: 10, padding: '1px 6px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 8, color: '#FFFFFF' }}>
                    {tanksBadge}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              data-label="Reports"
              className={`sidebar-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'reports' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'reports' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'reports' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'reports' ? '0 8px 8px 0' : '8px'
              }}
            >
              <BarChart3 size={18} />
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('finances')}
              data-label="Finances"
              className={`sidebar-nav-item ${activeTab === 'finances' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'finances' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'finances' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'finances' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'finances' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>💰</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Finances</span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              data-label="Sales & Orders"
              className={`sidebar-nav-item ${activeTab === 'sales' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'sales' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'sales' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'sales' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'sales' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>🧾</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500, flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Sales & Orders</span>
                {pendingSales.length > 0 && (
                  <span style={{ fontSize: 10, padding: '1px 6px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 8, color: '#FFFFFF' }}>
                    {pendingSales.length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              data-label="Customers"
              className={`sidebar-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'customers' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'customers' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'customers' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'customers' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>👥</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Customers</span>
            </button>

            <button
              onClick={() => setActiveTab('workers')}
              data-label="Workers"
              className={`sidebar-nav-item ${activeTab === 'workers' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'workers' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'workers' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'workers' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'workers' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>👷</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500 }}>Workers</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              data-label="Equipment"
              className={`sidebar-nav-item ${activeTab === 'equipment' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'equipment' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'equipment' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'equipment' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'equipment' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>🔧</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500, flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Equipment</span>
                {overdueCount > 0 && (
                  <span style={{ fontSize: 10, padding: '1px 6px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 8, color: '#FFFFFF' }}>
                    {overdueCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              data-label="Water Quality"
              className={`sidebar-nav-item ${activeTab === 'water' ? 'active' : ''}`}
              style={{
                width: '100%', padding: '8px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                background: activeTab === 'water' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeTab === 'water' ? '#FFFFFF' : 'var(--secondary)',
                borderLeft: activeTab === 'water' ? '3px solid #FFFFFF' : '3px solid transparent',
                borderRadius: activeTab === 'water' ? '0 8px 8px 0' : '8px'
              }}
            >
              <span style={{ fontSize: 16, marginRight: -2 }}>💧</span>
              <span className="label-text" style={{ fontSize: 13, fontWeight: 500, flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <span>Water Quality</span>
                {waterWarnings.length > 0 && (
                  <span style={{ fontSize: 10, padding: '1px 6px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.20)', borderRadius: 8, color: '#FFFFFF' }}>
                    {waterWarnings.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Toggle View button */}
          <button
            onClick={() => setView('worker')}
            style={{
              marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', background: 'rgba(255,255,255,0.06)',
              borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, border: '1px solid var(--border)'
            }}
          >
            <span>⬡ Switch to Worker view</span>
          </button>

          {/* Bottom Snapshot */}
          <div className="sidebar-bottom-snap" style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0 0 0',
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <span style={{ fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
              TODAY
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--secondary)', display: 'flex', alignItems:'center', gap: 4 }}>
                  🐣 Born
                </span>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }} className="tabular-nums">
                  <AnimatedNumber value={totalBorn} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--secondary)', display: 'flex', alignItems:'center', gap: 4 }}>
                  📦 Exported
                </span>
                <span style={{ color: '#AAAAAA', fontWeight: 700 }} className="tabular-nums">
                  <AnimatedNumber value={totalExported} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--secondary)', display: 'flex', alignItems:'center', gap: 4 }}>
                  💀 Died
                </span>
                <span style={{ color: '#666666', fontWeight: 700 }} className="tabular-nums">
                  <AnimatedNumber value={totalDied} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--secondary)', display: 'flex', alignItems:'center', gap: 4 }}>
                  💰 Revenue
                </span>
                <span style={{ color: '#FFFFFF', fontWeight: 700 }} className="tabular-nums">
                  ₹<AnimatedNumber value={totalRevenue} />
                </span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ─── MAIN CONTENT AREA (Adapts to Worker view too) ─── */}
      {view === 'admin' ? (
        <div className="main-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
          {/* Top Bar */}
          <header style={{
            height: 56,
            background: '#000000',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <h1 style={{ fontWeight: 700, fontSize: 18, color: '#fff', textTransform: 'capitalize' }}>
              {activeTab === 'water' ? 'Water Quality' : activeTab === 'sales' ? 'Sales & Orders' : activeTab}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Global Search */}
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={14} color="#555555" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search species..."
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    padding: '7px 12px 7px 34px',
                    color: 'var(--text)',
                    fontSize: 13
                  }}
                />
              </div>

              {/* Alert Bell */}
              <button
                onClick={handleBellClick}
                style={{
                  position: 'relative',
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.color='#fff'}
                onMouseLeave={e => e.currentTarget.style.color='var(--secondary)'}
              >
                <Bell size={16} />
                {pendingNotificationCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#FFFFFF', border: '1.5px solid #000000'
                  }} />
                )}
              </button>

              {/* Date Chip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, padding: '6px 12px', fontSize: 11, color: 'var(--muted)'
              }}>
                <Calendar size={11} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </header>

          {/* Scrollable Content Body */}
          <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            {activeTab === 'dashboard' && (
              <DashboardTab
                key="dashboard"
                species={species}
                activity={activity}
                alertRef={alertRef}
                onViewAllLowStock={handleViewAllLowStock}
                onConfirmLog={handleConfirmLog}
                kpiFlash={kpiFlash}
                tankStock={tankStock}
                totalRevenue={totalRevenue}
                pendingRevenue={pendingRevenue}
                totalExpenses={totalExpenses}
                netProfit={netProfit}
                pendingSales={pendingSales}
                overdueCount={overdueCount}
                waterWarnings={waterWarnings}
                onNavigateTab={setActiveTab}
                highUrgentIssues={highUrgentIssues}
              />
            )}
            {activeTab === 'inventory' && (
              <InventoryTab
                key="inventory"
                species={species}
                search={search}
                onConfirmLog={handleConfirmLog}
                filterLowStock={filterLowStock}
                onClearFilter={() => setFilterLowStock(false)}
                tankStock={tankStock}
              />
            )}
            {activeTab === 'tanks' && (
              <TanksTab
                key="tanks"
                species={species}
                tankStock={tankStock}
                quarantinedTanks={quarantinedTanks}
                setQuarantinedTanks={setQuarantinedTanks}
                onConfirmLog={handleAdminStatusLog}
                onTransferStock={handleTransferStockAction}
                onAddSpeciesToTank={handleAddSpeciesToTank}
              />
            )}
            {activeTab === 'reports' && (
              <ReportsTab key="reports" species={species} />
            )}
            {activeTab === 'finances' && (
              <FinancesTab
                key="finances"
                expenses={expenses}
                setExpenses={setExpenses}
                sales={sales}
              />
            )}
            {activeTab === 'sales' && (
              <SalesTab
                key="sales"
                sales={sales}
                setSales={setSales}
                species={species}
                customers={customers}
                setCustomers={setCustomers}
                onDeductStock={deductTankStock}
                onOpenInvoice={setActiveInvoice}
              />
            )}
            {activeTab === 'customers' && (
              <CustomersTab
                key="customers"
                customers={customers}
                setCustomers={setCustomers}
              />
            )}
            {activeTab === 'workers' && (
              <WorkersTab
                key="workers"
                workers={workers}
                workerSubmissions={workerSubmissions}
              />
            )}
            {activeTab === 'equipment' && (
              <EquipmentTab
                key="equipment"
                equipment={equipment}
                setEquipment={setEquipment}
                setExpenses={setExpenses}
              />
            )}
            {activeTab === 'water' && (
              <WaterQualityTab
                key="water"
                waterLog={waterLog}
              />
            )}
          </main>
        </div>
      ) : (
        /* WORKER VIEW dashboard replacement */
        <div style={{ flex: 1, background: '#000000', minHeight: '100vh', overflowY: 'auto' }}>
          <WorkerApp
            workers={workers}
            activeWorker={activeWorker}
            setActiveWorker={setActiveWorker}
            species={species}
            tankStock={tankStock}
            quarantinedTanks={quarantinedTanks}
            customers={customers}
            workerSubmissions={workerSubmissions}
            setWorkerSubmissions={setWorkerSubmissions}
            setSales={setSales}
            setWaterLog={setWaterLog}
            onTransferStock={handleTransferStockAction}
            onConfirmLog={handleConfirmLog}
            setView={setView}
          />
        </div>
      )}

    </div>
  );
}
