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
        // now call the map function to organize the data into a new array. 
        const organizedStockData = stockData.data?.map((stock) => ({ 
            dailyDifference: stock.close - stock.open,
            dailyChangePercent: ((stock.close - stock.open) / stock.open * 100).toFixed(2),
            //volatility 
            dailyRange: stock.high - stock.low,
            volatilityPercent: ((stock.high - stock.low) / stock.open * 100).toFixed(2), 
            //volume strength 
            volumeInMillions: (stock.volume / 1000000).toFixed(2),
            //Price p osition in daily range 
            closedNearHigh: ((stock.close - stock.low) / (stock.high - stock.low) * 100).toFixed(0)
        })) || [];  
        // just to make sure its correctly calculating it as such  
        //send data to open ai now with a strong prompt.  
        const Broker = await client.chat.completions.create({ 
            model: "gpt-5-nano", 
            messages: [ 
                { 
                    role: 'system', 
                    content: 'Analyze the provided stock data and determine whether the stock is a good investment based on the calculations made from organizing the data. Include a clear recommendation, key risks, and whether investing is advisable. If applicable, suggest a reasonable investment amount based on the analysis.'
                }, 
                {  
                    role: 'user', 
                    // turned the json data into string data since the content needs to be a string as well. 
                    content: `Here is the stock data:\n${JSON.stringify(organizedStockData, null, 2)}`
                }
            ]
        }); 

        return res.status(200).json({ 
            Broker: Broker.choices[0].message.content
        }); 

    } catch (error) { 
        console.error('Error organizing the data', error); 
        return res.status(500).json({ 
            error: 'Failed to organize stock data'
        }); 
    }
} 

module.exports = organizeAnalysis; 