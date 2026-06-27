const jwt=require("jsonwebtoken");
const signature=process.env.SIGNATURE;
const code=require("./models/codeSchema");
function setUser(){
    const payload={name:"name"};
    return jwt.sign(payload,signature);
};
function getUser(token){
    try{
    return jwt.verify(token,signature);}
    catch(e){console.log("jwt error")}
    
};
module.exports={setUser,getUser};