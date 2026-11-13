
const mongoose=require('mongoose');

const reelSchema=new mongoose.Schema(
 {
  user_uploaded:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  likes:{
    type:Number,
    required:true,
    default:0
  },
  comments:[{
    by:{type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true},
    text:{
        type:String,
        required:true,
        trim:true
    },
    time:Date
  }],
  caption:String,
  videourl:{
    type:String,
    default:"",
    required:true
  }
 },
 {
    timestamps:true
 }
);


module.exports=mongoose.model("Reels",reelSchema);