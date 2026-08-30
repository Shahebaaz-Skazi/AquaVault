const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const workers = [
  { id: 1, name: 'Rajan Patil', role: 'Senior Handler', pin: '0001' },
  { id: 2, name: 'Suresh Kamble', role: 'Tank Operator', pin: '0002' },
  { id: 3, name: 'Amol Shinde', role: 'Sales Assistant', pin: '0003' },
  { id: 4, name: 'Deepak More', role: 'Maintenance', pin: '0004' }
];

const species = [
  { id: 1, name: 'Guppy (Fancy)', price: 80, min_threshold: 50 },
  { id: 2, name: 'Arowana (Silver)', price: 3500, min_threshold: 5 },
  { id: 3, name: 'Discus (Blue)', price: 900, min_threshold: 15 },
  { id: 4, name: 'Neon Tetra', price: 60, min_threshold: 30 }
];

const tanks = [
  { id: 'A', display_name: 'Tank A', capacity: 600, temp: '26°C', ph: '7.2', type: 'Freshwater', added_date: '2024-01-10', is_quarantined: false },
  { id: 'B', display_name: 'Tank B', capacity: 120, temp: '27°C', ph: '6.8', type: 'Freshwater', added_date: '2024-01-10', is_quarantined: false },
  { id: 'C', display_name: 'Tank C', capacity: 200, temp: '28°C', ph: '6.5', type: 'Freshwater', added_date: '2024-02-15', is_quarantined: true, quarantine_reason: 'pH imbalance' }
];

const tank_stock = [
  { id: 1, species_id: 1, age_group: 'adult', tank_id: 'A', count: 80 },
  { id: 2, species_id: 1, age_group: 'adult', tank_id: 'B', count: 40 }
];

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', (req, res) => {
  const { username, password, workerId, pin } = req.body;
  if (username === 'admin' && password === 'aquavault2026') {
    return res.json({ role: 'admin' });
  }
  if (workerId && pin) {
    const worker = workers.find(w => w.id === Number(workerId) && w.pin === pin);
    if (worker) {
      return res.json({ role: 'worker', workerId: worker.id, workerName: worker.name });
    }
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/workers', (req, res) => res.json(workers));
app.get('/api/species', (req, res) => res.json(species));
app.get('/api/tanks', (req, res) => res.json(tanks));
app.get('/api/tank-stock', (req, res) => res.json(tank_stock));
app.get('/api/sales', (req, res) => res.json([]));
app.get('/api/expenses', (req, res) => res.json([]));
app.get('/api/customers', (req, res) => res.json([]));
app.get('/api/equipment', (req, res) => res.json([]));
app.get('/api/water-log', (req, res) => res.json([]));
app.get('/api/activity', (req, res) => res.json([]));
app.get('/api/feed-log', (req, res) => res.json([]));
app.get('/api/mortality-log', (req, res) => res.json([]));
app.get('/api/electricity-log', (req, res) => res.json([]));
app.get('/api/broodstock', (req, res) => res.json([]));
app.get('/api/breeding-performance', (req, res) => res.json([]));
app.get('/api/growth-record', (req, res) => res.json([]));
app.post('/api/feed-log', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.post('/api/mortality-log', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.post('/api/electricity-log', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.post('/api/broodstock', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.post('/api/breeding-performance', (req, res) => res.json({ id: Date.now(), ...req.body }));
app.post('/api/growth-record', (req, res) => res.json({ id: Date.now(), ...req.body }));

app.listen(3001, () => console.log('Mock server running on port 3001'));
