const express = require('express');
const { authMiddleware } = require('../middleware/user.middleware');
const router = express.Router();
const zod = require('zod');
const { Post, User } = require('../db');

const postSchema = zod.object({
    userid : zod.string().email(), 
    title : zod.string().min(1), 
    content : zod.string().min(1), 
})

router.post('/create', authMiddleware ,async function(req , res){
    const userid = req.userID;
    if(!userid){
        return res.status(403).json({
            msg : "No token found"
        })
    }
    const title = req.body.title 
    const content = req.body.content

    const {success} = postSchema.safeParse({userid , title , content})
    if(!success){
        return res.status(403).json({
            msg : "Incorrect input format"
        })
    }

    const user = await User.findOne({
        username : userid
    })
    if(!user){
        return res.status(403).json({
            msg : "User doesn't exist"
        })
    }

    const post = await Post.create({
        username : user._id, 
        title : title , 
        content : content, 
        isEditable : true
    })
    

    res.status(200).json({
        post  :post , 
        msg : "success creation"
    })
})  

const updatePost = zod.object({
    title : zod.string().min(1), 
    content : zod.string().min(1)
})

router.put('/update' , authMiddleware, async function(req, res){
    const postId = req.body.postId;
    const title = req.body.title
    const content = req.body.content
    const userid  = req.userID
    
    if(!postId){
        return res.status(403).json({
            msg : "Post doesn't exist"
        })
    }


    const {success} = updatePost.safeParse({title ,content});

    if(!success){
        return res.status(403).json({
            msg : "Incorrect input format"
        })
    }
    
    

    const post = await Post.findOne({_id : postId});
    if(!post){
        return res.status(403).json({
            msg : "Didn't able to find post"
        })
    }
    const user = await User.findOne({username : userid});
    
    const postUser = JSON.stringify(post.username);
    const postUserId = JSON.stringify(user._id);
    console.log(postUser)
    console.log(postUserId)

    if(postUser != postUserId){
        return res.status(403).json({
            msg : "post is created by other user hence can't be updated"
        })
    }


    await Post.updateOne({_id : postId} , {
        "$set" :{
            title : title , 
            content : content
        }
    })

    res.status(200).json({
        msg: "post updated successfully"
    })
})

router.put('/upvote' , authMiddleware ,async function(req, res){
        const postId = req.body.postId
        const inc = req.body.inc
        if(!postId){
        return res.status(403).json({
            msg : "Post doesn't exist"
        })
    }
    const post = await Post.findOne({_id : postId});
    if(!post){
        return res.status(403).json({
            msg : "Didn't able to find post"
        })
    }
    const count = post.upvote ;
    if(inc == true){
        await Post.updateOne({_id : post._id} , {
            "$set":{
                upvote : count + 1
            }
        })
    }else{
        await Post.updateOne({_id : post._id} , {
            "$set":{
               upvote :count-1
            }
        })
    }

    res.status(200).json({
        upvote : post.upvote, 
        msg : "interaction recorded"
    })
})

router.put('/downvote' , authMiddleware ,async function(req, res){
        const postId = req.body.postId
        const inc = req.body.inc
        if(!postId){
        return res.status(403).json({
            msg : "Post doesn't exist"
        })
    }
    const post = await Post.findOne({_id : postId});
    if(!post){
        return res.status(403).json({
            msg : "Didn't able to find post"
        })
    }

    const count = post.downvote
    if(inc == true){
        await Post.updateOne({_id : post._id} , {
            "$set":{
                downvote : count + 1
            }
        })
    }else if(count > 0){
        await Post.updateOne({_id : post._id} , {
            "$set":{
               downvote : count -1
            }
        })

    }
    res.status(200).json({
        downvote : post.downvote, 
        msg : "interaction recorded"
    })
})

router.delete('/deletePost' , authMiddleware , async function(req, res){
    const postId = req.body.postId
    const userid  = req.userID

    if(!postId){
        return res.status(403).json({
            msg : "Post doesn't exist"
        })
    }

    const post = await Post.findOne({_id : postId})
    const user = await User.findOne({username : userid})
    if(!post){
        return res.status(403).json({
            msg :"didn't able to find the post"
        })
    }
    if(!user){
        return res.status(403).json({
            msg :"didn't able to find the user / user didn't exist"
        })
    }

    const postUser = JSON.stringify(post.username);
    const postUserId = JSON.stringify(user._id);
    

    if(postUser != postUserId){
        return res.status(403).json({
            msg : "post is created by other user hence can't be delted by the current user"
        })
    }

    await Post.deleteOne({_id : postId})


    res.status(200).json({
        msg : "post deletion successfull"
    })

})


router.get("/" , async function(req, res){
    const posts = await Post.find(); 

    res.status(200).json({
        posts
    })
})

module.exports = router