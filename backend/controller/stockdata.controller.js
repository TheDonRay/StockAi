const stockdata = async (req, res) => {   
    // if you are wondering its like server to server communication in a way where it seems like we are making a frontend call but in our backend. 
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

    if (!getdataExternalAPI.ok){ 
        return res.status(getdataExternalAPI.status).json({ 
            error: "Failed to fetch from the external API"
        }); 
    }

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
        console.error('Error retrieving the data from externalAPI', error);  
        res.status(500).json({ 
            Error: 'Internal Error fetching data from Market Stack'
        }); 
    }
} 

module.exports = stockdata; 