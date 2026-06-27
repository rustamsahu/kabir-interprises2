const mongoose=require("mongoose");
const schema=new mongoose.Schema({
       secretCode:{type:String,
                   required:true,
                  },     
});
const code=mongoose.model("code",schema);
module.exports=code;