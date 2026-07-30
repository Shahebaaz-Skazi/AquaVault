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
  try {
    const { username, password, workerId, pin } = req.body;
    if (username === 'admin' && password === 'aquavault2026') {
      return res.json({ role: 'admin' });
    }
    if (workerId && pin) {
      const { data: worker, error } = await supabase.from('workers').select('*').eq('id', workerId).eq('pin', pin).maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      if (worker) {
        return res.json({ role: 'worker', workerId: worker.id, workerName: worker.name });
      }
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Species
app.get('/api/species', async (req, res) => {
  try {
    const { data, error } = await supabase.from('species').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/species', async (req, res) => {
  try {
    const { data, error } = await supabase.from('species').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.patch('/api/species/:id/price', async (req, res) => {
  try {
    const { price } = req.body;
    const { data, error } = await supabase.from('species').update({ price }).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tank Stock
app.get('/api/tank-stock', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tank_stock').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/tank-stock/update', async (req, res) => {
  try {
    const { species_id, age_group, tank_id, count } = req.body;
    const { data: existing, error: findError } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', tank_id).maybeSingle();
    if (findError) return res.status(500).json({ error: findError.message });
    
    if (existing) {
      const { data, error } = await supabase.from('tank_stock').update({ count }).eq('id', existing.id).select();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data ? data[0] : null);
    } else {
      const { data, error } = await supabase.from('tank_stock').insert([{ species_id, age_group, tank_id, count }]).select();
      if (error) return res.status(500).json({ error: error.message });
      res.json(data ? data[0] : null);
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/tank-stock/transfer', async (req, res) => {
  try {
    const { species_id, from_tank_id, to_tank_id, age_group, qty } = req.body;
    const { data: fromStock, error: fromError } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', from_tank_id).maybeSingle();
    if (fromError) return res.status(500).json({ error: fromError.message });

    if (fromStock) {
      const { error } = await supabase.from('tank_stock').update({ count: Math.max(0, fromStock.count - qty) }).eq('id', fromStock.id);
      if (error) return res.status(500).json({ error: error.message });
    }
    const { data: toStock, error: toError } = await supabase.from('tank_stock').select('*').eq('species_id', species_id).eq('age_group', age_group).eq('tank_id', to_tank_id).maybeSingle();
    if (toError) return res.status(500).json({ error: toError.message });

    if (toStock) {
      const { error } = await supabase.from('tank_stock').update({ count: toStock.count + qty }).eq('id', toStock.id);
      if (error) return res.status(500).json({ error: error.message });
    } else {
      const { error } = await supabase.from('tank_stock').insert([{ species_id, age_group, tank_id: to_tank_id, count: qty }]);
      if (error) return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Tanks
app.get('/api/tanks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tanks').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/tanks', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.added_date) {
      payload.added_date = new Date().toISOString().split('T')[0];
    }
    const { data, error } = await supabase.from('tanks').insert([payload]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/tanks/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tanks').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/tanks/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tanks').delete().eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sales
app.get('/api/sales', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sales').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/sales', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.date) {
      payload.date = new Date().toISOString().split('T')[0];
    }
    const { data, error } = await supabase.from('sales').insert([payload]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/sales/:id/approve', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sales').update({ approved: true }).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/sales/:id/pay', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sales').update({ pay_status: 'paid' }).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').delete().eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Workers
app.get('/api/workers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('workers').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/workers', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.pin) {
      payload.pin = Math.floor(1000 + Math.random() * 9000).toString();
    }
    const { data, error } = await supabase.from('workers').insert([payload]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/workers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('workers').delete().eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const { data, error } = await supabase.from('equipment').select('*').order('id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/equipment', async (req, res) => {
  try {
    const { data, error } = await supabase.from('equipment').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/equipment/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('equipment').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Water Log
app.get('/api/water-log', async (req, res) => {
  try {
    const { data, error } = await supabase.from('water_log').select('*').order('id', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/water-log', async (req, res) => {
  try {
    const { data, error } = await supabase.from('water_log').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Activity
app.get('/api/activity', async (req, res) => {
  try {
    const { data, error } = await supabase.from('activity').select('*').order('id', { ascending: false }).limit(50);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/activity', async (req, res) => {
  try {
    const { data, error } = await supabase.from('activity').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data ? data[0] : null);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
