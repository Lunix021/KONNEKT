const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const Chat=require('../Models/Chat')
const auth=require('../middleware/auth');



//Send friend  request
router.patch('/sendrequest/:id',auth,async (req,res)=>{
    try {
       const senderId = req.user.id;

       const  receiverId  = req.params.id;

       if(senderId===receiverId) {
        return res.status(409).send("CANT SEND REQUEST TO SELF");}

       const receiver = await User.findById(receiverId);

       receiver.friendRequests.push(senderId);

       await receiver.save();

       res.status(200).json({
    msg:"Friend Request Sent"
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});




//accept a request
router.patch('/acceptrequest/:id',auth,async (req,res)=>{
    try {
       const user=await User.findById(req.user.id);
       const sender=await User.findById(req.params.id);

      const chat=await Chat.findOne({
    members: {
        $all: [user._id, sender._id]
    }
});

if (!user || !sender){return res.status(401).send("INVALID USER");}

if(!chat){  await Chat.create({members:[req.user.id,req.params.id]});}
     

       user.friends.push(req.params.id);
       sender.friends.push(req.user.id);

       user.friendRequests.pull(req.params.id);

       await user.save();
       await sender.save();

       res.status(200).json({
    msg:" Request accepted"
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});




//reject a request
router.patch('/rejectrequest/:id',auth,async (req,res)=>{
    try {
       const user=await User.findById(req.user.id);

      


       user.friendRequests.pull(req.params.id);

       await user.save();
       

       res.status(200).json({
    msg:" Request rejected"
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});







//get my friends
router.get('/list',auth,async (req,res)=>{
    try {
       const user=await User.findById(req.user.id);
   

       res.status(200).json({
    msg:" FRIEND LIST FETCHED",
    friends:await user.populate('friends')
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});






//get requests received by user
router.get('/requests', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate("friendRequests", "_id name profilePic");

        res.status(200).json(user.friendRequests);

    } catch (err) {
        res.status(500).send(err.message);
    }
});




//get requests sent by user
router.get('/sent', auth, async (req, res) => {
    try {
        const user = await User.find({friendRequests:req.user.id}).select("_id name profilePic");
            

        res.status(200).json(user.friendRequests);

    } catch (err) {
        res.status(500).send(err.message);
    }
})




module.exports=router;