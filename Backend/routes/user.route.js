const express = require('express')
const router = express.Router();
const zod = require('zod');
const { User } = require('../db');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/user.middleware');


//sign up page

const vaild = zod.object({
    firstName : zod.string(), 
    lastName : zod.string(), 
    username : zod.string().email(), 
    password : zod.string().min(8)
})

router.post('/signup' ,async function(req, res){
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const username = req.body.username
    const password = req.body.password

    const {success} = vaild.safeParse({firstName , lastName , username ,password})
    if(!success){
        return res.status(403).json({
            msg: "Invalid credentials"
        })
    }
    const other = await User.findOne({
        username : username
    })
    if(other){
        return res.status(403).json({
            msg : "Username already taken"
        })
    }
    const user = await User.create({
        firstName : firstName, 
        lastName : lastName, 
        username : username, 
        password : password
    })
    const token = jwt.sign(username , process.env.JWT_SECRET)

    
    res.status(200).json({
        token : token, 
        msg : "User successfully created"
    })
})


// sign in page 
const signinSchema = zod.object({
    username : zod.string().email(), 
    password : zod.string().min(8)
})


router.post("/signin" , async function(req, res){
    const username  =  req.body.username 
    const password = req.body.password

    const {success} = signinSchema.safeParse({username , password});

    if(!success){
        return res.status(403).json({
            msg : "Invalid credentials"
        })
    }

    const user = await User.findOne({
        username : username, 
        password : password
    })
   
    if(user){
        const token = jwt.sign(username , process.env.JWT_SECRET);
        res.status(200).json({
            token : token, 
            user : user, 
            msg : "Signed up successfully"
        })
   
    }else{
        return res.status(403).json({
            msg : "Error occured while logging in"
        })
    }
    
})

router.post('/logout' ,authMiddleware,  function(req, res){
        req.userID = "";

        res.status(200).json({
            msg : "logged out successfully"
        })
})



module.exports =  router
