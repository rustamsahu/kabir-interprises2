const mongoose=require("mongoose");
const schema=new mongoose.Schema({
       billPic:{type:String,
                  },     
},{timestamps:true});
const billPics=mongoose.model("billPic",schema);
module.exports=billPics;