const { fetchRates, SUPPORTED_CURRENCIES } = require('../services/currencyService');

const getRates = async (req, res) => {
  try {
    const data = await fetchRates();
    res.status(200).json(data);
  } catch (err) {
    console.error('Get currency rates error:', err.message);
    // fail gracefully — if the external API is down, fall back to USD-only so the app still works
    res.status(200).json({
      base: 'USD',
      rates: Object.fromEntries(SUPPORTED_CURRENCIES.map((c) => [c, c === 'USD' ? 1 : null])),
      lastUpdated: null,
      degraded: true,
    });
  }
};

module.exports = { getRates };