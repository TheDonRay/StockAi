import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

export default function Dashboard() {
  
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [brokerResponse, setBrokerResponse] = useState('');
  const [error, setError] = useState('');
  const [searchedTicker, setSearchedTicker] = useState(''); 
  

  const exampleTickers = ['AAPL', 'GOOG', 'NFLX', 'TSLA', 'AMZN'];

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  }

  const handleTickerClick = (ticker) => {
    setUserInput(ticker);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBrokerResponse('');
    setLoading(true);

    if (userInput.trim() === ''){
      setError('Please enter a stock ticker.');
      setLoading(false);
      return;
    }

    if (userInput.length >= 5){
      setError('Please enter a valid stock ticker (max 4 characters).');
      setLoading(false);
      return;
    }

    try { // note below this is what we are sending to the backend which is a req.query backend sending response where it handles query params from the URL itself. 
      const sendToBackend = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/analysis?stockTicketer=${userInput}`, {
        method: 'GET',
        headers: {
          "Content-Type" : "application/json"
        },
      });

      if (!sendToBackend.ok){
        setError('Failed to fetch analysis. Please try again.');
        setLoading(false);
        return;
      }

      const stockData = await sendToBackend.json();

      if (!stockData){
        setError('No data received from the server.');
        return;
      }

      setBrokerResponse(stockData.Broker);
      setSearchedTicker(userInput.toUpperCase());

    } catch (error) {
      setError('Could not connect to the server. Please try again later.'); 
      console.error('Error getting data from the backend', error); 
    } finally {
      setLoading(false);
    }
  }

  return(
    <div className='dashboard-container'>
      <div className='heading-div'>
        <h1 className='dashtitle'>Ready to Invest, <span>{username}</span>?</h1>
        <p className='dash-subtitle'>Get AI-powered stock analysis in seconds</p>
      </div>

      <div className='dashboard-content'>
        <div className='userinputcontainer'>
          <div className='search-card'>
            <div className='search-card-header'>
              <div className='search-icon'>&#x1F50D;</div>
              <span className='search-card-title'>Stock Lookup</span>
            </div>
            <label className='search-label'>
              Enter a ticker symbol to get Broker's analysis
            </label>
            <form onSubmit={handleSubmit}>
              <div className='search-input-wrapper'>
                <input
                  type='text'
                  className='stock-input'
                  placeholder='e.g. AAPL, GOOG, TSLA'
                  value={userInput}
                  onChange={handleUserInput}
                  disabled={loading}
                />
                <button type='submit' className='search-btn' disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </form>
            <div className='ticker-examples'>
              <span className='ticker-examples-label'>Popular:</span>
              {exampleTickers.map((ticker) => (
                <span
                  key={ticker}
                  className='ticker-tag'
                  onClick={() => !loading && handleTickerClick(ticker)}
                >
                  {ticker}
                </span>
              ))}
            </div>

            {error && (
              <div className='error-banner'>
                <span className='error-icon'>&#x26A0;</span>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='response-container'>
        {loading && (
          <div className='response-card'>
            <div className='loading-state'>
              <div className='loading-spinner'></div>
              <p className='loading-text'>Analyzing {userInput.toUpperCase()}...</p>
              <p className='loading-subtext'>Broker is reviewing market data</p>
            </div>
          </div>
        )}

        {!loading && brokerResponse && (
          <div className='response-card'>
            <div className='response-header'>
              <span className='response-ticker'>{searchedTicker}</span>
              <span className='response-label'>Broker Analysis</span>
            </div>
            <div className='response-body'>
              {brokerResponse}
            </div>
          </div>
        )}

        {!loading && !brokerResponse && !error && (
          <div className='response-card empty-state'>
            <div className='empty-icon'>&#x1F4C8;</div>
            <p className='empty-title'>No analysis yet</p>
            <p className='empty-subtext'>Search for a stock ticker above to get Broker's AI-powered market analysis</p>
          </div>
        )}
      </div>
    </div>
  )
}