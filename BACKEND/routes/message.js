const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const Chat=require('../Models/Chat')
const auth=require('../middleware/auth');
const Message=require('../Models/Message');




//GET ALL MESSAGES OF A CHAT
router.get('/:chatId',auth,async (req,res)=>{
   try {
    const chats=await Message.find({chat:req.params.chatId}).sort({createdAt:1}).populate("sender","_id name");
    res.status(200).json(chats);
   } catch (err) {
    res.status(500).send(err.message);
   }
});


//SEND A MESSAGE
router.post('/send',auth,async(req,res)=>{
    try {
        const message=await Message.create({chat:req.body.chatId,sender:req.user.id,text:req.body.text});

     
         const populatedMessage = await message.populate(
            "sender",
            "_id name"
        );


          const io=req.app.get("io");

       io.to(req.body.chatId).emit("newMessage",populatedMessage);



        res.status(200).json(populatedMessage);
    } catch (err) {
        res.status(500).send(err.message);   
    }
});










module.exports=router;