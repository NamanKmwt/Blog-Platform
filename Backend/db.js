const mongoose = require('mongoose');
require("dotenv").config()


mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)

const userSchema = mongoose.Schema({
    firstName : {
        type : String, 
        required : true
    }, 
    lastName : {
        type : String , 
        required : true
    }, 
    username : {
        type : String, 
        required : true
    }, 
    password : {
        type : String, 
        required : true
    }
})

const postSchema = mongoose.Schema({
    title :{
        type : String , 
        required : true, 
    }, 
    username : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User', 
        required: true
    },
    content : {
        type : String , 
        required : true
    }, 
    isEditable : {
        type : Boolean,
        default : false
    }, 
    upvote : {
        type : Number, 
        default : 0
    }, 
    downvote : {
        type : Number, 
        default : 0
    }
})

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post' , postSchema)

module.exports = { User  , Post }