const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const Chat=require('../Models/Chat')
const auth=require('../middleware/auth');

//GET ALL THE CHATROOMS OF THE USER
router.get('/allchat',auth,async(req,res)=>{
    try {
        const chats=await Chat.find({members:req.user.id}).populate("members","_id name profilePic");
        res.json(chats);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//GET THE CHATROOM WITH YOUR MATE BOY
router.get('/:id',auth,async(req,res)=>{
    try {
        const chat=await Chat.findOne({members:{$all:[req.user.id,req.params.id]}});
        res.status(200).json({"msg":"got the chat room boy",chat:chat});
    } catch (err) {
        res.status(500).send(err.message);
    }
});









module.exports=router;