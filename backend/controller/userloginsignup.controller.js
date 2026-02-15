//import the model here as such 
require('dotenv').config();
const userModel = require('../model/user.model.js');  
//import the JWT auth stuff here as such 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt');  
const SK = process.env.JWT_SECRET_KEY; //this is for the secret key. 

const usersignup = async (req, res) => { 
    // get the details from the users as such 
    try {  
        const { username, password } = req.body;  
        // base case 
        if (!username || username.trim() === '' || !password || password.trim() === ''){ 
            return res.status(400).json({ 
                error: 'Not a valid username or password'
            }); 
        }  

        // find it in the database if there isnt then we can create it and push it into the database. 
        const existinguser = await userModel.findOne({ Username: username }); 

        if (existinguser){ 
            return res.status(400).json({ 
                error: 'User already exists'
            }); 
        } 

        // hash the password using bycrypt 
        const hashedPass = await bcrypt.hash(password, 10);  
        //create a new user here 
        const newUser = new userModel({ 
            Username: username, 
            Password: hashedPass
        }); 

        await newUser.save(); //wait for the connection tos ave 

        //generate jwt token using the .sign method and passing in your payload 
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.Username },   
            SK, //this is for the secret token this is basically the payload. 
        ); 
        
        res.status(201).json({ 
            message: "Success, User created successfully", 
            token: token,
            user: { id: newUser._id, username: newUser.Username}
        }); 
    } catch (error) { 
        res.status(500).json({ 
            error: error.message
        }); 
    }
} 

const userlogin = async (req, res) => { 
    // get the details from the users as such 
    try {  
        const { username, password } = req.body;  
        // base case 
        if (!username || username.trim() === '' || !password || password.trim() === ''){ 
            return res.status(400).json({ 
                error: 'Not a valid username or password'
            }); 
        }  

        // find the user in the database 
        const user = await userModel.findOne({ Username: username }); 

        if (!user){ 
            return res.status(401).json({ 
                error: 'Invalid username or password'
            }); 
        } 

        // compare the password with the hashed password using bcrypt 
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Invalid username or password'
            }); 
        }

        //generate jwt token using the .sign method and passing in your payload 
        const token = jwt.sign(
            { userId: user._id, username: user.Username },   
            SK, //this is for the secret token this is basically the payload. 
            { expiresIn: '2h'}
        ); 
        
        res.status(200).json({ 
            message: "Success, User logged in successfully", 
            token: token,
            user: { id: user._id, username: user.Username}
        }); 
    } catch (error) { 
        res.status(500).json({ 
            error: error.message
        }); 
    }
} 

module.exports = { usersignup, userlogin }; 