// To prevent Render free tier sleep:
// Go to cron-job.org, create a free account
// Add a new cron job pointing to YOUR_RENDER_URL/health
// Set interval to every 10 minutes
// This keeps the server awake 24/7 for free

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
app.post('/api/auth/login', async (req, res) => {
  const { username, password, workerId, pin } = req.body;
  if (username === 'admin' && password === 'aquavault2026') {
    return res.json({ role: 'admin' });
  }
  if (workerId && pin) {
    const { data: worker } = await supabase.from('workers').select('*').eq('id', workerId).eq('pin', pin).maybeSingle();
    if (worker) {
      return res.json({ role: 'worker', workerId: worker.id, workerName: worker.name });
    }
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Species
app.get('/api/species', async (req, res) => {
  const { data } = await supabase.from('species').select('*').order('id', { ascending: true });
  res.json(data || []);
});
app.post('/api/species', async (req, res) => {
  const { data } = await supabase.from('species').insert([req.body]).select();
  res.json(data ? data[0] : null);
});

// Tank Stock
app.get('/api/tank-stock', async (req, res) => {
  const { data } = await supabase.from('tank_stock').select('*');
  res.json(data || []);
});
app.post('/api/tank-stock/update', async (req, res) => {
  const { species_id, age_group, tank_id, count } = req.body;
  const { data: existing } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', tank_id).maybeSingle();
  if (existing) {
    const { data } = await supabase.from('tank_stock').update({ count }).eq('id', existing.id).select();
    res.json(data ? data[0] : null);
  } else {
    const { data } = await supabase.from('tank_stock').insert([{ species_id, age_group, tank_id, count }]).select();
    res.json(data ? data[0] : null);
  }
});
app.post('/api/tank-stock/transfer', async (req, res) => {
  const { species_id, from_tank_id, to_tank_id, age_group, qty } = req.body;
  const { data: fromStock } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', from_tank_id).maybeSingle();
  if (fromStock) {
    await supabase.from('tank_stock').update({ count: Math.max(0, fromStock.count - qty) }).eq('id', fromStock.id);
  }
  const { data: toStock } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', to_tank_id).maybeSingle();
  if (toStock) {
    await supabase.from('tank_stock').update({ count: toStock.count + qty }).eq('id', toStock.id);
  } else {
    await supabase.from('tank_stock').insert([{ species_id, age_group, tank_id: to_tank_id, count: qty }]);
  }
  res.json({ success: true });
});

// Tanks
app.get('/api/tanks', async (req, res) => {
  const { data } = await supabase.from('tanks').select('*').order('id', { ascending: true });
  res.json(data || []);
});
app.post('/api/tanks', async (req, res) => {
  const { data } = await supabase.from('tanks').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.put('/api/tanks/:id', async (req, res) => {
  const { data } = await supabase.from('tanks').update(req.body).eq('id', req.params.id).select();
  res.json(data ? data[0] : null);
});
app.delete('/api/tanks/:id', async (req, res) => {
  const { data } = await supabase.from('tanks').delete().eq('id', req.params.id).select();
  res.json(data || []);
});

// Sales
app.get('/api/sales', async (req, res) => {
  const { data } = await supabase.from('sales').select('*').order('id', { ascending: false });
  res.json(data || []);
});
app.post('/api/sales', async (req, res) => {
  const { data } = await supabase.from('sales').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.put('/api/sales/:id/approve', async (req, res) => {
  const { data } = await supabase.from('sales').update({ approved: true }).eq('id', req.params.id).select();
  res.json(data ? data[0] : null);
});
app.put('/api/sales/:id/pay', async (req, res) => {
  const { data } = await supabase.from('sales').update({ pay_status: 'paid' }).eq('id', req.params.id).select();
  res.json(data ? data[0] : null);
});

// Expenses
app.get('/api/expenses', async (req, res) => {
  const { data } = await supabase.from('expenses').select('*').order('id', { ascending: false });
  res.json(data || []);
});
app.post('/api/expenses', async (req, res) => {
  const { data } = await supabase.from('expenses').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.delete('/api/expenses/:id', async (req, res) => {
  const { data } = await supabase.from('expenses').delete().eq('id', req.params.id).select();
  res.json(data || []);
});

// Customers
app.get('/api/customers', async (req, res) => {
  const { data } = await supabase.from('customers').select('*').order('id', { ascending: true });
  res.json(data || []);
});
app.post('/api/customers', async (req, res) => {
  const { data } = await supabase.from('customers').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.put('/api/customers/:id', async (req, res) => {
  const { data } = await supabase.from('customers').update(req.body).eq('id', req.params.id).select();
  res.json(data ? data[0] : null);
});

// Workers
app.get('/api/workers', async (req, res) => {
  const { data } = await supabase.from('workers').select('*').order('id', { ascending: true });
  res.json(data || []);
});
app.post('/api/workers', async (req, res) => {
  const { data } = await supabase.from('workers').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.delete('/api/workers/:id', async (req, res) => {
  const { data } = await supabase.from('workers').delete().eq('id', req.params.id).select();
  res.json(data || []);
});

// Equipment
app.get('/api/equipment', async (req, res) => {
  const { data } = await supabase.from('equipment').select('*').order('id', { ascending: true });
  res.json(data || []);
});
app.post('/api/equipment', async (req, res) => {
  const { data } = await supabase.from('equipment').insert([req.body]).select();
  res.json(data ? data[0] : null);
});
app.put('/api/equipment/:id', async (req, res) => {
  const { data } = await supabase.from('equipment').update(req.body).eq('id', req.params.id).select();
  res.json(data ? data[0] : null);
});

// Water Log
app.get('/api/water-log', async (req, res) => {
  const { data } = await supabase.from('water_log').select('*').order('id', { ascending: false });
  res.json(data || []);
});
app.post('/api/water-log', async (req, res) => {
  const { data } = await supabase.from('water_log').insert([req.body]).select();
  res.json(data ? data[0] : null);
});

// Activity
app.get('/api/activity', async (req, res) => {
  const { data } = await supabase.from('activity').select('*').order('id', { ascending: false }).limit(50);
  res.json(data || []);
});
app.post('/api/activity', async (req, res) => {
  const { data } = await supabase.from('activity').insert([req.body]).select();
  res.json(data ? data[0] : null);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
