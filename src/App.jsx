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
import ErrorBoundary from './ErrorBoundary';

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
  1: { // Guppy (Fancy)
    adult:       { A: 80,  B: 40 },
    'semi-adult':{ A: 70,  C: 50 },
    newborn:     { C: 60,  D: 40 },
  },
  2: { // Arowana (Silver)
    adult:       { B: 12 },
  },
  3: { // Discus (Blue)
    adult:       { C: 22 },
    'semi-adult':{ D: 13 },
  },
  4: { // Neon Tetra
    adult:       { A: 100 },
    'semi-adult':{ A: 80  },
  },
  5: { // Betta (Red)
    adult:       { D: 28 },
  },
  6: { // Koi (Kohaku)
    adult:       { E: 10 },
    'semi-adult':{ E: 8  },
  },
  7: { // Oscar
    adult:       { B: 9  },
  },
  8: { // Angel Fish
    adult:       { C: 25 },
    'semi-adult':{ C: 17 },
  },
  9: { // Goldfish (Fancy)
    adult:       { A: 40 },
    newborn:     { A: 25 },
  },
  10: { // Clownfish
    adult:       { F: 22 },
  },
};

const TANKS_INIT = [
  { id:'A', displayName:'Tank A', capacity:600, temp:'26°C', ph:'7.2', type:'Freshwater', addedDate:'2024-01-10' },
  { id:'B', displayName:'Tank B', capacity:120, temp:'27°C', ph:'6.8', type:'Freshwater', addedDate:'2024-01-10' },
  { id:'C', displayName:'Tank C', capacity:200, temp:'28°C', ph:'6.5', type:'Freshwater', addedDate:'2024-02-15' },
  { id:'D', displayName:'Tank D', capacity:60,  temp:'26°C', ph:'7.0', type:'Freshwater', addedDate:'2024-03-20' },
  { id:'E', displayName:'Tank E', capacity:300, temp:'22°C', ph:'7.4', type:'Freshwater', addedDate:'2024-05-01' },
  { id:'F', displayName:'Tank F', capacity:100, temp:'25°C', ph:'8.2', type:'Marine',     addedDate:'2025-01-08' },
];

const AGE_GROUPS = ['adult', 'semi-adult', 'newborn'];

const AGE_GROUP_LABELS = {
  adult:       { label: 'Adult',      short: 'ADT', priceMultiplier: 1.0   },
  'semi-adult':{ label: 'Semi-Adult', short: 'S-A', priceMultiplier: 0.70  },
  newborn:     { label: 'Newborn',    short: 'NBN', priceMultiplier: 0.40  },
};

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
  { id:1, speciesId:1, speciesName:'Guppy (Fancy)', qty:30, unitPrice:80,   total:2400,  buyer:'PetZone Pune',         payMode:'UPI',  payStatus:'paid',    date:'2026-07-25', worker:'Amol Shinde',   approved:true,  tankId: 'A', ageGroup: 'adult' },
  { id:2, speciesId:2, speciesName:'Arowana (Silver)', qty:2,  unitPrice:3500, total:7000,  buyer:'AquaWorld Mumbai',     payMode:'Cash', payStatus:'paid',    date:'2026-07-24', worker:'Rajan Patil',   approved:true,  tankId: 'B', ageGroup: 'adult' },
  { id:3, speciesId:4, speciesName:'Neon Tetra',       qty:50, unitPrice:60,   total:3000,  buyer:'FishMart Nashik',      payMode:'UPI',  payStatus:'pending', date:'2026-07-23', worker:'Amol Shinde',   approved:true,  tankId: 'A', ageGroup: 'semi-adult' },
  { id:4, speciesId:6, speciesName:'Koi (Kohaku)',     qty:3,  unitPrice:2000, total:6000,  buyer:'Royal Aquatics',       payMode:'Cash', payStatus:'paid',    date:'2026-07-22', worker:'Rajan Patil',   approved:true,  tankId: 'E', ageGroup: 'adult' },
  { id:5, speciesId:8, speciesName:'Angel Fish',       qty:10, unitPrice:180,  total:1800,  buyer:'PetZone Pune',         payMode:'UPI',  payStatus:'paid',    date:'2026-07-21', worker:'Amol Shinde',   approved:false, tankId: 'C', ageGroup: 'adult' },
  { id:6, speciesId:5, speciesName:'Betta (Red)',      qty:5,  unitPrice:250,  total:1250,  buyer:'HomeAqua Kolhapur',    payMode:'Cash', payStatus:'paid',    date:'2026-07-20', worker:'Suresh Kamble', approved:true,  tankId: 'D', ageGroup: 'adult' },
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
  highUrgentIssues,
  tanks,
  getTankTotal,
  getContentsOfTank
}) {
  const totalFish     = useMemo(() => species.reduce((s,sp)=>s+sp.stock, 0), [species]);
  const totalBorn     = useMemo(() => species.reduce((s,sp)=>s+sp.born, 0), [species]);
  const totalExported = useMemo(() => species.reduce((s,sp)=>s+sp.exported, 0), [species]);
  const totalDied     = useMemo(() => species.reduce((s,sp)=>s+sp.died, 0), [species]);
  const lowStock      = useMemo(() => species.filter(sp=>sp.stock<=sp.min*1.5), [species]);

  // Quick Log State
  const [quickType, setQuickType] = useState('birth');
  const [quickSpeciesId, setQuickSpeciesId] = useState(species[0]?.id || 1);
  const [quickAgeGroup, setQuickAgeGroup] = useState('newborn');
  const [quickTankId, setQuickTankId] = useState('');
  const [quickCount, setQuickCount] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickShake, setQuickShake] = useState(false);
  const [confirmFlash, setConfirmFlash] = useState(false);
  const [localToast, setLocalToast] = useState(null);
  
  const quickCountRef = useRef(null);

  // Available age groups
  const quickAgeGroupsAvailable = useMemo(() => {
    if (quickType === 'birth') return ['newborn', 'semi-adult', 'adult'];
    return ['adult', 'semi-adult', 'newborn'].filter(ag => {
      const groupStockObj = tankStock[quickSpeciesId]?.[ag] || {};
      return Object.values(groupStockObj).reduce((a, b) => a + b, 0) > 0;
    });
  }, [quickType, quickSpeciesId, tankStock]);

  // When quickType or quickSpeciesId changes, set default ageGroup
  useEffect(() => {
    if (quickType === 'birth') {
      setQuickAgeGroup('newborn');
    } else if (quickAgeGroupsAvailable.length > 0) {
      if (!quickAgeGroupsAvailable.includes(quickAgeGroup)) {
        setQuickAgeGroup(quickAgeGroupsAvailable[0]);
      }
    } else {
      setQuickAgeGroup('adult');
    }
  }, [quickType, quickSpeciesId, quickAgeGroupsAvailable]);

  // Available tanks
  const quickTanksAvailable = useMemo(() => {
    if (quickType === 'birth') {
      return tanks;
    }
    const groupStockObj = tankStock[quickSpeciesId]?.[quickAgeGroup] || {};
    return Object.entries(groupStockObj)
      .filter(([, count]) => count > 0)
      .map(([tId]) => {
        return tanks.find(t => t.id === tId) || { id: tId, displayName: `Tank ${tId}` };
      });
  }, [quickType, quickSpeciesId, quickAgeGroup, tankStock, tanks]);

  useEffect(() => {
    if (quickTanksAvailable.length > 0) {
      setQuickTankId(quickTanksAvailable[0].id);
    } else {
      setQuickTankId('');
    }
  }, [quickTanksAvailable]);

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
    const sp = species.find(s => s.id === quickSpeciesId);
    if (!sp) return;
    if (!quickTankId) {
      setLocalToast({ message: '⚠️ No tank selected.' });
      return;
    }

    // Trigger transaction log
    onConfirmLog({
      type: quickType,
      species: sp,
      ageGroup: quickAgeGroup,
      tankId: quickTankId,
      count: val,
      note: quickNote.trim()
    });

    setConfirmFlash(true);
    setTimeout(() => setConfirmFlash(false), 1000);

    const typeLabel = quickType === 'birth' ? 'birth' : quickType === 'export' ? 'export' : 'death';
    setLocalToast({
      message: `✓ ${val} ${sp.name} (${AGE_GROUP_LABELS[quickAgeGroup].label}) — ${typeLabel} recorded in Tank ${quickTankId}`
    });

    setQuickCount('');
    setQuickNote('');
  };

  const bornBreakdown = useMemo(() => {
    let adults = 0;
    let semiAdults = 0;
    let newborns = 0;
    activity.forEach(act => {
      if (act.type === 'birth') {
        const count = act.count || 0;
        const ag = act.ageGroup || 'newborn';
        if (ag === 'adult') adults += count;
        else if (ag === 'semi-adult') semiAdults += count;
        else newborns += count;
      }
    });
    return { adults, semiAdults, newborns };
  }, [activity]);

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
          <div style={{ fontSize:9, color:'var(--muted)', marginTop:6, display:'flex', gap:4, flexWrap:'wrap' }}>
            <span>A:{bornBreakdown.adults}</span>
            <span>·</span>
            <span>S-A:{bornBreakdown.semiAdults}</span>
            <span>·</span>
            <span>NBN:{bornBreakdown.newborns}</span>
          </div>
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
            
            {/* Species Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Species</span>
              <select value={quickSpeciesId} onChange={e => setQuickSpeciesId(Number(e.target.value))}>
                {species.map(sp => (
                  <option key={sp.id} value={sp.id}>{sp.name} (Total: {sp.stock})</option>
                ))}
              </select>
            </div>

            {/* Age Group Selector pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Age Group</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {['adult', 'semi-adult', 'newborn'].map(ag => {
                  const isAvailable = quickAgeGroupsAvailable.includes(ag);
                  const isSelected = quickAgeGroup === ag;
                  const stock = Object.values(tankStock[quickSpeciesId]?.[ag] || {}).reduce((a, b) => a + b, 0);
                  
                  return (
                    <button
                      key={ag}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setQuickAgeGroup(ag)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 6,
                        border: isSelected ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : isAvailable ? '#A0A0A0' : '#555555',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        opacity: isAvailable ? 1 : 0.4,
                        textDecoration: isAvailable ? 'none' : 'line-through'
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{AGE_GROUP_LABELS[ag].label}</span>
                      <span style={{ fontSize: 9, color: '#555555', marginTop: 2 }}>{stock} fish</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {/* Tank select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--muted)' }}>Tank</span>
                <select value={quickTankId} onChange={e => setQuickTankId(e.target.value)} disabled={quickTanksAvailable.length === 0}>
                  {quickTanksAvailable.length === 0 ? (
                    <option value="">No tanks available</option>
                  ) : (
                    quickTanksAvailable.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.displayName} ({quickType === 'birth' ? `${getTankTotal(t.id)}/${t.capacity}` : `${getCount(quickSpeciesId, quickAgeGroup, t.id)} stock`})
                      </option>
                    ))
                  )}
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
              const textColors = {
                birth: '#FFFFFF',
                export: '#AAAAAA',
                death: '#666666',
                transfer: '#888888',
                quarantine: '#666666',
                quarantine_lift: '#FFFFFF',
                stock_in: '#FFFFFF',
                promote: '#FFFFFF',
                stock_fix: '#888888',
                tank_add: '#FFFFFF',
                tank_del: '#666666'
              };
              const sign = act.type === 'birth' ? '+' : act.type === 'export' ? '→' : act.type === 'death' ? '−' : '';
              const dotColor = textColors[act.type] || '#FFFFFF';
              
              const emojis = {
                birth: '🐣',
                export: '📦',
                death: '💀',
                transfer: '⇄',
                quarantine: '🔒',
                quarantine_lift: '✓',
                stock_in: '📥',
                promote: '⬆',
                stock_fix: '✏',
                tank_add: '🪣',
                tank_del: '🗑'
              };

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
                    <span style={{ fontSize: 13 }}>{emojis[act.type] || '⚡'}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
                        {act.message ? (
                          <span>{act.message}</span>
                        ) : sign ? (
                          <span>
                            <span style={{ color: dotColor, fontWeight: 700, marginRight: 4 }}>{sign}{act.count}</span>
                            {act.species}
                          </span>
                        ) : act.type === 'transfer' ? (
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
                    {act.note && act.type !== 'quarantine' && !act.message && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{act.note}</div>
                    )}
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
          {tanks.map(tank => {
            const tankContents = getContentsOfTank(tank.id);
            const uniqueSpeciesCount = new Set(tankContents.map(item => item.species.id)).size;
            
            // Check if any species in this tank is low stock overall
            const hasLowStockSpecies = tankContents.some(item => {
              const sp = species.find(s => s.id === item.species.id);
              return sp && sp.stock <= sp.min;
            });

            // calculate actual current total dynamically
            const actualCurrent = getTankTotal(tank.id);

            const pct = Math.min(100, Math.round((actualCurrent / tank.capacity) * 100));
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

                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center' }}>{tank.displayName}</span>
                
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

function InventoryTab({ species, search, onConfirmLog, filterLowStock, onClearFilter, tankStock, setSpeciesState, setTankStock, tanks }) {
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

  // Add Species Form State
  const [showAddSpeciesPanel, setShowAddSpeciesPanel] = useState(false);
  const [newSpName, setNewSpName] = useState('');
  const [newSpMin, setNewSpMin] = useState('');
  const [newSpPrice, setNewSpPrice] = useState('');
  const [newSpTemp, setNewSpTemp] = useState('24-28°C');
  const [newSpPh, setNewSpPh] = useState('7.2');
  const [newSpError, setNewSpError] = useState(null);

  const handleAddSpeciesSubmit = (e) => {
    e.preventDefault();
    const cleanName = newSpName.trim();
    if (!cleanName) {
      setNewSpError("Species Name is required.");
      return;
    }
    const minVal = parseInt(newSpMin, 10);
    const priceVal = parseInt(newSpPrice, 10);
    if (isNaN(minVal) || minVal < 0 || isNaN(priceVal) || priceVal < 0) {
      setNewSpError("Min Stock and Price must be valid non-negative numbers.");
      return;
    }

    // Check duplicate
    const exists = species.some(s => s.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      setNewSpError(`Species "${cleanName}" already exists.`);
      return;
    }

    const newId = species.length > 0 ? Math.max(...species.map(s => s.id)) + 1 : 1;
    const newSp = {
      id: newId,
      name: cleanName,
      min: minVal,
      price: priceVal,
      temp: newSpTemp.trim() || '24-28°C',
      ph: newSpPh.trim() || '7.2',
      stock: 0,
      born: 0,
      exported: 0,
      died: 0
    };

    setSpeciesState(prev => [...prev, newSp]);
    setTankStock(prev => ({
      ...prev,
      [newId]: {
        adult: {},
        'semi-adult': {},
        newborn: {}
      }
    }));

    // Reset fields
    setNewSpName('');
    setNewSpMin('');
    setNewSpPrice('');
    setNewSpTemp('24-28°C');
    setNewSpPh('7.2');
    setNewSpError(null);
    setShowAddSpeciesPanel(false);
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
          onClick={() => setShowAddSpeciesPanel(!showAddSpeciesPanel)}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap', border: 'none', cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          <Plus size={14} /> {showAddSpeciesPanel ? 'Close Panel' : 'Add Species'}
        </button>
      </div>

      {/* Add Species slide-down panel */}
      {showAddSpeciesPanel && (
        <div className="card" style={{
          padding: 20,
          borderRadius: 12,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 8
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Add New Species</span>
            <button onClick={() => setShowAddSpeciesPanel(false)} style={{ background: 'none', color: '#888888', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>

          <form onSubmit={handleAddSpeciesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {newSpError && (
              <div style={{ color: '#FF6666', fontSize: 11, fontWeight: 600 }}>{newSpError}</div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>SPECIES NAME</span>
                <input
                  type="text"
                  value={newSpName}
                  onChange={e => setNewSpName(e.target.value)}
                  placeholder="e.g. Cardinal Tetra"
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>MINIMUM STOCK TARGET</span>
                <input
                  type="number"
                  min={0}
                  value={newSpMin}
                  onChange={e => setNewSpMin(e.target.value)}
                  placeholder="e.g. 50"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>BASE PRICE (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={newSpPrice}
                  onChange={e => setNewSpPrice(e.target.value)}
                  placeholder="e.g. 80"
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>TEMP RANGE</span>
                <input
                  type="text"
                  value={newSpTemp}
                  onChange={e => setNewSpTemp(e.target.value)}
                  placeholder="e.g. 24-28°C"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>pH RANGE</span>
                <input
                  type="text"
                  value={newSpPh}
                  onChange={e => setNewSpPh(e.target.value)}
                  placeholder="e.g. 6.5-7.5"
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', height: 38, background: '#FFFFFF', color: '#000000', fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 6 }}>
              Create Species Entry
            </button>
          </form>
        </div>
      )}

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
                          color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
                          color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
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
          </tbody>
        </table>
      </div>

      {/* Accordion Panels for InlineLogForm */}
      {openAccordion.speciesId && openAccordion.type && (() => {
        const sp = species.find(s => s.id === openAccordion.speciesId);
        if (!sp) return null;
        return (
          <div style={{ marginTop: 6 }}>
            <InlineLogForm
              species={sp}
              type={openAccordion.type}
              onConfirm={onConfirmLog}
              onClose={() => setOpenAccordion({ speciesId: null, type: null })}
              tankStock={tankStock}
              tanksList={tanks}
            />
          </div>
        );
      })()}

    </div>
  );
}


// ─── TANKS TAB (OVERHAULED) ──────────────────────────────────────────────────

function TanksTab({
  species,
  tankStock,
  setTankStock,
  tanks,
  setTanks,
  quarantinedTanks,
  setQuarantinedTanks,
  onConfirmLog,
  onTransferStock,
  onAddSpeciesToTank,
  sales,
  setActivity
}) {
  const [viewType, setViewType] = useState('species'); // 'species' | 'tank' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTankPanel, setShowAddTankPanel] = useState(false);
  const [highlightedTankId, setHighlightedTankId] = useState(null);

  // Toast notification state
  const [localToast, setLocalToast] = useState(null);

  // Show a toast helper
  const triggerToast = (msg) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  // Add Tank Form State
  const [addTankId, setAddTankId] = useState('');
  const [addTankName, setAddTankName] = useState('');
  const [addTankType, setAddTankType] = useState('Freshwater');
  const [addTankCapacity, setAddTankCapacity] = useState('');
  const [addTankTemp, setAddTankTemp] = useState('');
  const [addTankPh, setAddTankPh] = useState('');
  const [addTankError, setAddTankError] = useState('');

  // Editing Tank State (for By Tank / All Tanks)
  const [editingTankId, setEditingTankId] = useState(null);
  const [editTankName, setEditTankName] = useState('');
  const [editTankType, setEditTankType] = useState('Freshwater');
  const [editTankCapacity, setEditTankCapacity] = useState('');
  const [editTankTemp, setEditTankTemp] = useState('');
  const [editTankPh, setEditTankPh] = useState('');

  // Accordion Expand/Collapse States
  const [expandedSpecies, setExpandedSpecies] = useState({ 1: true });
  const [expandedAgeGroups, setExpandedAgeGroups] = useState({});

  const toggleSpeciesExpand = (spId) => {
    setExpandedSpecies(prev => ({ ...prev, [spId]: !prev[spId] }));
  };

  const toggleAgeGroupExpand = (key) => {
    setExpandedAgeGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Inline forms states inside Species Cards
  const [showAddAgeGroupSpId, setShowAddAgeGroupSpId] = useState(null);
  const [selectedAgeGroupInput, setSelectedAgeGroupInput] = useState('semi-adult');

  const [showAssignTankKey, setShowAssignTankKey] = useState(null); // 'spId-ageGroup'
  const [assignTankId, setAssignTankId] = useState('');
  const [assignCount, setAssignCount] = useState('');

  // Sub-card Inline Actions States
  const [activeTransferKey, setActiveTransferKey] = useState(null); // 'spId-ageGroup-fromTank'
  const [transferToTankId, setTransferToTankId] = useState('');
  const [transferCount, setTransferCount] = useState('');

  const [activePromoteKey, setActivePromoteKey] = useState(null); // 'spId-fromAge-tankId'
  const [promoteToAge, setPromoteToAge] = useState('semi-adult');
  const [promoteCount, setPromoteCount] = useState('');

  const [activeEditCountKey, setActiveEditCountKey] = useState(null); // 'spId-ageGroup-tankId'
  const [editCountVal, setEditCountVal] = useState('');

  // Quarantine input state
  const [showQuarantineTankId, setShowQuarantineTankId] = useState(null);
  const [quarantineReason, setQuarantineReason] = useState('');

  // Helper selectors
  const getSpeciesTotal = (speciesId) => {
    return Object.values(tankStock[speciesId] || {})
      .flatMap(Object.values)
      .reduce((a, b) => a + b, 0);
  };

  const getAgeGroupTotal = (speciesId, ageGroup) => {
    return Object.values(tankStock[speciesId]?.[ageGroup] || {}).reduce((a, b) => a + b, 0);
  };

  const getCount = (speciesId, ageGroup, tankId) => {
    return tankStock[speciesId]?.[ageGroup]?.[tankId] ?? 0;
  };

  const getAgeGroupsForSpecies = (speciesId) => {
    return AGE_GROUPS.filter(ag => getAgeGroupTotal(speciesId, ag) > 0);
  };

  const getTanksForAgeGroup = (speciesId, ageGroup) => {
    return Object.entries(tankStock[speciesId]?.[ageGroup] || {})
      .filter(([, count]) => count > 0)
      .map(([tankId, count]) => ({ tankId, count, tankData: tanks.find(t => t.id === tankId) }))
      .sort((a, b) => b.count - a.count);
  };

  const getContentsOfTank = (tankId) => {
    const results = [];
    Object.entries(tankStock).forEach(([speciesId, ageGroups]) => {
      Object.entries(ageGroups).forEach(([ageGroup, tankCounts]) => {
        const count = tankCounts[tankId];
        if (count > 0) {
          const sp = species.find(s => s.id === parseInt(speciesId));
          if (sp) {
            results.push({ species: sp, ageGroup, count });
          }
        }
      });
    });
    return results.sort((a, b) => b.count - a.count);
  };

  const getTankTotal = (tankId) => {
    return getContentsOfTank(tankId).reduce((a, item) => a + item.count, 0);
  };

  // Avg daily export helper over last 30 days
  const getAvgDailyExport = (speciesId) => {
    const todayMs = new Date('2026-07-28').getTime();
    const thirtyDaysAgo = todayMs - 30 * 24 * 60 * 60 * 1000;
    
    const relevantSales = sales.filter(s => {
      if (s.speciesId !== speciesId || !s.approved) return false;
      const saleTime = new Date(s.date).getTime();
      return saleTime >= thirtyDaysAgo;
    });

    const totalQty = relevantSales.reduce((sum, s) => sum + s.qty, 0);
    return totalQty > 0 ? (totalQty / 30) : 0;
  };

  // State mutations
  const deductStock = (speciesId, ageGroup, tankId, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [tankId]: Math.max(0, (prev[speciesId]?.[ageGroup]?.[tankId] ?? 0) - qty),
        }
      }
    }));
  };

  const addStock = (speciesId, ageGroup, tankId, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [tankId]: (prev[speciesId]?.[ageGroup]?.[tankId] ?? 0) + qty,
        }
      }
    }));
  };

  const transferStock = (speciesId, ageGroup, fromTank, toTank, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [fromTank]: Math.max(0, (prev[speciesId]?.[ageGroup]?.[fromTank] ?? 0) - qty),
          [toTank]: (prev[speciesId]?.[ageGroup]?.[toTank] ?? 0) + qty,
        }
      }
    }));
  };

  const promoteStock = (speciesId, fromAge, toAge, tankId, qty) => {
    deductStock(speciesId, fromAge, tankId, qty);
    addStock(speciesId, toAge, tankId, qty);
  };

  // Form submit: Create Tank
  const handleCreateTank = (e) => {
    e.preventDefault();
    const id = addTankId.toUpperCase().trim();
    if (!id || id.length === 0) {
      setAddTankError("Tank ID is required.");
      return;
    }
    if (tanks.some(t => t.id === id)) {
      setAddTankError(`Tank ${id} already exists`);
      return;
    }
    const cap = parseInt(addTankCapacity, 10);
    if (!cap || cap <= 0) {
      setAddTankError("Capacity must be greater than 0.");
      return;
    }
    
    const displayName = addTankName.trim() || `Tank ${id}`;
    const newTank = {
      id,
      displayName,
      capacity: cap,
      temp: addTankTemp.trim() || '26°C',
      ph: addTankPh.trim() || '7.2',
      type: addTankType,
      addedDate: today()
    };

    setTanks(prev => [...prev, newTank]);
    setShowAddTankPanel(false);
    
    // Clear inputs
    setAddTankId('');
    setAddTankName('');
    setAddTankCapacity('');
    setAddTankTemp('');
    setAddTankPh('');
    setAddTankError('');

    triggerToast(`Tank ${displayName} created successfully`);

    // Switch view to By Tank and highlight
    setViewType('tank');
    setHighlightedTankId(id);
    setTimeout(() => setHighlightedTankId(null), 2500);

    // Log to activity feed
    setActivity(prev => [{
      id: Date.now(),
      type: 'tank_add',
      message: `🪣 New tank '${displayName}' created`,
      time: 'Just now'
    }, ...prev]);
  };

  // Delete tank (only if empty)
  const handleDeleteTank = (id) => {
    const totalCount = getTankTotal(id);
    if (totalCount > 0) {
      triggerToast("⚠️ Cannot delete tank: remove all fish first.");
      return;
    }
    const displayName = tanks.find(t => t.id === id)?.displayName || id;
    if (window.confirm(`Delete Tank ${displayName}?`)) {
      setTanks(prev => prev.filter(t => t.id !== id));
      triggerToast(`Tank ${displayName} removed successfully`);
      
      // Log to activity
      setActivity(prev => [{
        id: Date.now(),
        type: 'tank_del',
        message: `🗑 Tank '${displayName}' removed`,
        time: 'Just now'
      }, ...prev]);
    }
  };

  // Start edit tank form
  const handleStartEditTank = (tank) => {
    setEditingTankId(tank.id);
    setEditTankName(tank.displayName);
    setEditTankCapacity(tank.capacity.toString());
    setEditTankType(tank.type);
    setEditTankTemp(tank.temp);
    setEditTankPh(tank.ph);
  };

  // Submit edit tank
  const handleSaveEditTank = (id) => {
    const cap = parseInt(editTankCapacity, 10);
    if (!cap || cap <= 0) {
      alert("Capacity must be greater than 0.");
      return;
    }

    setTanks(prev => prev.map(t => t.id === id ? {
      ...t,
      displayName: editTankName.trim() || `Tank ${id}`,
      capacity: cap,
      type: editTankType,
      temp: editTankTemp.trim() || '26°C',
      ph: editTankPh.trim() || '7.2'
    } : t));

    setEditingTankId(null);
    triggerToast("Tank details updated");
  };

  const getWaterStatusPill = (ph, temp) => {
    const phNum = parseFloat(ph);
    if (isNaN(phNum) || phNum < 6.0 || phNum > 9.0) return 'critical';
    if (phNum < 6.5 || phNum > 8.0) return 'warning';
    return 'normal';
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 10
      }}>
        {/* View Toggle */}
        <div style={{ display: 'inline-flex', background: '#0D0D0D', borderRadius: 8, padding: 2, border: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={() => setViewType('species')}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              background: viewType === 'species' ? '#FFFFFF' : 'transparent',
              color: viewType === 'species' ? '#000000' : '#A0A0A0',
              border: 'none'
            }}
          >
            By Species
          </button>
          <button
            onClick={() => setViewType('tank')}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              background: viewType === 'tank' ? '#FFFFFF' : 'transparent',
              color: viewType === 'tank' ? '#000000' : '#A0A0A0',
              border: 'none'
            }}
          >
            By Tank
          </button>
          <button
            onClick={() => setViewType('all')}
            style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              background: viewType === 'all' ? '#FFFFFF' : 'transparent',
              color: viewType === 'all' ? '#000000' : '#A0A0A0',
              border: 'none'
            }}
          >
            All Tanks
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 220 }}>
          <Search size={13} color="#555555" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={viewType === 'tank' ? "Search tanks..." : "Search species..."}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '6px 12px 6px 34px',
              color: 'var(--text)',
              fontSize: 13,
              width: '100%'
            }}
          />
        </div>

        {/* Add Tank Button */}
        <button
          onClick={() => setShowAddTankPanel(!showAddTankPanel)}
          style={{
            background: '#FFFFFF',
            color: '#000000',
            borderRadius: 8,
            padding: '8px 16px',
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {showAddTankPanel ? '✕ Close Panel' : '＋ Add Tank'}
        </button>
      </div>

      {/* Local toast inside view */}
      {localToast && (
        <div style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8,
          padding: '10px 16px',
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'center'
        }}>
          {localToast}
        </div>
      )}

      {/* Slide down Add Tank Panel */}
      {showAddTankPanel && (
        <div className="card" style={{
          padding: 20,
          borderRadius: 12,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Create New Tank</span>
            <button onClick={() => setShowAddTankPanel(false)} style={{ background: 'none', color: '#888888', border: 'none', cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>

          <form onSubmit={handleCreateTank} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {addTankError && (
              <div style={{ color: '#FF6666', fontSize: 11, fontWeight: 600 }}>{addTankError}</div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>TANK ID</span>
                <input
                  type="text"
                  maxLength={3}
                  value={addTankId}
                  onChange={e => setAddTankId(e.target.value.toUpperCase())}
                  placeholder="e.g. G"
                  required
                />
                <span style={{ fontSize: 8, color: 'var(--muted)', marginTop: 2 }}>Short identifier used internally</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>DISPLAY NAME</span>
                <input
                  type="text"
                  value={addTankName}
                  onChange={e => setAddTankName(e.target.value)}
                  placeholder="e.g. Breeding Tank 3"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>WATER TYPE</span>
                <select value={addTankType} onChange={e => setAddTankType(e.target.value)}>
                  <option value="Freshwater">Freshwater</option>
                  <option value="Marine">Marine</option>
                  <option value="Brackish">Brackish</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>CAPACITY (FISH)</span>
                <input
                  type="number"
                  min={1}
                  value={addTankCapacity}
                  onChange={e => setAddTankCapacity(e.target.value)}
                  placeholder="e.g. 200"
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>TEMPERATURE</span>
                <input
                  type="text"
                  value={addTankTemp}
                  onChange={e => setAddTankTemp(e.target.value)}
                  placeholder="e.g. 26°C"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>pH LEVEL</span>
                <input
                  type="number"
                  step="0.1"
                  value={addTankPh}
                  onChange={e => setAddTankPh(e.target.value)}
                  placeholder="e.g. 7.2"
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', height: 42, background: '#FFFFFF', color: '#000000', fontWeight: 700, border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 8 }}>
              Create Tank
            </button>
          </form>
        </div>
      )}

      {/* Render View types */}
      {viewType === 'species' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {species
            .filter(sp => sp.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(sp => {
              const spTotal = getSpeciesTotal(sp.id);
              const activeAgeGroups = getAgeGroupsForSpecies(sp.id);
              const isLowStock = spTotal <= sp.min;
              const isCritical = spTotal <= sp.min * 0.5;
              const statusLabel = isCritical ? 'critical' : isLowStock ? 'low' : 'healthy';
              const isExpanded = expandedSpecies[sp.id];

              return (
                <div key={sp.id} className="card" style={{ padding: 0, borderRadius: 12, overflow: 'hidden', background: '#0C1526', border: '1px solid rgba(255,255,255,0.08)' }}>
                  
                  {/* Header */}
                  <div
                    onClick={() => toggleSpeciesExpand(sp.id)}
                    style={{
                      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      <ChevronRight size={16} color="#888888" />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{sp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{spTotal} fish total</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {/* Mini Summary Chips */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {activeAgeGroups.map(ag => (
                          <span key={ag} style={{ fontSize: 9, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '2px 7px', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.04)' }}>
                            {AGE_GROUP_LABELS[ag].short}: {getAgeGroupTotal(sp.id, ag)}
                          </span>
                        ))}
                      </div>

                      {/* Total */}
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', minWidth: 40, textAlign: 'right' }}>
                        {spTotal}
                      </span>

                      {/* Warning pill */}
                      {(isLowStock || isCritical) && (
                        <StatusPill status={statusLabel} />
                      )}
                    </div>
                  </div>

                  {/* Collapsible Body */}
                  {isExpanded && (
                    <div style={{ padding: '18px 18px 18px 18px' }}>
                      {/* Controls Row */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddAgeGroupSpId(showAddAgeGroupSpId === sp.id ? null : sp.id);
                          }}
                          style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                        >
                          {showAddAgeGroupSpId === sp.id ? '✕ Cancel' : '＋ Add Age Group'}
                        </button>
                      </div>

                      {/* Inline Add Age Group Mini Form */}
                      {showAddAgeGroupSpId === sp.id && (
                        <div style={{
                          background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12,
                          display: 'flex', gap: 12, alignItems: 'center'
                        }}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontSize: 9, color: 'var(--muted)' }}>SELECT AGE GROUP</span>
                            <select
                              value={selectedAgeGroupInput}
                              onChange={e => setSelectedAgeGroupInput(e.target.value)}
                              style={{ height: 32, padding: '4px 8px' }}
                            >
                              {AGE_GROUPS
                                .filter(ag => !Object.keys(tankStock[sp.id] || {}).includes(ag))
                                .map(ag => (
                                  <option key={ag} value={ag}>{AGE_GROUP_LABELS[ag].label}</option>
                                ))
                              }
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedAgeGroupInput) return;
                              setTankStock(prev => ({
                                ...prev,
                                [sp.id]: {
                                  ...prev[sp.id],
                                  [selectedAgeGroupInput]: {}
                                }
                              }));
                              triggerToast(`Age group ${AGE_GROUP_LABELS[selectedAgeGroupInput].label} added for ${sp.name}`);
                              setShowAddAgeGroupSpId(null);
                            }}
                            style={{ height: 32, padding: '0 16px', background: '#FFFFFF', color: '#000000', fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer', marginTop: 14 }}
                          >
                            Add
                          </button>
                        </div>
                      )}

                      {/* Age Group accordion list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.keys(tankStock[sp.id] || {}).map(ageGroup => {
                          const ageGroupTotal = getAgeGroupTotal(sp.id, ageGroup);
                          const ageKey = `${sp.id}-${ageGroup}`;
                          const isAgeExpanded = expandedAgeGroups[ageKey];
                          const assignedTanks = getTanksForAgeGroup(sp.id, ageGroup);
                          
                          return (
                            <div key={ageGroup} style={{ background: '#060C18', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                              {/* Age Group Header */}
                              <div
                                onClick={() => toggleAgeGroupExpand(ageKey)}
                                style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: isAgeExpanded ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: isAgeExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                  <ChevronRight size={14} color="#666666" />
                                </div>
                                <span style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>
                                  {AGE_GROUP_LABELS[ageGroup]?.label}
                                </span>
                                <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                                  ({Math.round((AGE_GROUP_LABELS[ageGroup]?.priceMultiplier || 1) * 100)}% base price)
                                </span>
                                
                                <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginLeft: 'auto' }}>
                                  {ageGroupTotal} fish
                                </span>
                              </div>

                              {/* Age Group Body */}
                              {isAgeExpanded && (
                                <div style={{ padding: '12px 14px 14px 14px' }}>
                                  {/* Control Row */}
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowAssignTankKey(showAssignTankKey === ageKey ? null : ageKey);
                                        setAssignTankId(tanks[0]?.id || '');
                                        setAssignCount('');
                                      }}
                                      style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer', fontSize: 10, fontWeight: 700 }}
                                    >
                                      {showAssignTankKey === ageKey ? '✕ Cancel' : '＋ Assign to Tank'}
                                    </button>
                                  </div>

                                  {/* Inline Assign to Tank form */}
                                  {showAssignTankKey === ageKey && (
                                    <div style={{
                                      background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8,
                                      border: '1px solid rgba(255,255,255,0.06)', marginBottom: 10,
                                      display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap'
                                    }}>
                                      <div style={{ flex: 2, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{ fontSize: 9, color: 'var(--muted)' }}>SELECT TANK</span>
                                        <select value={assignTankId} onChange={e => setAssignTankId(e.target.value)} style={{ height: 32 }}>
                                          {tanks.map(t => (
                                            <option key={t.id} value={t.id}>
                                              {t.displayName} — ({getTankTotal(t.id)}/{t.capacity} fish)
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div style={{ flex: 1, minWidth: 80, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <span style={{ fontSize: 9, color: 'var(--muted)' }}>COUNT</span>
                                        <input
                                          type="number"
                                          min={1}
                                          value={assignCount}
                                          onChange={e => setAssignCount(e.target.value)}
                                          placeholder="Count"
                                          style={{ height: 32 }}
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const countVal = parseInt(assignCount, 10);
                                          if (!assignTankId || !countVal || countVal <= 0) return;
                                          addStock(sp.id, ageGroup, assignTankId, countVal);
                                          const tankName = tanks.find(t => t.id === assignTankId)?.displayName || assignTankId;
                                          triggerToast(`${countVal} ${sp.name} (${AGE_GROUP_LABELS[ageGroup].label}) assigned to ${tankName}`);
                                          
                                          // Log activity
                                          setActivity(prev => [{
                                            id: Date.now(),
                                            type: 'stock_in',
                                            message: `📥 +${countVal} ${sp.name} (${AGE_GROUP_LABELS[ageGroup].label}) received → ${tankName}`,
                                            time: 'Just now'
                                          }, ...prev]);

                                          setShowAssignTankKey(null);
                                        }}
                                        style={{ height: 32, padding: '0 12px', background: '#FFFFFF', color: '#000000', fontWeight: 700, borderRadius: 6, border: 'none', cursor: 'pointer', marginTop: 14 }}
                                      >
                                        Assign
                                      </button>
                                    </div>
                                  )}

                                  {/* Tank Sub-cards Grid */}
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                                    {assignedTanks.map(({ tankId, count, tankData }) => {
                                      const isQuarantined = !!quarantinedTanks[tankId];
                                      const subCardKey = `${sp.id}-${ageGroup}-${tankId}`;
                                      const isTransferActive = activeTransferKey === subCardKey;
                                      const isPromoteActive = activePromoteKey === subCardKey;
                                      const isEditActive = activeEditCountKey === subCardKey;
                                      const avgExport = getAvgDailyExport(sp.id);

                                      const capacity = tankData?.capacity || 100;
                                      const pct = Math.min(100, Math.round((count / capacity) * 100));
                                      const fillBarCol = count < 10 ? '#FF6666' : count < 30 ? '#FFB800' : '#FFFFFF';

                                      return (
                                        <div
                                          key={tankId}
                                          style={{
                                            background: isQuarantined ? 'rgba(255,71,87,0.03)' : 'rgba(255,255,255,0.02)',
                                            border: isQuarantined ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: 8, padding: '12px 10px', position: 'relative'
                                          }}
                                        >
                                          {/* Tank name & Lock */}
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 16 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                                              {tankData?.displayName || `Tank ${tankId}`}
                                            </span>
                                            {isQuarantined && <span title="Quarantined" style={{ fontSize: 9 }}>🔒</span>}
                                          </div>

                                          {/* Count display or edit input */}
                                          {isEditActive ? (
                                            <input
                                              type="number"
                                              value={editCountVal}
                                              onChange={e => setEditCountVal(e.target.value)}
                                              onBlur={() => {
                                                const newVal = parseInt(editCountVal, 10);
                                                if (!isNaN(newVal) && newVal >= 0) {
                                                  setTankStock(prev => ({
                                                    ...prev,
                                                    [sp.id]: {
                                                      ...prev[sp.id],
                                                      [ageGroup]: {
                                                        ...prev[sp.id]?.[ageGroup],
                                                        [tankId]: newVal
                                                      }
                                                    }
                                                  }));
                                                  const tankName = tankData?.displayName || tankId;
                                                  triggerToast("Stock count updated");
                                                  setActivity(prev => [{
                                                    id: Date.now(),
                                                    type: 'stock_fix',
                                                    message: `✏ ${sp.name} (${AGE_GROUP_LABELS[ageGroup].label}) count corrected in ${tankName} by admin`,
                                                    time: 'Just now'
                                                  }, ...prev]);
                                                }
                                                setActiveEditCountKey(null);
                                              }}
                                              onKeyDown={e => {
                                                if (e.key === 'Enter') e.currentTarget.blur();
                                                if (e.key === 'Escape') setActiveEditCountKey(null);
                                              }}
                                              autoFocus
                                              style={{ height: 26, width: '100%', fontSize: 13, padding: '2px 6px', margin: '6px 0' }}
                                            />
                                          ) : (
                                            <>
                                              <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '4px 0 2px 0' }}>
                                                {count}
                                              </div>
                                              <div style={{ fontSize: 9, color: 'var(--muted)' }}>fish</div>
                                            </>
                                          )}

                                          {/* Vertical Fill Bar */}
                                          <div style={{
                                            position: 'absolute', top: 12, right: 10, height: 40, width: 6,
                                            background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden'
                                          }}>
                                            <div style={{
                                              position: 'absolute', bottom: 0, left: 0, right: 0,
                                              width: '100%', height: `${pct}%`, background: fillBarCol
                                            }} />
                                          </div>

                                          {/* Info footer */}
                                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                                              {avgExport > 0 ? `~${Math.ceil(count / avgExport)}d drain` : '— drain'}
                                            </span>
                                            <span style={{ fontSize: 8, background: 'rgba(255,255,255,0.04)', padding: '1px 4px', borderRadius: 2, color: 'var(--muted)' }}>
                                              {tankData?.type === 'Marine' ? 'MAR' : 'FRSH'}
                                            </span>
                                          </div>

                                          {/* Action Buttons row */}
                                          <div style={{ display: 'flex', gap: 6, marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 6 }}>
                                            <button
                                              title="Transfer"
                                              onClick={() => {
                                                setActiveTransferKey(isTransferActive ? null : subCardKey);
                                                setTransferToTankId(tanks.find(t => t.id !== tankId)?.id || '');
                                                setTransferCount('');
                                                setActivePromoteKey(null);
                                                setActiveEditCountKey(null);
                                              }}
                                              style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 11, padding: 0 }}
                                            >
                                              ⇄
                                            </button>
                                            
                                            {ageGroup !== 'adult' && (
                                              <button
                                                title="Promote Age Group"
                                                onClick={() => {
                                                  setActivePromoteKey(isPromoteActive ? null : subCardKey);
                                                  setPromoteToAge(ageGroup === 'newborn' ? 'semi-adult' : 'adult');
                                                  setPromoteCount('');
                                                  setActiveTransferKey(null);
                                                  setActiveEditCountKey(null);
                                                }}
                                                style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 11, padding: 0 }}
                                              >
                                                ⬆
                                              </button>
                                            )}

                                            <button
                                              title="Correct Count"
                                              onClick={() => {
                                                setActiveEditCountKey(isEditActive ? null : subCardKey);
                                                setEditCountVal(count.toString());
                                                setActiveTransferKey(null);
                                                setActivePromoteKey(null);
                                              }}
                                              style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 11, padding: 0 }}
                                            >
                                              ✏
                                            </button>

                                            <button
                                              title="Remove assignment"
                                              onClick={() => {
                                                if (window.confirm("Remove this tank assignment?")) {
                                                  setTankStock(prev => {
                                                    const updatedGroup = { ...prev[sp.id]?.[ageGroup] };
                                                    delete updatedGroup[tankId];
                                                    return {
                                                      ...prev,
                                                      [sp.id]: {
                                                        ...prev[sp.id],
                                                        [ageGroup]: updatedGroup
                                                      }
                                                    };
                                                  });
                                                  triggerToast("Assignment removed.");
                                                }
                                              }}
                                              style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', fontSize: 11, padding: 0 }}
                                            >
                                              🗑
                                            </button>
                                          </div>

                                          {/* Inline Transfer Form */}
                                          {isTransferActive && (
                                            <div style={{
                                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                              background: '#0D0D0D', borderRadius: 8, padding: 8, zIndex: 10,
                                              display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center'
                                            }}>
                                              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>Transfer Fish</div>
                                              <select value={transferToTankId} onChange={e => setTransferToTankId(e.target.value)} style={{ height: 26, fontSize: 10 }}>
                                                {tanks.filter(t => t.id !== tankId).map(t => (
                                                  <option key={t.id} value={t.id}>{t.displayName}</option>
                                                ))}
                                              </select>
                                              <input
                                                type="number"
                                                min={1}
                                                max={count}
                                                value={transferCount}
                                                onChange={e => setTransferCount(e.target.value)}
                                                placeholder="Count"
                                                style={{ height: 26, fontSize: 10, padding: '2px 4px' }}
                                              />
                                              <div style={{ display: 'flex', gap: 4 }}>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const qty = parseInt(transferCount, 10);
                                                    if (!transferToTankId || !qty || qty <= 0 || qty > count) return;
                                                    transferStock(sp.id, ageGroup, tankId, transferToTankId, qty);
                                                    const fromName = tankData?.displayName || tankId;
                                                    const toName = tanks.find(t => t.id === transferToTankId)?.displayName || transferToTankId;
                                                    triggerToast(`Moved ${qty} fish to ${toName}`);
                                                    
                                                    // Log activity
                                                    setActivity(prev => [{
                                                      id: Date.now(),
                                                      type: 'transfer',
                                                      message: `⇄ ${qty} ${sp.name} (${AGE_GROUP_LABELS[ageGroup].label}) moved ${fromName} → ${toName}`,
                                                      time: 'Just now'
                                                    }, ...prev]);

                                                    setActiveTransferKey(null);
                                                  }}
                                                  style={{ flex: 1, height: 22, fontSize: 9, background: '#FFFFFF', color: '#000000', fontWeight: 700 }}
                                                >
                                                  OK
                                                </button>
                                                <button type="button" onClick={() => setActiveTransferKey(null)} style={{ flex: 1, height: 22, fontSize: 9, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>✕</button>
                                              </div>
                                            </div>
                                          )}

                                          {/* Inline Promote Form */}
                                          {isPromoteActive && (
                                            <div style={{
                                              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                              background: '#0D0D0D', borderRadius: 8, padding: 8, zIndex: 10,
                                              display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center'
                                            }}>
                                              <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>Promote to</div>
                                              <select value={promoteToAge} onChange={e => setPromoteToAge(e.target.value)} style={{ height: 26, fontSize: 10 }}>
                                                {ageGroup === 'newborn' && <option value="semi-adult">Semi-Adult</option>}
                                                <option value="adult">Adult</option>
                                              </select>
                                              <input
                                                type="number"
                                                min={1}
                                                max={count}
                                                value={promoteCount}
                                                onChange={e => setPromoteCount(e.target.value)}
                                                placeholder="Count"
                                                style={{ height: 26, fontSize: 10, padding: '2px 4px' }}
                                              />
                                              <div style={{ display: 'flex', gap: 4 }}>
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const qty = parseInt(promoteCount, 10);
                                                    if (!qty || qty <= 0 || qty > count) return;
                                                    promoteStock(sp.id, ageGroup, promoteToAge, tankId, qty);
                                                    const tankName = tankData?.displayName || tankId;
                                                    triggerToast(`Promoted ${qty} fish to ${AGE_GROUP_LABELS[promoteToAge].label}`);
                                                    
                                                    // Log activity
                                                    setActivity(prev => [{
                                                      id: Date.now(),
                                                      type: 'promote',
                                                      message: `⬆ ${qty} ${sp.name} promoted ${AGE_GROUP_LABELS[ageGroup].label} → ${AGE_GROUP_LABELS[promoteToAge].label} in ${tankName}`,
                                                      time: 'Just now'
                                                    }, ...prev]);

                                                    setActivePromoteKey(null);
                                                  }}
                                                  style={{ flex: 1, height: 22, fontSize: 9, background: '#FFFFFF', color: '#000000', fontWeight: 700 }}
                                                >
                                                  OK
                                                </button>
                                                <button type="button" onClick={() => setActivePromoteKey(null)} style={{ flex: 1, height: 22, fontSize: 9, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>✕</button>
                                              </div>
                                            </div>
                                          )}

                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
        </div>
      )}

      {/* View 2: By Tank Grid view */}
      {viewType === 'tank' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {tanks
            .filter(t => t.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(tank => {
              const tankContents = getContentsOfTank(tank.id);
              const totalOccupants = getTankTotal(tank.id);
              const pct = Math.min(100, Math.round((totalOccupants / tank.capacity) * 100));
              const fillCol = pct > 85 ? '#FF6666' : pct > 65 ? '#FFB800' : '#FFFFFF';
              const isQuarantined = !!quarantinedTanks[tank.id];
              const isEditing = editingTankId === tank.id;
              const isHighlighted = highlightedTankId === tank.id;

              return (
                <div
                  key={tank.id}
                  className="card"
                  style={{
                    padding: 16, display: 'flex', flexDirection: 'column', background: '#0C1526',
                    border: isQuarantined ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isHighlighted ? '0 0 16px rgba(255,255,255,0.25)' : undefined,
                    transition: 'box-shadow 0.3s ease'
                  }}
                >
                  {isEditing ? (
                    /* Inline editing form inside tank card */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>Edit Tank Details</span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 8, color: 'var(--muted)' }}>DISPLAY NAME</span>
                        <input type="text" value={editTankName} onChange={e => setEditTankName(e.target.value)} style={{ height: 28, fontSize: 11 }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 8, color: 'var(--muted)' }}>CAPACITY</span>
                        <input type="number" value={editTankCapacity} onChange={e => setEditTankCapacity(e.target.value)} style={{ height: 28, fontSize: 11 }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 8, color: 'var(--muted)' }}>WATER TYPE</span>
                        <select value={editTankType} onChange={e => setEditTankType(e.target.value)} style={{ height: 28, fontSize: 11 }}>
                          <option value="Freshwater">Freshwater</option>
                          <option value="Marine">Marine</option>
                          <option value="Brackish">Brackish</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <span style={{ fontSize: 8, color: 'var(--muted)' }}>TEMP</span>
                          <input type="text" value={editTankTemp} onChange={e => setEditTankTemp(e.target.value)} style={{ height: 28, fontSize: 11 }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <span style={{ fontSize: 8, color: 'var(--muted)' }}>pH</span>
                          <input type="text" value={editTankPh} onChange={e => setEditTankPh(e.target.value)} style={{ height: 28, fontSize: 11 }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button type="button" onClick={() => handleSaveEditTank(tank.id)} style={{ flex: 1, height: 28, fontSize: 11, background: '#FFFFFF', color: '#000000', fontWeight: 700 }}>Save</button>
                        <button type="button" onClick={() => setEditingTankId(null)} style={{ flex: 1, height: 28, fontSize: 11, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    /* Regular Card Display */
                    <>
                      {/* Card Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{tank.displayName}</span>
                          <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, color: 'var(--secondary)' }}>
                            {tank.type}
                          </span>
                          {(() => {
                            const lowStockSpeciesInTankCount = tankContents.filter(item => {
                              const sp = species.find(s => s.id === item.species.id);
                              return sp && sp.stock <= sp.min;
                            }).length;
                            return lowStockSpeciesInTankCount > 0 ? (
                              <span style={{ fontSize: 9, background: 'rgba(255,184,0,0.15)', color: '#FFB800', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }} title={`${lowStockSpeciesInTankCount} species below target stock`}>
                                ⚠️ {lowStockSpeciesInTankCount} low
                              </span>
                            ) : null;
                          })()}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleStartEditTank(tank)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                          <button onClick={() => handleDeleteTank(tank.id)} style={{ background: 'none', border: 'none', color: '#888888', padding: 0, opacity: totalOccupants > 0 ? 0.3 : 1, cursor: totalOccupants > 0 ? 'not-allowed' : 'pointer' }} title="Delete" disabled={totalOccupants > 0}>🗑</button>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div style={{ height: 6, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', margin: '4px 0 10px 0' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: fillCol }} />
                      </div>

                      {/* Stats Row */}
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                        {totalOccupants} fish · {tankContents.length} active types
                      </div>

                      {/* Quarantine Status Panel */}
                      <div style={{ marginBottom: 12, background: 'rgba(255,255,255,0.02)', padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.04)' }}>
                        {isQuarantined ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <span style={{ color: '#FF6666', fontSize: 10, fontWeight: 700 }}>🔒 Quarantined: {quarantinedTanks[tank.id].reason}</span>
                            <button
                              onClick={() => {
                                setQuarantinedTanks(prev => {
                                  const updated = { ...prev };
                                  delete updated[tank.id];
                                  return updated;
                                });
                                triggerToast(`Quarantine lifted for ${tank.displayName}`);
                                
                                setActivity(prev => [{
                                  id: Date.now(),
                                  type: 'quarantine_lift',
                                  message: `✓ Tank ${tank.displayName} quarantine lifted`,
                                  time: 'Just now'
                                }, ...prev]);
                              }}
                              style={{ height: 22, fontSize: 10, background: '#FFFFFF', color: '#000000', fontWeight: 700 }}
                            >
                              Lift Quarantine
                            </button>
                          </div>
                        ) : (
                          <div>
                            {showQuarantineTankId === tank.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <input
                                  type="text"
                                  placeholder="Reason e.g. Parasite flareup..."
                                  value={quarantineReason}
                                  onChange={e => setQuarantineReason(e.target.value)}
                                  style={{ height: 26, fontSize: 10, padding: '2px 6px' }}
                                />
                                <div style={{ display: 'flex', gap: 4 }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!quarantineReason.trim()) return;
                                      setQuarantinedTanks(prev => ({
                                        ...prev,
                                        [tank.id]: { reason: quarantineReason.trim(), since: today() }
                                      }));
                                      triggerToast(`Tank ${tank.displayName} placed under quarantine`);
                                      
                                      setActivity(prev => [{
                                        id: Date.now(),
                                        type: 'quarantine',
                                        message: `🔒 Tank ${tank.displayName} quarantined — ${quarantineReason.trim()}`,
                                        time: 'Just now'
                                      }, ...prev]);

                                      setShowQuarantineTankId(null);
                                      setQuarantineReason('');
                                    }}
                                    style={{ flex: 1, height: 22, fontSize: 9, background: '#FFFFFF', color: '#000000', fontWeight: 700 }}
                                  >
                                    Confirm
                                  </button>
                                  <button type="button" onClick={() => setShowQuarantineTankId(null)} style={{ flex: 1, height: 22, fontSize: 9, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>✕</button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowQuarantineTankId(tank.id);
                                  setQuarantineReason('');
                                }}
                                style={{ width: '100%', height: 22, fontSize: 10, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#A0A0A0' }}
                              >
                                Mark Quarantine
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Contents list breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 2, marginBottom: 4 }}>CONTENTS</div>
                        {tankContents.length === 0 ? (
                          <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', padding: '10px 0' }}>No fish assigned yet</div>
                        ) : (
                          tankContents.map((item, idx) => {
                            const itemPct = Math.min(100, Math.round((item.count / tank.capacity) * 100));
                            return (
                              <div
                                key={idx}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
                                  borderBottom: idx === tankContents.length - 1 ? 'none' : '0.5px solid rgba(255,255,255,0.05)'
                                }}
                              >
                                <span style={{ fontSize: 11, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.species.name}
                                </span>
                                <span style={{ fontSize: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px', color: '#FFFFFF', fontWeight: 600 }}>
                                  {AGE_GROUP_LABELS[item.ageGroup]?.short}
                                </span>
                                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 1.5, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${itemPct}%`, background: '#FFFFFF' }} />
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', minWidth: 30, textAlign: 'right' }}>
                                  {item.count}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Totals footer */}
                      <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 700, color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8, marginTop: 8 }}>
                        Total: {totalOccupants} / {tank.capacity}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* View 3: All Tanks Table view */}
      {viewType === 'all' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: '18px 0', overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 18 }}>Tank</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Fish Count</th>
                  <th>Capacity</th>
                  <th>Usage %</th>
                  <th>Quarantine</th>
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tanks.map(tank => {
                  const occupants = getTankTotal(tank.id);
                  const usagePct = Math.min(100, Math.round((occupants / tank.capacity) * 100));
                  const usageCol = usagePct > 85 ? '#FF6666' : usagePct > 65 ? '#FFB800' : '#FFFFFF';
                  const isQuarantined = !!quarantinedTanks[tank.id];

                  return (
                    <tr key={tank.id}>
                      <td style={{ paddingLeft: 18, fontWeight: 700, color: '#fff' }}>{tank.id}</td>
                      <td style={{ color: 'var(--secondary)' }}>{tank.displayName}</td>
                      <td>{tank.type}</td>
                      <td style={{ fontWeight: 700 }}>{occupants}</td>
                      <td style={{ color: 'var(--muted)' }}>{tank.capacity}</td>
                      <td style={{ color: usageCol, fontWeight: 700 }}>{usagePct}%</td>
                      <td>
                        {isQuarantined ? (
                          <span style={{ color: '#FF6666', fontSize: 11, fontWeight: 600 }}>🔒 Yes ({quarantinedTanks[tank.id].reason})</span>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: 11 }}>No</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 16 }}>
                        <div style={{ display: 'inline-flex', gap: 10 }}>
                          <button onClick={() => handleStartEditTank(tank)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                          <button onClick={() => handleDeleteTank(tank.id)} style={{ background: 'none', border: 'none', color: '#888888', padding: 0, opacity: occupants > 0 ? 0.3 : 1, cursor: occupants > 0 ? 'not-allowed' : 'pointer' }} title="Delete" disabled={occupants > 0}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Tank Row at the bottom */}
          <button
            onClick={() => setShowAddTankPanel(!showAddTankPanel)}
            style={{
              width: '100%', height: 42, background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 8, color: '#A0A0A0', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            ＋ Add Tank
          </button>
        </div>
      )}

    </div>
  );
}


// ─── REPORTS TAB ─────────────────────────────────────────────────────────────

function ReportsTab({ species, tankStock }) {
  // Stacked chart of age group distribution per species
  const stackedData = useMemo(() => {
    return species.map(sp => {
      const getSumForAg = (ag) => Object.values(tankStock[sp.id]?.[ag] || {}).reduce((a, b) => a + b, 0);
      const newborn = getSumForAg('newborn');
      const semiAdult = getSumForAg('semi-adult');
      const adult = getSumForAg('adult');
      return {
        name: sp.name,
        Newborn: newborn,
        'Semi-Adult': semiAdult,
        Adult: adult,
        total: newborn + semiAdult + adult
      };
    }).filter(s => s.total > 0);
  }, [species, tankStock]);

  // Bar chart of transaction stats per species
  const statsData = useMemo(() => {
    return species.map(sp => ({
      name: sp.name,
      Born: sp.born,
      Exported: sp.exported,
      Died: sp.died
    }));
  }, [species]);

  // Totals summary across the entire facility
  const summaries = useMemo(() => {
    let newbornTotal = 0;
    let semiAdultTotal = 0;
    let adultTotal = 0;
    Object.values(tankStock).forEach(spGroup => {
      Object.entries(spGroup).forEach(([ag, tanksObj]) => {
        const sum = Object.values(tanksObj).reduce((a, b) => a + b, 0);
        if (ag === 'newborn') newbornTotal += sum;
        else if (ag === 'semi-adult') semiAdultTotal += sum;
        else if (ag === 'adult') adultTotal += sum;
      });
    });
    return { newbornTotal, semiAdultTotal, adultTotal };
  }, [tankStock]);

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {/* Card 1: Stacked Age Group Distribution Chart */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 16 }}>
            Stock Distribution by Age Group
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill:'#555555', fontSize:9 }} angle={-45} textAnchor="end" height={60} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#555555', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11, paddingBottom: 10 }} />
              <Bar dataKey="Newborn" stackId="a" fill="#444444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Semi-Adult" stackId="a" fill="#888888" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Adult" stackId="a" fill="#FFFFFF" radius={[4, 4, 0, 0]} />
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

      {/* Summaries Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 14, textAlign: 'center', background: '#0C1526' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>TOTAL NEWBORNS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>{summaries.newbornTotal}</div>
        </div>
        <div className="card" style={{ padding: 14, textAlign: 'center', background: '#0C1526' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>TOTAL SEMI-ADULTS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>{summaries.semiAdultTotal}</div>
        </div>
        <div className="card" style={{ padding: 14, textAlign: 'center', background: '#0C1526' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600 }}>TOTAL ADULTS</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>{summaries.adultTotal}</div>
        </div>
      </div>

    </div>
  );
}


function FinancesTab({ expenses, setExpenses, sales, species, tanks, onAddStock }) {
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
    // also support 'Fish Purchase'
    if (counts['Fish Purchase'] === undefined) counts['Fish Purchase'] = 0;
    expenses.forEach(e => {
      if (e.category === 'Fish Purchase') {
        counts['Fish Purchase'] += e.amount;
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [expenses]);

  // Add standard expense
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
    if (confirm("Are you sure you want to delete this expense record?")) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  // Add Stock In form states
  const [showStockInPanel, setShowStockInPanel] = useState(false);
  const [stockSpId, setStockSpId] = useState('');
  const [stockAgeGroup, setStockAgeGroup] = useState('adult');
  const [stockTankId, setStockTankId] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [stockBuyPrice, setStockBuyPrice] = useState('');
  const [stockSupplier, setStockSupplier] = useState('');
  const [stockDate, setStockDate] = useState(today());

  const handleStockInSubmit = (e) => {
    e.preventDefault();
    const spId = Number(stockSpId);
    const qtyVal = parseInt(stockQty, 10);
    const priceVal = parseInt(stockBuyPrice, 10);
    
    if (!spId || !stockTankId || !qtyVal || qtyVal <= 0 || !priceVal || priceVal <= 0) {
      alert("Please fill out all Stock-In fields correctly.");
      return;
    }

    const spName = species.find(s => s.id === spId)?.name || 'Fish';
    const totalCost = qtyVal * priceVal;

    // 1. Add Stock using onAddStock
    onAddStock(spId, stockAgeGroup, stockTankId, qtyVal);

    // 2. Log Expense
    const newExp = {
      id: Date.now(),
      category: 'Fish Purchase',
      amount: totalCost,
      description: `Stock In: ${qtyVal} ${spName} (${AGE_GROUP_LABELS[stockAgeGroup].label}) from ${stockSupplier || 'Supplier'}`,
      date: stockDate,
      tank: stockTankId,
      worker: 'Admin',
      status: 'approved'
    };
    setExpenses(prev => [newExp, ...prev]);

    setLocalPanelToast(`Stock-In logged — ₹${totalCost.toLocaleString('en-IN')} spent. Stock added.`);
    setTimeout(() => setLocalPanelToast(null), 3000);

    // Reset Form
    setStockQty('');
    setStockBuyPrice('');
    setStockSupplier('');
    setShowStockInPanel(false);
  };

  // Expense inline editing states
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTankId, setEditTankId] = useState('All');

  const handleStartEdit = (e) => {
    setEditingExpenseId(e.id);
    setEditCategory(e.category);
    setEditAmount(e.amount.toString());
    setEditDescription(e.description);
    setEditDate(e.date);
    setEditTankId(e.tank || 'All');
  };

  const handleSaveEdit = (id) => {
    const val = parseInt(editAmount, 10);
    if (!val || val <= 0 || !editDescription.trim()) return;

    setExpenses(prev => prev.map(e => e.id === id ? {
      ...e,
      category: editCategory,
      amount: val,
      description: editDescription.trim(),
      date: editDate,
      tank: editTankId === 'All' ? null : editTankId
    } : e));
    setEditingExpenseId(null);
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {localPanelToast && (
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '10px 16px', color: '#FFFFFF', fontSize: 12, fontWeight: 600, textAlign: 'center'
        }}>
          {localPanelToast}
        </div>
      )}

      {/* Top Header Row with Stock-In panel trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Financial Operations</div>
        <button
          onClick={() => setShowStockInPanel(!showStockInPanel)}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap', border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={14} /> {showStockInPanel ? 'Close Panel' : 'Stock In +'}
        </button>
      </div>

      {/* Slide down Stock In panel */}
      {showStockInPanel && (
        <div className="card" style={{
          padding: 20,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Stock-In Purchase Log</div>
          <form onSubmit={handleStockInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>SELECT SPECIES</span>
                <select value={stockSpId} onChange={e => { setStockSpId(e.target.value); if (tanks.length > 0 && !stockTankId) setStockTankId(tanks[0].id); }} required>
                  <option value="">Select Species</option>
                  {species.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>AGE GROUP</span>
                <select value={stockAgeGroup} onChange={e => setStockAgeGroup(e.target.value)}>
                  <option value="adult">Adult</option>
                  <option value="semi-adult">Semi-Adult</option>
                  <option value="newborn">Newborn</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>TARGET TANK</span>
                <select value={stockTankId} onChange={e => setStockTankId(e.target.value)} required>
                  <option value="">Select Tank</option>
                  {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>QUANTITY</span>
                <input
                  type="number"
                  min={1}
                  required
                  value={stockQty}
                  onChange={e => setStockQty(e.target.value)}
                  placeholder="e.g. 100"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>BUY UNIT PRICE (₹)</span>
                <input
                  type="number"
                  min={1}
                  required
                  value={stockBuyPrice}
                  onChange={e => setStockBuyPrice(e.target.value)}
                  placeholder="e.g. 40"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>SUPPLIER / DETAILS</span>
                <input
                  type="text"
                  value={stockSupplier}
                  onChange={e => setStockSupplier(e.target.value)}
                  placeholder="e.g. Golden Hatchery"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>DATE</span>
                <input
                  type="date"
                  value={stockDate}
                  onChange={e => setStockDate(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }}>
                Total Cost: ₹{((parseInt(stockQty, 10) || 0) * (parseInt(stockBuyPrice, 10) || 0)).toLocaleString('en-IN')}
              </span>
              <button type="submit" style={{ height: 36, padding: '0 24px', background: '#FFFFFF', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                Submit Stock-In & Expense
              </button>
            </div>
          </form>
        </div>
      )}

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
          <div style={{ fontSize: 24, fontWeight: 800, color: netTotal >= 0 ? '#FFFFFF' : '#FF6666', marginTop: 6 }}>
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
              {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
            </select>
          </div>

          <button
            type="submit"
            style={{
              height: 34, padding: '0 16px', background: '#FFFFFF', color: '#000000',
              fontWeight: 'bold', borderRadius: 8, fontSize: 12, border: 'none', cursor: 'pointer'
            }}
          >
            Record
          </button>
        </form>
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
            {expenses.map(e => {
              const isEditing = editingExpenseId === e.id;

              return (
                <tr key={e.id}>
                  {/* Date */}
                  <td>
                    {isEditing ? (
                      <input type="date" value={editDate} onChange={ev => setEditDate(ev.target.value)} style={{ height: 28, fontSize: 12 }} />
                    ) : (
                      formatDate(e.date)
                    )}
                  </td>

                  {/* Category */}
                  <td>
                    {isEditing ? (
                      <select value={editCategory} onChange={ev => setEditCategory(ev.target.value)} style={{ height: 28, fontSize: 12 }}>
                        {EXPENSE_CATEGORIES.concat('Fish Purchase').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: 2,
                          background: catChartData.findIndex(cd => cd.name === e.category) % 2 === 0 ? '#FFFFFF' : '#888888'
                        }} />
                        {e.category}
                      </div>
                    )}
                  </td>

                  {/* Description */}
                  <td>
                    {isEditing ? (
                      <input type="text" value={editDescription} onChange={ev => setEditDescription(ev.target.value)} style={{ height: 28, fontSize: 12, width: 200 }} />
                    ) : (
                      <span style={{ color: 'var(--secondary)' }}>{e.description}</span>
                    )}
                  </td>

                  {/* Tank */}
                  <td>
                    {isEditing ? (
                      <select value={editTankId} onChange={ev => setEditTankId(ev.target.value)} style={{ height: 28, fontSize: 12 }}>
                        <option value="All">All System</option>
                        {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
                      </select>
                    ) : (
                      <span>{e.tank ? `Tank ${e.tank}` : 'All System'}</span>
                    )}
                  </td>

                  {/* Logged By */}
                  <td style={{ color: 'var(--muted)' }}>{e.worker || 'System'}</td>

                  {/* Amount */}
                  <td style={{ fontWeight: 700 }}>
                    {isEditing ? (
                      <input type="number" value={editAmount} onChange={ev => setEditAmount(ev.target.value)} style={{ height: 28, fontSize: 12, width: 85 }} />
                    ) : (
                      <span>₹{e.amount.toLocaleString('en-IN')}</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right', paddingRight: 16 }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleSaveEdit(e.id)} style={{ padding: '4px 8px', background: '#FFFFFF', color: '#000000', fontSize: 11, fontWeight: 'bold', borderRadius: 4 }}>Save</button>
                        <button onClick={() => setEditingExpenseId(null)} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', fontSize: 11, borderRadius: 4 }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => handleStartEdit(e)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                        <button onClick={() => handleDeleteExpense(e.id)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Delete"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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


function SalesTab({ sales, setSales, species, customers, setCustomers, onDeductStock, onLogLocalToast, onOpenInvoice }) {
  // Confirmed Sales
  const confirmed = useMemo(() => sales.filter(s => s.approved), [sales]);
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

  // Row Editing State
  const [editingSaleId, setEditingSaleId] = useState(null);
  const [editBuyer, setEditBuyer] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editUnitPrice, setEditUnitPrice] = useState('');
  const [editTankId, setEditTankId] = useState('');
  const [editPayMode, setEditPayMode] = useState('UPI');
  const [editPayStatus, setEditPayStatus] = useState('paid');
  const [editAgeGroup, setEditAgeGroup] = useState('adult');

  // Approve Sale action
  const handleApproveSale = (id) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    // Deduct stock per tank stock model logic
    onDeductStock(sale.speciesId, sale.ageGroup || 'adult', sale.tankId, sale.qty);

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

  // Mark pending payment as paid
  const handleMarkAsPaid = (id) => {
    setSales(prev => prev.map(s => s.id === id ? { ...s, payStatus: 'paid' } : s));
    onLogLocalToast && onLogLocalToast("Order payment updated to Paid");
  };

  // Start inline edit
  const handleStartEdit = (s) => {
    setEditingSaleId(s.id);
    setEditBuyer(s.buyer);
    setEditQty(s.qty.toString());
    setEditUnitPrice(s.unitPrice.toString());
    setEditTankId(s.tankId);
    setEditPayMode(s.payMode);
    setEditPayStatus(s.payStatus || 'paid');
    setEditAgeGroup(s.ageGroup || 'adult');
  };

  // Save inline edit
  const handleSaveEdit = (id) => {
    const qtyVal = parseInt(editQty, 10);
    const priceVal = parseInt(editUnitPrice, 10);
    if (!qtyVal || qtyVal <= 0 || isNaN(priceVal) || priceVal < 0 || !editBuyer.trim()) {
      alert("Please check values entered.");
      return;
    }

    setSales(prev => prev.map(s => s.id === id ? {
      ...s,
      qty: qtyVal,
      unitPrice: priceVal,
      total: qtyVal * priceVal,
      buyer: editBuyer.trim(),
      payMode: editPayMode,
      payStatus: editPayStatus,
      tankId: editTankId,
      ageGroup: editAgeGroup
    } : s));

    setEditingSaleId(null);
    onLogLocalToast && onLogLocalToast("Sale record updated successfully");
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Section 1 — Sales summaries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>CONFIRMED SALES</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 6 }}>
            {confirmed.length}
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
                  <strong>{s.speciesName}</strong> ({s.ageGroup})<br />
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
              <th>Age Group</th>
              <th>Tank</th>
              <th>Qty</th>
              <th>Unit ₹</th>
              <th>Total ₹</th>
              <th>Buyer</th>
              <th>Payment Mode</th>
              <th>Payment Status</th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => {
              const isEditing = editingSaleId === s.id;
              
              return (
                <tr key={s.id}>
                  <td>{formatDate(s.date)}</td>
                  <td style={{ fontWeight: 600 }}>{s.speciesName}</td>
                  
                  {/* Age Group */}
                  <td>
                    {isEditing ? (
                      <select value={editAgeGroup} onChange={e => setEditAgeGroup(e.target.value)} style={{ height: 28, padding: '2px 4px', fontSize: 12 }}>
                        <option value="adult">Adult</option>
                        <option value="semi-adult">Semi-Adult</option>
                        <option value="newborn">Newborn</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: 11 }}>{AGE_GROUP_LABELS[s.ageGroup]?.label || s.ageGroup}</span>
                    )}
                  </td>

                  {/* Tank */}
                  <td>
                    {isEditing ? (
                      <input type="text" value={editTankId} onChange={e => setEditTankId(e.target.value.toUpperCase())} style={{ width: 50, height: 28, fontSize: 12, padding: '2px 4px' }} />
                    ) : (
                      <span>Tank {s.tankId}</span>
                    )}
                  </td>

                  {/* Qty */}
                  <td>
                    {isEditing ? (
                      <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)} style={{ width: 60, height: 28, fontSize: 12, padding: '2px 4px' }} />
                    ) : (
                      <span>{s.qty}</span>
                    )}
                  </td>

                  {/* Unit price */}
                  <td>
                    {isEditing ? (
                      <input type="number" value={editUnitPrice} onChange={e => setEditUnitPrice(e.target.value)} style={{ width: 75, height: 28, fontSize: 12, padding: '2px 4px' }} />
                    ) : (
                      <span>₹{s.unitPrice.toLocaleString('en-IN')}</span>
                    )}
                  </td>

                  {/* Total price */}
                  <td style={{ fontWeight: 700 }}>
                    {isEditing ? (
                      <span>₹{((parseInt(editQty, 10) || 0) * (parseInt(editUnitPrice, 10) || 0)).toLocaleString('en-IN')}</span>
                    ) : (
                      <span>₹{s.total.toLocaleString('en-IN')}</span>
                    )}
                  </td>

                  {/* Buyer */}
                  <td>
                    {isEditing ? (
                      <input type="text" value={editBuyer} onChange={e => setEditBuyer(e.target.value)} style={{ width: 120, height: 28, fontSize: 12, padding: '2px 4px' }} />
                    ) : (
                      <span style={{ color: 'var(--secondary)' }}>{s.buyer}</span>
                    )}
                  </td>

                  {/* Payment Mode */}
                  <td>
                    {isEditing ? (
                      <select value={editPayMode} onChange={e => setEditPayMode(e.target.value)} style={{ height: 28, padding: '2px 4px', fontSize: 12 }}>
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>{s.payMode}</span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td>
                    {isEditing ? (
                      <select value={editPayStatus} onChange={e => setEditPayStatus(e.target.value)} style={{ height: 28, padding: '2px 4px', fontSize: 12 }}>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                      </select>
                    ) : (
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                        background: s.payStatus === 'paid' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                        color: s.payStatus === 'paid' ? '#FFFFFF' : '#888888',
                        border: `1px solid ${s.payStatus === 'paid' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`
                      }}>
                        {s.payStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    )}
                  </td>

                  {/* Actions cell */}
                  <td style={{ textAlign: 'right', paddingRight: 16 }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleSaveEdit(s.id)} style={{ padding: '4px 8px', background: '#FFFFFF', color: '#000000', fontSize: 11, fontWeight: 'bold', borderRadius: 4 }}>Save</button>
                        <button onClick={() => setEditingSaleId(null)} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', fontSize: 11, borderRadius: 4 }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                        {s.approved && s.payStatus === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(s.id)}
                            style={{
                              padding: '3px 8px', background: '#FFFFFF', color: '#000000',
                              borderRadius: 4, fontSize: 10, fontWeight: 'bold'
                            }}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button onClick={() => handleStartEdit(s)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                        {s.approved ? (
                          <button onClick={() => onOpenInvoice(s)} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', padding: 0 }} title="Invoice"><Printer size={14} /></button>
                        ) : (
                          <span style={{ fontSize: 10, color: 'var(--muted)' }}>Pending</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
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
  const [errorMessage, setErrorMessage] = useState(null);

  // Editing State
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editContact, setEditContact] = useState('');

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    if (!cleanName || !cleanContact) return;

    // Check for duplicate name
    const exists = customers.some(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      setErrorMessage(`⚠️ Customer with name "${cleanName}" already exists`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const newCust = {
      id: Date.now(),
      name: cleanName,
      contact: cleanContact,
      totalOrders: 0,
      totalValue: 0,
      lastOrder: '—',
      topSpecies: '—'
    };

    setCustomers(prev => [...prev, newCust]);
    setName('');
    setContact('');
  };

  const handleStartEdit = (c) => {
    setEditingCustomerId(c.id);
    setEditName(c.name);
    setEditContact(c.contact);
  };

  const handleSaveEdit = (id) => {
    const cleanName = editName.trim();
    const cleanContact = editContact.trim();
    if (!cleanName || !cleanContact) return;

    // Check for duplicate name (excluding itself)
    const exists = customers.some(c => c.id !== id && c.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      alert(`Customer with name "${cleanName}" already exists`);
      return;
    }

    setCustomers(prev => prev.map(c => c.id === id ? {
      ...c,
      name: cleanName,
      contact: cleanContact
    } : c));
    setEditingCustomerId(null);
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {errorMessage && (
        <div style={{
          background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.2)',
          borderRadius: 8, padding: '10px 16px', color: '#FFFFFF', fontSize: 12, fontWeight: 600, textAlign: 'center'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Section 1 — Grid list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {customers.map(c => {
          const initials = c.name.split(' ').map(w => w[0]).join('').slice(0,2);
          const isEditing = editingCustomerId === c.id;

          return (
            <div key={c.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#0C1526' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Edit Customer</span>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ height: 28, fontSize: 12, padding: '2px 6px' }}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editContact}
                    onChange={e => setEditContact(e.target.value)}
                    style={{ height: 28, fontSize: 12, padding: '2px 6px' }}
                    placeholder="Contact"
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <button onClick={() => handleSaveEdit(c.id)} style={{ flex: 1, height: 26, fontSize: 11, background: '#FFFFFF', color: '#000000', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setEditingCustomerId(null)} style={{ flex: 1, height: 26, fontSize: 11, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
                    }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{c.contact}</div>
                    </div>
                    <button onClick={() => handleStartEdit(c)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
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
                </>
              )}
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

function WorkersTab({ workers, setWorkers, workerSubmissions }) {
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Edit State
  const [editingWorkerId, setEditingWorkerId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanRole = role.trim();
    if (!cleanName || !cleanRole) return;

    // Check duplicate
    const exists = workers.some(w => w.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      setErrorMessage(`⚠️ Worker with name "${cleanName}" already exists`);
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newWorker = {
      id: Date.now(),
      name: cleanName,
      role: cleanRole,
      avatar: initials || 'W'
    };

    setWorkers(prev => [...prev, newWorker]);
    setName('');
    setRole('');
    setShowAddPanel(false);
  };

  const handleStartEdit = (w) => {
    setEditingWorkerId(w.id);
    setEditName(w.name);
    setEditRole(w.role);
  };

  const handleSaveEdit = (id) => {
    const cleanName = editName.trim();
    const cleanRole = editRole.trim();
    if (!cleanName || !cleanRole) return;

    // Duplicate check
    const exists = workers.some(w => w.id !== id && w.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      alert(`Worker with name "${cleanName}" already exists`);
      return;
    }

    const initials = cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    setWorkers(prev => prev.map(w => w.id === id ? {
      ...w,
      name: cleanName,
      role: cleanRole,
      avatar: initials || 'W'
    } : w));
    setEditingWorkerId(null);
  };

  const handleDeleteWorker = (id) => {
    if (confirm("Are you sure you want to remove this worker profile?")) {
      setWorkers(prev => prev.filter(w => w.id !== id));
    }
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {errorMessage && (
        <div style={{
          background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.2)',
          borderRadius: 8, padding: '10px 16px', color: '#FFFFFF', fontSize: 12, fontWeight: 600, textAlign: 'center'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Top Header Row with Add Worker button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Worker Status Profiles</div>
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap', border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={14} /> {showAddPanel ? 'Close Panel' : 'Add Worker'}
        </button>
      </div>

      {/* Slide down Add Worker panel */}
      {showAddPanel && (
        <div className="card" style={{
          padding: 20,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Create Worker Profile</div>
          <form onSubmit={handleAddWorkerSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 150 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>FULL NAME</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                required
                style={{ height: 34 }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>ROLE / DESIGNATION</span>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Feed Handler"
                required
                style={{ height: 34 }}
              />
            </div>
            <button
              type="submit"
              style={{
                height: 34, padding: '0 20px', background: '#FFFFFF', color: '#000000',
                fontWeight: 'bold', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: 'none'
              }}
            >
              Add Profile
            </button>
          </form>
        </div>
      )}

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
          const isEditing = editingWorkerId === w.id;

          return (
            <div key={w.id} className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: '#0C1526' }}>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Edit Worker Profile</span>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    style={{ height: 28, fontSize: 12, padding: '2px 6px' }}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editRole}
                    onChange={e => setEditRole(e.target.value)}
                    style={{ height: 28, fontSize: 12, padding: '2px 6px' }}
                    placeholder="Role"
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <button onClick={() => handleSaveEdit(w.id)} style={{ flex: 1, height: 26, fontSize: 11, background: '#FFFFFF', color: '#000000', fontWeight: 'bold' }}>Save</button>
                    <button onClick={() => setEditingWorkerId(null)} style={{ flex: 1, height: 26, fontSize: 11, background: 'rgba(255,255,255,0.06)', color: '#FFFFFF' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold'
                    }}>
                      {w.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{w.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{w.role}</div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleStartEdit(w)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                      <button onClick={() => handleDeleteWorker(w.id)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Delete">🗑</button>
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
                </>
              )}
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
                    {s.details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}


// ─── EQUIPMENT TAB ───────────────────────────────────────────────────────────

function EquipmentTab({ equipment, setEquipment, setExpenses, tanks }) {
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

  // Add Equipment Form State
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newEqName, setNewEqName] = useState('');
  const [newEqType, setNewEqType] = useState('Filter');
  const [newEqTank, setNewEqTank] = useState(tanks[0]?.id || 'A');
  const [newEqCost, setNewEqCost] = useState('');
  const [newEqLast, setNewEqLast] = useState(today());
  const [newEqNext, setNewEqNext] = useState('');

  // Editing state for table rows
  const [editingEqId, setEditingEqId] = useState(null);
  const [editEqName, setEditEqName] = useState('');
  const [editEqType, setEditEqType] = useState('');
  const [editEqTank, setEditEqTank] = useState('');
  const [editEqCost, setEditEqCost] = useState('');
  const [editEqLast, setEditEqLast] = useState('');
  const [editEqNext, setEditEqNext] = useState('');

  const handleAddEquipmentSubmit = (e) => {
    e.preventDefault();
    const cleanName = newEqName.trim();
    if (!cleanName) return;

    const costVal = parseInt(newEqCost, 10) || 0;
    
    // nextService calculation (+90 days from last service if not specified)
    let nextStr = newEqNext;
    if (!nextStr) {
      const lastD = new Date(newEqLast);
      lastD.setDate(lastD.getDate() + 90);
      nextStr = lastD.toISOString().slice(0, 10);
    }

    // Determine status based on next service date
    const todayTime = new Date().setHours(0,0,0,0);
    const nextTime = new Date(nextStr).getTime();
    let status = 'ok';
    if (nextTime < todayTime) {
      status = 'overdue';
    } else if (nextTime < todayTime + 30 * 24 * 60 * 60 * 1000) {
      status = 'due-soon';
    }

    const newEqItem = {
      id: Date.now(),
      name: cleanName,
      type: newEqType,
      tank: newEqTank,
      lastService: newEqLast,
      nextService: nextStr,
      cost: costVal,
      status
    };

    setEquipment(prev => [...prev, newEqItem]);
    setNewEqName('');
    setNewEqCost('');
    setNewEqNext('');
    setShowAddPanel(false);
  };

  const handleStartEdit = (e) => {
    setEditingEqId(e.id);
    setEditEqName(e.name);
    setEditEqType(e.type);
    setEditEqTank(e.tank);
    setEditEqCost(e.cost.toString());
    setEditEqLast(e.lastService);
    setEditEqNext(e.nextService);
  };

  const handleSaveEdit = (id) => {
    const cleanName = editEqName.trim();
    if (!cleanName) return;
    const costVal = parseInt(editEqCost, 10) || 0;

    // Determine status
    const todayTime = new Date().setHours(0,0,0,0);
    const nextTime = new Date(editEqNext).getTime();
    let status = 'ok';
    if (nextTime < todayTime) {
      status = 'overdue';
    } else if (nextTime < todayTime + 30 * 24 * 60 * 60 * 1000) {
      status = 'due-soon';
    }

    setEquipment(prev => prev.map(e => e.id === id ? {
      ...e,
      name: cleanName,
      type: editEqType,
      tank: editEqTank,
      lastService: editEqLast,
      nextService: editEqNext,
      cost: costVal,
      status
    } : e));
    setEditingEqId(null);
  };

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {localPanelToast && (
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '10px 16px', color: '#FFFFFF', fontSize: 12, fontWeight: 600, textAlign: 'center'
        }}>
          {localPanelToast}
        </div>
      )}

      {/* Top row status toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Equipment Management</div>
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap', border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={14} /> {showAddPanel ? 'Close Panel' : 'Add Equipment'}
        </button>
      </div>

      {/* Add Equipment Panel */}
      {showAddPanel && (
        <div className="card" style={{
          padding: 20,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Register Equipment</div>
          <form onSubmit={handleAddEquipmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>EQUIPMENT NAME</span>
                <input
                  type="text"
                  value={newEqName}
                  onChange={e => setNewEqName(e.target.value)}
                  placeholder="e.g. Oase Biomaster 350"
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>TYPE</span>
                <select value={newEqType} onChange={e => setNewEqType(e.target.value)}>
                  <option value="Filter">Filter</option>
                  <option value="Heater">Heater</option>
                  <option value="Chiller">Chiller</option>
                  <option value="Lighting">Lighting</option>
                  <option value="UV Sterilizer">UV Sterilizer</option>
                  <option value="Auto Feeder">Auto Feeder</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>MOUNTED TANK</span>
                <select value={newEqTank} onChange={e => setNewEqTank(e.target.value)}>
                  {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>COST (₹)</span>
                <input
                  type="number"
                  min={0}
                  value={newEqCost}
                  onChange={e => setNewEqCost(e.target.value)}
                  placeholder="e.g. 14500"
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>LAST SERVICE DATE</span>
                <input
                  type="date"
                  value={newEqLast}
                  onChange={e => setNewEqLast(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)' }}>NEXT SERVICE DUE</span>
                <input
                  type="date"
                  value={newEqNext}
                  onChange={e => setNewEqNext(e.target.value)}
                  placeholder="Auto calculated if empty"
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', height: 36, background: '#FFFFFF', color: '#000000', fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 4 }}>
              Register Equipment
            </button>
          </form>
        </div>
      )}

      {/* Section 1 — Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>OVERDUE SERVICE</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: overdueCount > 0 ? '#FF6666' : '#FFFFFF', marginTop: 6 }}>
            {overdueCount}
          </div>
          <span style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 4, display: 'block' }}>
            Requires immediate check
          </span>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>DUE SOON</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: soonCount > 0 ? '#FFB800' : '#FFFFFF', marginTop: 6 }}>
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
              const statusBg = overdue ? 'rgba(255,102,102,0.15)' : soon ? 'rgba(255,184,0,0.15)' : 'transparent';
              const borderCol = overdue ? '#FF6666' : soon ? '#FFB800' : 'rgba(255,255,255,0.06)';
              const statusTextCol = overdue ? '#FF6666' : soon ? '#FFB800' : 'var(--muted)';
              const isEditing = editingEqId === e.id;

              return (
                <tr key={e.id}>
                  {/* Name */}
                  <td style={{ fontWeight: 600 }}>
                    {isEditing ? (
                      <input type="text" value={editEqName} onChange={ev => setEditEqName(ev.target.value)} style={{ height: 28, fontSize: 12 }} />
                    ) : (
                      e.name
                    )}
                  </td>

                  {/* Type */}
                  <td>
                    {isEditing ? (
                      <select value={editEqType} onChange={ev => setEditEqType(ev.target.value)} style={{ height: 28, fontSize: 12 }}>
                        <option value="Filter">Filter</option>
                        <option value="Heater">Heater</option>
                        <option value="Chiller">Chiller</option>
                        <option value="Lighting">Lighting</option>
                        <option value="UV Sterilizer">UV Sterilizer</option>
                        <option value="Auto Feeder">Auto Feeder</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      e.type
                    )}
                  </td>

                  {/* Tank */}
                  <td>
                    {isEditing ? (
                      <select value={editEqTank} onChange={ev => setEditEqTank(ev.target.value)} style={{ height: 28, fontSize: 12 }}>
                        {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
                      </select>
                    ) : (
                      <span>Tank {e.tank}</span>
                    )}
                  </td>

                  {/* Last Service */}
                  <td>
                    {isEditing ? (
                      <input type="date" value={editEqLast} onChange={ev => setEditEqLast(ev.target.value)} style={{ height: 28, fontSize: 12 }} />
                    ) : (
                      formatDate(e.lastService)
                    )}
                  </td>

                  {/* Next Due */}
                  <td>
                    {isEditing ? (
                      <input type="date" value={editEqNext} onChange={ev => setEditEqNext(ev.target.value)} style={{ height: 28, fontSize: 12 }} />
                    ) : (
                      formatDate(e.nextService)
                    )}
                  </td>

                  {/* Cost */}
                  <td>
                    {isEditing ? (
                      <input type="number" value={editEqCost} onChange={ev => setEditEqCost(ev.target.value)} style={{ height: 28, fontSize: 12, width: 80 }} />
                    ) : (
                      <span>₹{e.cost.toLocaleString('en-IN')}</span>
                    )}
                  </td>

                  {/* Status badge */}
                  <td>
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 600,
                      background: statusBg, color: statusTextCol,
                      border: `1px solid ${borderCol}`
                    }}>
                      {e.status.toUpperCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right', paddingRight: 16 }}>
                    {isEditing ? (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button onClick={() => handleSaveEdit(e.id)} style={{ padding: '4px 8px', background: '#FFFFFF', color: '#000000', fontSize: 11, fontWeight: 'bold', borderRadius: 4 }}>Save</button>
                        <button onClick={() => setEditingEqId(null)} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', fontSize: 11, borderRadius: 4 }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
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
                        <button onClick={() => handleStartEdit(e)} style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: 0 }} title="Edit">✏</button>
                      </div>
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
      </div>

    </div>
  );
}


// ─── WATER QUALITY TAB ───────────────────────────────────────────────────────

function WaterQualityTab({ waterLog, setWaterLog, tanks }) {
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [wqTank, setWqTank] = useState(tanks[0]?.id || 'A');
  const [wqPh, setWqPh] = useState('');
  const [wqTemp, setWqTemp] = useState('');
  const [wqAmmonia, setWqAmmonia] = useState('');
  const [wqSuccess, setWqSuccess] = useState(false);

  const handleLogReadingSubmit = (e) => {
    e.preventDefault();
    const phVal = parseFloat(wqPh);
    const tempVal = parseFloat(wqTemp);
    const ammoniaVal = parseFloat(wqAmmonia);

    if (isNaN(phVal) || isNaN(tempVal) || isNaN(ammoniaVal)) {
      alert("Please enter valid numeric readings.");
      return;
    }

    const newReading = {
      id: Date.now(),
      tank: wqTank,
      ph: phVal,
      temp: tempVal,
      ammonia: ammoniaVal,
      loggedBy: 'Admin',
      date: today()
    };

    setWaterLog(prev => [newReading, ...prev]);

    // Reset Form
    setWqPh('');
    setWqTemp('');
    setWqAmmonia('');
    setWqSuccess(true);
    setTimeout(() => {
      setWqSuccess(false);
      setShowLogPanel(false);
    }, 2000);
  };

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
      {/* Top row status toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Water Quality Analytics</div>
        <button
          onClick={() => setShowLogPanel(!showLogPanel)}
          style={{
            display:'flex', alignItems:'center', gap:6, padding:'9px 14px',
            background:'#FFFFFF', color:'#000000', borderRadius:8, fontWeight:700, fontSize:13,
            whiteSpace:'nowrap', border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={14} /> {showLogPanel ? 'Close Panel' : 'Log Reading'}
        </button>
      </div>

      {/* Log Reading Panel */}
      {showLogPanel && (
        <div className="card" style={{
          padding: 20,
          background: '#0D0D0D',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 12 }}>Record Water Metrics</div>
          {wqSuccess ? (
            <div style={{ color: 'var(--secondary)', fontSize: 13, fontWeight: 'bold', padding: '10px 0' }}>✓ Reading logged successfully!</div>
          ) : (
            <form onSubmit={handleLogReadingSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: 100 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>SELECT TANK</span>
                <select value={wqTank} onChange={e => setWqTank(e.target.value)} style={{ height: 34 }}>
                  {tanks.map(t => <option key={t.id} value={t.id}>{t.displayName}</option>)}
                </select>
              </div>

              <div style={{ width: 80 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>pH LEVEL</span>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 7.2"
                  value={wqPh}
                  onChange={e => setWqPh(e.target.value)}
                  style={{ height: 34 }}
                />
              </div>

              <div style={{ width: 80 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>TEMP (°C)</span>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 26"
                  value={wqTemp}
                  onChange={e => setWqTemp(e.target.value)}
                  style={{ height: 34 }}
                />
              </div>

              <div style={{ width: 100 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>AMMONIA (ppm)</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 0.0"
                  value={wqAmmonia}
                  onChange={e => setWqAmmonia(e.target.value)}
                  style={{ height: 34 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  height: 34, padding: '0 20px', background: '#FFFFFF', color: '#000000',
                  fontWeight: 'bold', borderRadius: 8, fontSize: 12, border: 'none', cursor: 'pointer'
                }}
              >
                Log Metrics
              </button>
            </form>
          )}
        </div>
      )}

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
              <div key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)' }}>Tank {w.tank} Trend</span>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -25, bottom: 2 }}>
                    <XAxis dataKey="day" tick={{ fill:'#555555', fontSize:9 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[6.0, 9.0]} tick={{ fill:'#555555', fontSize:9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="ph" stroke="#FFFFFF" fill="rgba(255,255,255,0.02)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}


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
  const [saleStep, setSaleStep] = useState(1); // 1, 2, 3, 4
  const [saleSpId, setSaleSpId] = useState('');
  const [saleAgeGroup, setSaleAgeGroup] = useState('adult');
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
    if (!selectedSp || !saleAgeGroup) return [];
    const groupStockObj = tankStock[selectedSp.id]?.[saleAgeGroup] || {};
    return Object.entries(groupStockObj).map(([tankId, count]) => ({
      tankId,
      count,
      isQuarantined: quarantinedTanks[tankId] !== undefined
    }));
  }, [selectedSp, saleAgeGroup, tankStock, quarantinedTanks]);

  // auto select tank if only one exists in sale step 3
  useEffect(() => {
    if (saleStep === 3 && saleTanks.length === 1) {
      if (!saleTanks[0].isQuarantined) {
        setSaleTankId(saleTanks[0].tankId);
        setSaleStep(4);
      }
    }
  }, [saleStep, saleTanks]);

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    const qtyVal = parseInt(saleQty, 10);
    const multiplier = AGE_GROUP_LABELS[saleAgeGroup]?.priceMultiplier ?? 1;
    const basePrice = selectedSp?.price ?? 0;
    const priceVal = parseInt(salePrice, 10) || Math.round(basePrice * multiplier);
    
    if (!qtyVal || qtyVal <= 0 || !saleBuyer.trim() || !selectedSp || !saleTankId) return;

    // verify quantity limit
    const tankMax = tankStock[selectedSp.id]?.[saleAgeGroup]?.[saleTankId] ?? 0;
    if (qtyVal > tankMax) {
      alert(`Cannot sell more than available tank stock (${tankMax} fish)`);
      return;
    }

    const totalVal = qtyVal * priceVal;

    const newSale = {
      id: Date.now(),
      speciesId: selectedSp.id,
      speciesName: selectedSp.name,
      ageGroup: saleAgeGroup,
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
      details: `${qtyVal} ${selectedSp.name} (${AGE_GROUP_LABELS[saleAgeGroup].label}) from Tank ${saleTankId} (₹${totalVal})`,
      time: 'Just now',
      date: today(),
      status: 'pending',
      total: totalVal
    };
    setWorkerSubmissions(prev => [newSub, ...prev]);

    setSaleSuccessMsg(`Sale submitted ✓ — ${qtyVal} ${selectedSp.name} (${AGE_GROUP_LABELS[saleAgeGroup].label}) from Tank ${saleTankId} for ₹${totalVal}. Waiting for admin approval.`);

    // Reset Form
    setSaleStep(1);
    setSaleSpId('');
    setSaleAgeGroup('adult');
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
                  const val = e.target.value;
                  setSaleSpId(val);
                  setSaleAgeGroup('');
                  setSaleTankId('');
                  setSaleQty('');
                  setSalePrice('');
                  if (val) {
                    setSaleStep(2);
                  } else {
                    setSaleStep(1);
                  }
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

            {/* Step 2: Pick Age Group */}
            {saleStep >= 2 && selectedSp && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>STEP 2: SELECT AGE GROUP</span>
                  <button type="button" onClick={() => { setSaleStep(1); setSaleSpId(''); }} style={{ background: 'none', border: 'none', color: '#888888', fontSize: 9, cursor: 'pointer' }}>Change Species</button>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {['adult', 'semi-adult', 'newborn'].map(ag => {
                    const stock = Object.values(tankStock[selectedSp.id]?.[ag] || {}).reduce((a, b) => a + b, 0);
                    const isAvailable = stock > 0;
                    const isSelected = saleAgeGroup === ag;
                    const multiplier = AGE_GROUP_LABELS[ag].priceMultiplier;
                    const targetPrice = Math.round(selectedSp.price * multiplier);

                    return (
                      <button
                        key={ag}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSaleAgeGroup(ag);
                          setSalePrice(targetPrice.toString());
                          setSaleTankId('');
                          setSaleStep(3);
                        }}
                        style={{
                          flex: 1, padding: '8px 4px', borderRadius: 8, textAlign: 'center',
                          background: isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.04)',
                          color: isSelected ? '#000000' : isAvailable ? '#FFFFFF' : 'var(--muted)',
                          border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          opacity: isAvailable ? 1 : 0.4,
                          cursor: isAvailable ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <div style={{ fontWeight: 'bold', fontSize: 11 }}>{AGE_GROUP_LABELS[ag].label}</div>
                        <div style={{ fontSize: 9, marginTop: 2 }}>{stock} fish</div>
                        <div style={{ fontSize: 8, color: isSelected ? '#333' : 'var(--secondary)', marginTop: 2 }}>₹{targetPrice}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Pick Tank */}
            {saleStep >= 3 && selectedSp && saleAgeGroup && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>STEP 3: SELECT TANK</span>
                  <button type="button" onClick={() => { setSaleStep(2); setSaleTankId(''); }} style={{ background: 'none', border: 'none', color: '#888888', fontSize: 9, cursor: 'pointer' }}>Change Age Group</button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {saleTanks.map(t => {
                    const isSelected = saleTankId === t.tankId;
                    const maxStockSpecies = Math.max(...saleTanks.map(tk => tk.count));
                    const isRecommended = t.count === maxStockSpecies;

                    return (
                      <button
                        key={t.tankId}
                        type="button"
                        disabled={t.isQuarantined}
                        onClick={() => {
                          setSaleTankId(t.tankId);
                          setSaleStep(4);
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
                    Tank {saleTankId} selected. You can sell up to {(tankStock[selectedSp.id]?.[saleAgeGroup]?.[saleTankId] ?? 0)} fish.
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Sale details */}
            {saleStep === 4 && selectedSp && saleAgeGroup && saleTankId && (
              <form onSubmit={handleSaleSubmit} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>STEP 4: SALE DETAILS</span>
                  <button type="button" onClick={() => { setSaleStep(3); setSaleQty(''); }} style={{ background: 'none', border: 'none', color: '#888888', fontSize: 9, cursor: 'pointer' }}>Change Tank</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <input
                      type="number"
                      required
                      min={1}
                      max={tankStock[selectedSp.id]?.[saleAgeGroup]?.[saleTankId] ?? 0}
                      placeholder={`Qty (max ${tankStock[selectedSp.id]?.[saleAgeGroup]?.[saleTankId] ?? 0})`}
                      value={saleQty}
                      onChange={e => setSaleQty(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder={`Price (₹${Math.round(selectedSp.price * AGE_GROUP_LABELS[saleAgeGroup].priceMultiplier)})`}
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
                  Total: ₹{((parseInt(saleQty, 10) || 0) * (parseInt(salePrice, 10) || Math.round(selectedSp.price * AGE_GROUP_LABELS[saleAgeGroup].priceMultiplier))).toLocaleString('en-IN')}
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
  const [workers, setWorkers] = useState(WORKERS_INIT);
  
  const [activeWorker, setActiveWorker] = useState(null);
  const [workerSubmissions, setWorkerSubmissions] = useState([]);
  
  const [view, setView] = useState('admin'); // 'admin' | 'worker'

  const [activeInvoice, setActiveInvoice] = useState(null);

  const [tanks, setTanks] = useState(TANKS_INIT);
  const [customSpecies, setCustomSpecies] = useState([]);

  // Quarantine State
  const [quarantinedTanks, setQuarantinedTanks] = useState({
    C: { reason: 'pH imbalance — monitoring', since: '2026-07-26' }
  });

  const speciesStateAll = useMemo(() => {
    return [...speciesState, ...customSpecies];
  }, [speciesState, customSpecies]);

  // Total stock for a species across all age groups and tanks
  const getSpeciesTotal = useCallback((speciesId) => {
    return Object.values(tankStock[speciesId] || {})
      .flatMap(Object.values)
      .reduce((a, b) => a + b, 0);
  }, [tankStock]);

  // Total for a species in a specific age group
  const getAgeGroupTotal = useCallback((speciesId, ageGroup) => {
    return Object.values(tankStock[speciesId]?.[ageGroup] || {}).reduce((a, b) => a + b, 0);
  }, [tankStock]);

  // Count in a specific species + age group + tank
  const getCount = useCallback((speciesId, ageGroup, tankId) => {
    return tankStock[speciesId]?.[ageGroup]?.[tankId] ?? 0;
  }, [tankStock]);

  // All age groups a species has (that have stock > 0)
  const getAgeGroupsForSpecies = useCallback((speciesId) => {
    return AGE_GROUPS.filter(ag => getAgeGroupTotal(speciesId, ag) > 0);
  }, [getAgeGroupTotal]);

  // All tanks an age group of a species is in
  const getTanksForAgeGroup = useCallback((speciesId, ageGroup) => {
    return Object.entries(tankStock[speciesId]?.[ageGroup] || {})
      .filter(([, count]) => count > 0)
      .map(([tankId, count]) => ({ tankId, count, tankData: tanks.find(t => t.id === tankId) }))
      .sort((a, b) => b.count - a.count);
  }, [tankStock, tanks]);

  // All species+ageGroups in a specific tank
  const getContentsOfTank = useCallback((tankId) => {
    const results = [];
    Object.entries(tankStock).forEach(([speciesId, ageGroups]) => {
      Object.entries(ageGroups).forEach(([ageGroup, tankCounts]) => {
        const count = tankCounts[tankId];
        if (count > 0) {
          const sp = speciesStateAll.find(s => s.id === parseInt(speciesId));
          if (sp) {
            results.push({ species: sp, ageGroup, count });
          }
        }
      });
    });
    return results.sort((a, b) => b.count - a.count);
  }, [tankStock, speciesStateAll]);

  // Total fish in a tank
  const getTankTotal = useCallback((tankId) => {
    return getContentsOfTank(tankId).reduce((a, item) => a + item.count, 0);
  }, [getContentsOfTank]);

  // Deduct stock — now requires ageGroup
  const deductStock = useCallback((speciesId, ageGroup, tankId, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [tankId]: Math.max(0, (prev[speciesId]?.[ageGroup]?.[tankId] ?? 0) - qty),
        }
      }
    }));
  }, []);

  // Add stock (births, stock-in events)
  const addStock = useCallback((speciesId, ageGroup, tankId, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [tankId]: (prev[speciesId]?.[ageGroup]?.[tankId] ?? 0) + qty,
        }
      }
    }));
  }, []);

  // Transfer between tanks (same species, same age group)
  const transferStock = useCallback((speciesId, ageGroup, fromTank, toTank, qty) => {
    setTankStock(prev => ({
      ...prev,
      [speciesId]: {
        ...prev[speciesId],
        [ageGroup]: {
          ...prev[speciesId]?.[ageGroup],
          [fromTank]: Math.max(0, (prev[speciesId]?.[ageGroup]?.[fromTank] ?? 0) - qty),
          [toTank]: (prev[speciesId]?.[ageGroup]?.[toTank] ?? 0) + qty,
        }
      }
    }));
  }, []);

  // Promote fish between age groups (e.g. newborn → semi-adult)
  const promoteStock = useCallback((speciesId, fromAge, toAge, tankId, qty) => {
    deductStock(speciesId, fromAge, tankId, qty);
    addStock(speciesId, toAge, tankId, qty);
  }, [deductStock, addStock]);

  const species = useMemo(() => {
    return speciesStateAll.map(s => ({
      ...s,
      stock: getSpeciesTotal(s.id)
    }));
  }, [speciesStateAll, getSpeciesTotal]);

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

  const totalBorn = useMemo(() => species.reduce((s, sp) => s + sp.born, 0), [species]);
  const totalExported = useMemo(() => species.reduce((s, sp) => s + sp.exported, 0), [species]);
  const totalDied = useMemo(() => species.reduce((s, sp) => s + sp.died, 0), [species]);

  // Date formatted: "27 Jul 2026"
  const formattedDate = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date('2026-07-28');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  // Log new transaction updates
  const handleConfirmLog = useCallback(({ type, species: sp, ageGroup = 'adult', tankId, count, note }) => {
    if (type === 'birth') {
      addStock(sp.id, 'newborn', tankId, count);
    } else {
      deductStock(sp.id, ageGroup, tankId, count);
    }

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
      ageGroup,
      count,
      tank: tankId,
      time: 'Just now',
      note: note || '—',
    }, ...prev]);

    // Flash KPI
    setKpiFlash(f => !f);
  }, [addStock, deductStock]);

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
  const handleAddSpeciesToTank = useCallback((spId, ageGroup, tId, count) => {
    addStock(spId, ageGroup, tId, count);

    const spName = speciesStateAll.find(s => s.id === spId)?.name || '';

    // Prepend to activity feed
    setActivity(prev => [{
      id: Date.now(),
      type: 'birth',
      species: spName,
      ageGroup,
      count,
      tank: tId,
      time: 'Just now',
      note: 'Mapped to tank stock',
    }, ...prev]);
  }, [addStock, speciesStateAll]);

  // Transfer stock action triggered by Admin UI
  const handleTransferStockAction = useCallback((spId, ageGroup, fromT, toT, count) => {
    transferStock(spId, ageGroup, fromT, toT, count);

    const spName = speciesStateAll.find(s => s.id === spId)?.name || '';

    setActivity(prev => [{
      id: Date.now(),
      type: 'transfer',
      species: spName,
      ageGroup,
      count,
      from: fromT,
      to: toT,
      time: 'Just now',
      note: `Stock reallocation`,
    }, ...prev]);
  }, [transferStock, speciesStateAll]);

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
    return species.filter(sp => sp.stock <= sp.min).length;
  }, [species]);

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
            <ErrorBoundary key={activeTab}>
              {activeTab === 'dashboard' && (
                <DashboardTab
                  key="dashboard"
                  species={species}
                  activity={activity}
                  alertRef={alertRef}
                  tanks={tanks}
                  getTankTotal={getTankTotal}
                  getContentsOfTank={getContentsOfTank}
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
                  setSpeciesState={setSpeciesState}
                  setTankStock={setTankStock}
                  tanks={tanks}
                />
              )}
              {activeTab === 'tanks' && (
                <TanksTab
                  key="tanks"
                  species={species}
                  tankStock={tankStock}
                  setTankStock={setTankStock}
                  tanks={tanks}
                  setTanks={setTanks}
                  quarantinedTanks={quarantinedTanks}
                  setQuarantinedTanks={setQuarantinedTanks}
                  onConfirmLog={handleAdminStatusLog}
                  onTransferStock={handleTransferStockAction}
                  onAddSpeciesToTank={handleAddSpeciesToTank}
                  sales={sales}
                  setActivity={setActivity}
                />
              )}
              {activeTab === 'reports' && (
                <ReportsTab key="reports" species={species} tankStock={tankStock} />
              )}
              {activeTab === 'finances' && (
                <FinancesTab
                  key="finances"
                  expenses={expenses}
                  setExpenses={setExpenses}
                  sales={sales}
                  species={species}
                  tanks={tanks}
                  onAddStock={addStock}
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
                  onDeductStock={deductStock}
                  onLogLocalToast={() => {}}
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
                  setWorkers={setWorkers}
                  workerSubmissions={workerSubmissions}
                />
              )}
              {activeTab === 'equipment' && (
                <EquipmentTab
                  key="equipment"
                  equipment={equipment}
                  setEquipment={setEquipment}
                  setExpenses={setExpenses}
                  tanks={tanks}
                />
              )}
              {activeTab === 'water' && (
                <WaterQualityTab
                  key="water"
                  waterLog={waterLog}
                  setWaterLog={setWaterLog}
                  tanks={tanks}
                />
              )}
            </ErrorBoundary>
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
