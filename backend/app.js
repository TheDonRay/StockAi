const express = require("express");
const app = express(); 
const cors = require('cors'); 

// import the routes here
const stockdataroute = require("./routes/stockdata.route.js");
const organizeSend = require("./routes/organizesend.route.js"); 
const users = require('./routes/userloginsignup.route.js');  


app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://itsbroker.vercel.app"
  ]
}));

//simple backend route to make sure backend is correctly running
app.get("/", (req, res) => {
  res.json({
    Server: "Successfully Running",
  });
});

//instantiate the route
app.use("/api/v1/", stockdataroute);

app.use("/api/v1/", organizeSend);
app.use("/api/v1", users);  

module.exports = app;
