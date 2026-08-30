// Frontend API service for AquaVault

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let onErrorListener = null;
export const registerErrorListener = (listener) => {
  onErrorListener = listener;
};

const getJSON = async (url) => {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('API request failed');
    return await r.json();
  } catch (err) {
    if (onErrorListener) onErrorListener(err);
    throw { message: err.message || 'Network error', status: 500 };
  }
};

const postJSON = async (url, data) => {
  try {
    const r = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!r.ok) throw new Error('API request failed');
    return await r.json();
  } catch (err) {
    if (onErrorListener) onErrorListener(err);
    throw { message: err.message || 'Network error', status: 500 };
  }
};

const putJSON = async (url, data) => {
  try {
    const r = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!r.ok) throw new Error('API request failed');
    return await r.json();
  } catch (err) {
    if (onErrorListener) onErrorListener(err);
    throw { message: err.message || 'Network error', status: 500 };
  }
};

const deleteJSON = async (url) => {
  try {
    const r = await fetch(url, {
      method: 'DELETE'
    });
    if (!r.ok) throw new Error('API request failed');
    return await r.json();
  } catch (err) {
    if (onErrorListener) onErrorListener(err);
    throw { message: err.message || 'Network error', status: 500 };
  }
};

// Authentication
export const login = (credentials) => postJSON(`${BASE_URL}/api/auth/login`, credentials);

// Species
export const getSpecies = () => getJSON(`${BASE_URL}/api/species`);
export const addSpecies = (data) => postJSON(`${BASE_URL}/api/species`, data);

// Tank Stock
export const getTankStock = () => getJSON(`${BASE_URL}/api/tank-stock`);
export const updateTankStock = (data) => postJSON(`${BASE_URL}/api/tank-stock/update`, data);
export const transferTankStock = (data) => postJSON(`${BASE_URL}/api/tank-stock/transfer`, data);

// Tanks
export const getTanks = () => getJSON(`${BASE_URL}/api/tanks`);
export const addTank = (data) => postJSON(`${BASE_URL}/api/tanks`, data);
export const updateTank = (id, data) => putJSON(`${BASE_URL}/api/tanks/${id}`, data);
export const deleteTank = (id) => deleteJSON(`${BASE_URL}/api/tanks/${id}`);

// Sales
export const getSales = () => getJSON(`${BASE_URL}/api/sales`);
export const addSale = (data) => postJSON(`${BASE_URL}/api/sales`, data);
export const approveSale = (id) => putJSON(`${BASE_URL}/api/sales/${id}/approve`, {});
export const paySale = (id) => putJSON(`${BASE_URL}/api/sales/${id}/pay`, {});

// Expenses
export const getExpenses = () => getJSON(`${BASE_URL}/api/expenses`);
export const addExpense = (data) => postJSON(`${BASE_URL}/api/expenses`, data);
export const deleteExpense = (id) => deleteJSON(`${BASE_URL}/api/expenses/${id}`);

// Customers
export const getCustomers = () => getJSON(`${BASE_URL}/api/customers`);
export const addCustomer = (data) => postJSON(`${BASE_URL}/api/customers`, data);
export const updateCustomer = (id, data) => putJSON(`${BASE_URL}/api/customers/${id}`, data);

// Workers
export const getWorkers = () => getJSON(`${BASE_URL}/api/workers`);
export const addWorker = (data) => postJSON(`${BASE_URL}/api/workers`, data);
export const deleteWorker = (id) => deleteJSON(`${BASE_URL}/api/workers/${id}`);

// Equipment
export const getEquipment = () => getJSON(`${BASE_URL}/api/equipment`);
export const addEquipment = (data) => postJSON(`${BASE_URL}/api/equipment`, data);
export const updateEquipment = (id, data) => putJSON(`${BASE_URL}/api/equipment/${id}`, data);

// Water Log
export const getWaterLogs = () => getJSON(`${BASE_URL}/api/water-log`);
export const addWaterLog = (data) => postJSON(`${BASE_URL}/api/water-log`, data);

// Activity
export const getActivity = () => getJSON(`${BASE_URL}/api/activity`);
export const addActivity = (data) => postJSON(`${BASE_URL}/api/activity`, data);

// Version
export const getAppVersion = () => getJSON(`${BASE_URL}/api/app-version`);

export const updateSpeciesPrice = (id, price) => fetch(BASE_URL + '/api/species/' + id + '/price', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: Number(price) })
}).then(r => r.json());

// Feed Log
export const getFeedLog = () => getJSON(`${BASE_URL}/api/feed-log`);
export const addFeedLog = (data) => postJSON(`${BASE_URL}/api/feed-log`, data);
export const deleteFeedLog = (id) => deleteJSON(`${BASE_URL}/api/feed-log/${id}`);

// Mortality Log
export const getMortalityLog = () => getJSON(`${BASE_URL}/api/mortality-log`);
export const addMortalityLog = (data) => postJSON(`${BASE_URL}/api/mortality-log`, data);

// Electricity Log
export const getElectricityLog = () => getJSON(`${BASE_URL}/api/electricity-log`);
export const addElectricityLog = (data) => postJSON(`${BASE_URL}/api/electricity-log`, data);
export const deleteElectricityLog = (id) => deleteJSON(`${BASE_URL}/api/electricity-log/${id}`);

// Broodstock
export const getBroodstock = () => getJSON(`${BASE_URL}/api/broodstock`);
export const addBroodstock = (data) => postJSON(`${BASE_URL}/api/broodstock`, data);
export const updateBroodstock = (id, data) => putJSON(`${BASE_URL}/api/broodstock/${id}`, data);
export const deleteBroodstock = (id) => deleteJSON(`${BASE_URL}/api/broodstock/${id}`);

// Breeding Performance
export const getBreedingPerformance = () => getJSON(`${BASE_URL}/api/breeding-performance`);
export const addBreedingPerformance = (data) => postJSON(`${BASE_URL}/api/breeding-performance`, data);
export const deleteBreedingPerformance = (id) => deleteJSON(`${BASE_URL}/api/breeding-performance/${id}`);

// Growth Record
export const getGrowthRecord = () => getJSON(`${BASE_URL}/api/growth-record`);
export const addGrowthRecord = (data) => postJSON(`${BASE_URL}/api/growth-record`, data);
export const deleteGrowthRecord = (id) => deleteJSON(`${BASE_URL}/api/growth-record/${id}`);

