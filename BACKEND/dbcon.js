const mongoose=require('mongoose');
require('dotenv').config();

const dbcon=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB CONNECTED");
    } catch (err) {
        console.log(err);
    }
}

module.exports=dbcon;