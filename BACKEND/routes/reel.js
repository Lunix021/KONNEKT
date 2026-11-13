const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth');
const Reel=require('../Models/Reel');
const upload=require('../config/multer');
const cloudinary=require('../config/cloudinary');

// ADD A REEL
router.post('/add',auth,upload.single("video"),async(req,res)=>{
  try {
    
    if(!req.file.mimetype.startsWith("video/")){
        return res.status(400).json({
        msg: "Only videos are allowed"
    });
    }

    const result=await cloudinary.uploader.upload(req.file.path);

    const reel=await Reel.create({user_uploaded:req.user.id,videourl:result.secure_url});

    res.status(201).json({
    msg:"REEL ADDED"
})

  } catch (err) {
    res.status(500).send(err.message);
  }
});






//GET ALL REELS
router.get('/getall',auth,async(req,res)=>{
     try {

      const reels=await Reel.find().populate("user_uploaded","_id name profilePic").populate("comments.by","_id name profilePic");
      res.status(200).json(reels);
      
     } catch (err) {
      res.status(500).send(err.message);
     }
});






//ADD A COMMENT
router.post('/addcomment/:reelid',auth,async(req,res)=>{
 try {
  const date=new Date();
  const reel=await Reel.findByIdAndUpdate(req.params.reelid,{
    $push: {
  comments: {
    by: req.user.id,
    text: req.body.text,
    time: date.toISOString()
  }
}
  });

  res.status(200).json(reel.populate("comments.by","_id name profilePic"));

 } catch (err) {
  res.status(500).send(err.message);
 }
});






//LIKE A REEL
router.patch('/like/:reelid',auth,async(req,res)=>{
 try {
  const reel=await Reel.findByIdAndUpdate(req.params.reelid,{
    $inc:{likes:1}
  })
  res.status(200).send(reel);
 } catch (err) {
  res.status(500).send(err.message);
 }
});


//DISLIKE A REEL(we will need a likedreels attribute in our user database will do that later currently its very simple just click like button and reel will be liked or we can create attribute in reel for list of users that liked the reel and can find if we belong to that list. period)
router.patch('/unlike/:reelid',auth,async(req,res)=>{
 try {
  const reel=await Reel.findByIdAndUpdate(req.params.reelid,{
    $inc:{likes:-1}
  })
  res.status(200).send(reel);
 } catch (err) {
  res.status(500).send(err.message);
 }
});











module.exports=router;

