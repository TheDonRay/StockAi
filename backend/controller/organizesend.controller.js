//import the data from the service folder that calls the external api here as such
const { fetchStockData } = require("../services/marketstack.service.js");
const OpenAi = require('openai'); 
const client = new OpenAi({ 
    apiKey: process.env.OPENAI_KEY
}); 

const organizeAnalysis = async (req, res) => { 
    // first i want to set up a try and catch case here  
    try {
        // i need to get the query parameter since its a get request to get the actual data 
        const { stockTicketer } = req.query; 
        if (!stockTicketer || stockTicketer.trim() === ""){
            return res.status(400).json({ 
                Error: 'Stock ticketer is required'
            }); 
        } 

        // now we can get the stock data here as such 
        const stockData = await fetchStockData(stockTicketer); 
        // now call the map function to organize the data  
        const organizedStockData = stockData.data?.map((stock) => { 
            dailyDifference: stock.close - stock.open
            dailyChangePercent: ((stock.close - stock.open) / stock.open * 100).toFixed(2)
            //volatility 
            dailyRange: stock.high - stock.low
            volatilityPercent: ((stock.high - stock.low) / stock.open * 100).toFixed(2), 
            //volume strength 
            volumeInMillions: (stock.volume / 1000000).toFixed(2) 
            //Price p osition in daily range 
            closedNearHigh: ((stock.close - stock.low) / (stock.high - stock.low) * 100).toFixed(0)
        })
    } catch (error) { 

    }
} 

module.exports = organizeAnalysis; 