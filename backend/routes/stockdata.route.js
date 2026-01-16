const express = require('express');  
const stockdata = express.Router();    
//import the controller 
const stockdatacontroller = require('../controller/stockdata.controller.js'); 

// Im sending a post request because: even those the external api gets teh data using a get request we still need to send in the URL parameters and create the query string hence why im sending it as a POST request. 
stockdata.post('/stockdata', stockdatacontroller); 

module.exports = stockdata; 