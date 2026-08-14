const SUPPORTED_CURRENCIES = ['USD', 'GBP', 'EUR', 'XAF', 'NGN', 'CAD'];

let cachedRates = null;
let cachedAt = 0;
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours — rates don't need to be more real-time than this

const fetchRates = async () => {
  const now = Date.now();
  if (cachedRates && now - cachedAt < CACHE_DURATION_MS) {
    return cachedRates;
  }

  const response = await fetch('https://open.er-api.com/v6/latest/USD');
  const data = await response.json();

  if (data.result !== 'success') {
    throw new Error('Currency provider returned an error');
  }

  const rates = {};
  for (const code of SUPPORTED_CURRENCIES) {
    rates[code] = data.rates[code];
  }

  cachedRates = { base: 'USD', rates, lastUpdated: data.time_last_update_utc };
  cachedAt = now;
  return cachedRates;
};

module.exports = { fetchRates, SUPPORTED_CURRENCIES };