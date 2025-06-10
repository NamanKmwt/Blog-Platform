const jwt = require('jsonwebtoken')
require('dotenv').config();

function authMiddleware(req , res, next){
    const token = req.headers.authorization

    if(!token){
        return res.status(403).json({
            msg : "No token found"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.userID = decoded;
        if(decoded){
            next()
        }
    } catch (error) {
        return res.status(403).json({
            msg : "Incorrect token"
        })
    }
}



module.exports = {
    authMiddleware
}