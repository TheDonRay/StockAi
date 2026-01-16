const fetchStockData = async (stockTicketer) => {
  const buildParameters = new URLSearchParams({
    access_key: process.env.MARKET_STACK_APIKEY,
    symbols: stockTicketer,
  });

  const MarketStackURL = `https://api.marketstack.com/v2/eod?${buildParameters}`;
  const externalAPI = await fetch(MarketStackURL);

  if (!externalAPI.ok) {
    throw new Error(`API returned status ${externalAPI.status}`);
  }

  const externalAPIresponse = await externalAPI.json();

  if (externalAPIresponse.error) {
    throw new Error(externalAPIresponse.error.message);
  }

  return externalAPIresponse;
};

module.exports = { fetchStockData };
