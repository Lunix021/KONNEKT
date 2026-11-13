const express=require('express');
const router=express.Router();
const User=require('../Models/User');
const Chat=require('../Models/Chat')
const auth=require('../middleware/auth');
const bcrypt=require('bcrypt'); 
const jwt = require('jsonwebtoken');
const upload=require('../config/multer');
const cloudinary=require('../config/cloudinary');


//USER REGISTER
router.post('/register',async (req,res)=>{
    try {

        const pwd=await bcrypt.hash(req.body.pwd,10);

        const user=await User.create({name:req.body.name,pwd:pwd,email:req.body.email});


           res.status(201).json({"msg":"User created Successfully",
            user:user
           });

    } catch (err) {
        res.status(500).send(err.message);
    }
}); 







//USER LOGIN
router.post('/login',async (req,res)=>{
 try {
    const user=await User.findOne({email:req.body.email});
 
if(!user){
    return res.status(404).json({
        msg:"User not found"
    });
}

    if(await bcrypt.compare(req.body.pwd,user.pwd)){

const token=jwt.sign(
    {id:user._id},
    process.env.JWT_SECRET_KEY,
    {expiresIn:"7d"}
);

res.cookie("token",token, { httpOnly:true,secure:false,sameSite:"lax",maxAge:7*24*60*60*1000});

res.status(201).json({"msg":"User signed in  Successfully",
            user:user
           });

    }

    else{
        res.status(401).send("INVALID PASSWORD");
    }
           

    } catch (err) {
        res.status(500).send(err.message);
    }
});





//LOGOUT A USER
router.post('/logout',async (req,res)=>{
 res.clearCookie("token",{
    httpOnly: true,
    sameSite: "lax",
    secure: false
});
res.send("Logged out");
});






//authorization
router.get('/me',auth,async (req,res)=>{
    try {

        const user=await User.findOne({_id:req.user.id});
        

           res.status(201).json({"msg":"User is logged in my nigga",
            user:user
           });

    } catch (err) {
        res.status(500).send(err.message);
    }
});





//Search for a user
router.get('/search',auth,async (req,res)=>{
    try {
       const user=await User.find({
    name: { $regex: req.query.query, $options: "i" }
}).select("-pwd");

res.status(200).json({
    msg:"Users with given query fetched",
    users:user
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});



//UPDATE THE PROFILEPIC
router.post('/upload',auth,upload.single("image"),async (req,res)=>{
    try {

        
        if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({
        msg: "Only images are allowed"
    });
}
       const result=await cloudinary.uploader.upload(req.file.path);
       const user=await User.findById(req.user.id);
       user.profilePic=result.secure_url;

       await user.save();

res.status(200).json({
    msg:"PROFILE PIC UPDATED"
})

    } catch (err) {
         res.status(500).send(err.message);
    }
});















module.exports=router;