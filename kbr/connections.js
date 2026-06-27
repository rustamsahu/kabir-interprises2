const mongoose=require("mongoose");
function connection(url){
    mongoose.connect(url).then(()=>{
        console.log("connected to online db")
    });
}
module.exports=connection;