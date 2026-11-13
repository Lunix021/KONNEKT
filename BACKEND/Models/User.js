const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
     name:{type:String,required:true,trim:true},
     email:{type:String,required:true,unique:true,trim:true},
     pwd:{type:String,required:true},
     friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
     }],
     friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
}],
profilePic: {
  type: String,
  default: ""
} 
    });

module.exports = mongoose.model("User", userSchema);