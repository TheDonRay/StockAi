const stockdata = async (req, res) => {  
     // implement the try and catch here as such 
    try { 
    // this is going to be a body request depending on what the user inputs as a ticketer of the stock they want.  
    // start of with a base case here as such 
    const { stockTicketer } = req.body;  

    if (!stockTicketer || stockTicketer.trim() === ''){ 
        return res.status(400).json({ 
            Error: 'Invalid stockTicketer or no stockTicketer inputed from request made'
        }); 
    }  

    const buildParameters = new URLSearchParams({ 
        access_key: process.env.MARKET_STACK_APIKEY, 
        symbols: stockTicketer
    }); 

    const MarketStackURL = `https://api.marketstack.com/v2/eod?${buildParameters}`; 
    // implement the backend function to actually handle the request 
    const getdataExternalAPI = await fetch(MarketStackURL);  
    const response = await getdataExternalAPI.json(); 

    if (response.error){ 
        return res.status(400).json({ 
            errorFetchin: response.error.message 
        }); 
    } 

    //send the res here 
    return res.status(200).json({ 
        externalAPiResponse: response
    }); 
   
    } catch (error) { 
        
    }
    
} 

module.exports = stockdata; 