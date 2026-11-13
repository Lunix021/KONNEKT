const express=require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const auth=async(req,res,next)=>{

try {
    

    const token=req.cookies.token;

    if(!token){
        res.status(404).send("TOKEN NOT FOUND");
    }

    const payld=jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user=payld;

    next();

} catch (err) {
    res.status(401).send("TRY AGAIN BITCH");
}

}



module.exports=auth;