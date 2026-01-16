const express = require('express'); 
const app = express();  

// import the routes here 
const stockdataroute = require('./routes/stockdata.route.js'); 

app.use(express.json());  

//simple backend route to make sure backend is correctly running 
app.get('/', (req, res) => { 
    res.json({ 
        Server: 'Successfully Running'
    }); 
});  



module.exports = app; 