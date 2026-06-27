const path=require("path");
const pros=require("./models/proSchema");
const code=require("./models/codeSchema");
const billPics=require("./models/picSchema");
const {createHmac}=require("crypto");
const {setUser,getUser}=require("./jwt");
const multer=require("multer");
const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto",
    public_id:(req,file)=>{
        return `${Math.floor(Date.now()/1000)}-${file.originalname}`
    }
  }
});
const upload=multer({storage});

function home(req,res){
    res.render("index");
}
async function pro(req,res){
    const allPro=(await pros.find()).reverse();
    res.render("pro",{allPro});
}
function newPro(req,res){
    res.render("newPro");
}
async function submit1(req,res){
    const aim=await pros.findOne({productName:req.body.productName});
    let name=req.body.productName;
    if(!req.body.productName)
        res.json("Fill the product Name");
    else
    {
        if(!aim && req.file)
        { await pros.create({
          productName:req.body.productName,
          price:req.body.price,
          quantity:req.body.quantity,
          pic:req.file.path,
         });
         res.redirect("/pro");        
        }
        else if(!aim && !req.file){
         await pros.create({
          productName:req.body.productName,
          price:req.body.price,
          quantity:req.body.quantity,
         });
         res.redirect("/pro");        
        }
        else
        {
            if(req.body.price)
            aim.price=req.body.price;
            if(req.body.quantity)
            aim.quantity=req.body.quantity;
            aim.save();
            res.redirect("/pro");
        }
    }
}
async function bill(req,res){
    const allPro=(await pros.find()).reverse();
    res.render("bill",{allPro});
}
async function submit2(req,res){
    let mob=req.body.mob;
      let x=req.body["productName[]"];
      let y=req.body["quantity[]"];
      if(typeof x=="string")
      {
        x=[x];
        y=[y];
      }
      for(let i of x)
      { let aim=await pros.findOneAndUpdate({productName:i},{$inc:{quantity:-Number(y[x.indexOf(i)])}});
      }
      res.redirect(`http://wa.me/91${mob}`);
};
async function checkAuth(req,res,next) {
    const cred=req.cookies;
    if(!cred)
    res.render("check");
    else{
    const token=cred.token;
    if(getUser(token))
        next();
    else
        res.render("check");
    }
}
async function check(req,res){
    const givenCode=req.body.givenCode;
    const salt="sodiumplusclorine";
    const hassedGivenCode=createHmac("sha256",salt).update(givenCode).digest("hex");
    const actualCode=(await code.find())[0].secretCode;
    if(hassedGivenCode==actualCode)
    {   
        const token=setUser();
        res.cookie("token",token,{maxAge:10*24*60*60*1000});
        res.redirect("/");
    }
    else 
        res.render("check");
}
function changeSC(req,res){
    res.render("changeSC");
}
async function submitChangeSC(req,res) {
    const salt="sodiumplusclorine";
    const oldSC=req.body.oldSC;
    const newSC=req.body.newSC;
    const hassedOldSC=createHmac("sha256",salt).update(oldSC).digest("hex");
    const hassedNewSC=createHmac("sha256",salt).update(newSC).digest("hex");
    const actualSC=(await code.find())[0].secretCode;
    if(hassedOldSC==actualSC)
    {
      await code.findOneAndUpdate({secretCode:hassedOldSC},{
        secretCode:hassedNewSC
      });
      res.render("newPro");
    }
    else{
    res.clearCookie("token").redirect("/");
    }
}
async function saveImage(req,res) {
    const base64=req.body.image;
  try {
    const result = await cloudinary.uploader.upload(base64, {
      folder: "myImages",
    });
    await billPics.create({
        billPic:result.secure_url
    });
    res.send("sucess");
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
};
async function seeBills(req,res){
    const allBillPics= (await billPics.find()).reverse();
    res.render("seeBills",{allBillPics});
};
module.exports={home,pro,newPro,submit1,bill,submit2,checkAuth,check,upload,changeSC,submitChangeSC,saveImage,seeBills};