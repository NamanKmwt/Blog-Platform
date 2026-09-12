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
    const user = await User.findOne({username : req.userID});
    if(!user){
        return res.status(403).json({
            msg : "User doesn't exist"
        })
    }

    const userId = user._id.toString();
    const alreadyUpvoted = post.upvoters.some((id) => id.toString() === userId);

    if(alreadyUpvoted){
        post.upvoters = post.upvoters.filter((id) => id.toString() !== userId);
    }else{
        post.upvoters.push(user._id);
        post.downvoters = post.downvoters.filter((id) => id.toString() !== userId);
    }

    await post.save();

    res.status(200).json({
        upvote : post.upvoters.length,
        downvote : post.downvoters.length,
        userVote : alreadyUpvoted ? null : "up",
        msg : "interaction recorded"
    })
})

router.put('/downvote' , authMiddleware ,async function(req, res){
    const postId = req.body.postId
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
    const user = await User.findOne({username : req.userID});
    if(!user){
        return res.status(403).json({
            msg : "User doesn't exist"
        })
    }

    const userId = user._id.toString();
    const alreadyDownvoted = post.downvoters.some((id) => id.toString() === userId);

    if(alreadyDownvoted){
        post.downvoters = post.downvoters.filter((id) => id.toString() !== userId);
    }else{
        post.downvoters.push(user._id);
        post.upvoters = post.upvoters.filter((id) => id.toString() !== userId);
    }

    await post.save();

    res.status(200).json({
        upvote : post.upvoters.length,
        downvote : post.downvoters.length,
        userVote : alreadyDownvoted ? null : "down",
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