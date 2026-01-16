const express = require("express");
const organizeandsend = express.Router(); 
const  organizeAnalysis = require('../controller/organizesend.controller.js'); 

// get requeuest becase we are getting the data 
organizeandsend.get('/analysis',  organizeAnalysis); 

module.exports = organizeandsend;
