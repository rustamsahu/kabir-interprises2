require("dotenv").config();
const {createHmac,randomBytes}=require("crypto");
const dbURI=process.env.MONGO_URI;
const express=require("express");
const cookieParser=require("cookie-parser");
const path=require("path");
const app=express();
app.use(express.urlencoded({extended:false}));
app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
const connection=require("./connections");
connection(process.env.MONGO_URI);
const code=require("./models/codeSchema");
async function check() {
    if((await code.find()).length==0)
    {
        const salt="sodiumplusclorine";
        const hassedCode=createHmac("sha256",salt).update(process.env.SECRETCODE).digest("hex");
        await code.create({
        secretCode:hassedCode
        });
    }
};
check();
const router=require("./routs");
app.use("/",router);
app.listen(process.env.PORT);
