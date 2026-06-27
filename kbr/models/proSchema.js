const mongoose=require("mongoose");
const schema=new mongoose.Schema({
       productName:{type:String,required:true},
       price:{type:Number},
       quantity:{type:Number},
       pic:{type:String},
});
const pros=mongoose.model("pro",schema);
module.exports=pros;