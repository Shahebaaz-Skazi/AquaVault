// Frontend API service for AquaVault

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getJSON = (url) => fetch(url).then(r => {
  if (!r.ok) throw new Error('API request failed');
  return r.json();
});

const postJSON = (url, data) => fetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: { 'Content-Type': 'application/json' }
}).then(r => {
  if (!r.ok) throw new Error('API request failed');
  return r.json();
});

const putJSON = (url, data) => fetch(url, {
  method: 'PUT',
  body: JSON.stringify(data),
  headers: { 'Content-Type': 'application/json' }
}).then(r => {
  if (!r.ok) throw new Error('API request failed');
  return r.json();
});

const deleteJSON = (url) => fetch(url, {
  method: 'DELETE'
}).then(r => {
  if (!r.ok) throw new Error('API request failed');
  return r.json();
});

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
