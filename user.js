const express=require("express");
const Router=express.Router;

const userRouter=Router();
const  { JWT_USER_PASSWORD } = require("../config");
const jwt=require("jsonwebtoken");
const app=express();
app.use(express.json());
const bcrypt=require("bcrypt");
const { z } = require("zod");
const {UserModel, courseModel}=require("../db");
const {purchaseModel}=require("../db");

const {userMiddleware}=require("../middlewares/user");

userRouter.post("/signup",async function(req,res){

    const requiresBody=z.object({
        email:z.string().min(5).max(100).email(),
        password: z.string().min(10).max(15).refine(value => {
            // Regular expressions to check for at least one lowercase, one uppercase, and one special character
            const hasLower = /[a-z]/.test(value);
            const hasUpper = /[A-Z]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

            return hasLower && hasUpper && hasSpecial;
        }, {
            message: 'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
        })
    })
    // const parsedData=requiresBody.parse(req.body);//any one can be used
    const parsedDataWithSuccess=requiresBody.safeParse(req.body);

    if(!parsedDataWithSuccess.success){
        res.json({
            message:"credentials are wrong in format",  
            error:parsedDataWithSuccess.error// return the type of error
        })
        return;
    }
    
    const email=req.body.email;
    const password=req.body.password;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;

    let error_hai=false;
    try{
        const hashedPass=await bcrypt.hash(password,5);
        await UserModel.create({
            email:email,
            password:hashedPass,
            firstName:firstName,
            lastName:lastName
        })
    } catch (e) {
    console.log("Error while putting in the DB", e);  // 👈 log the full error
    if (e.code === 11000) {
        res.status(400).json({ message: "User already exists" });
    } else {
        res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
    error_hai = true;
}
    if(!error_hai){
        res.json({
            message:"You are signed up"
        })
    }

})
userRouter.post("/signin",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const user=await UserModel.findOne({
        email:email
    })

    const matchedPass=await bcrypt.compare(password,user.password);

    if(user && matchedPass){
        const token=jwt.sign({
            id:user._id.toString()
        },JWT_USER_PASSWORD)
        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            message:"User not found, Please Signup"
        })
        
    }
})

userRouter.get("/purchased_courses",userMiddleware,async function(req,res){
    const userId=req.userId;

    const purchases=await purchaseModel.find({
        userId:userId
    })

    const courseData=await courseModel.find({
        _id:{$in: purchases.map(x=>x.courseId)}
    })

    res.json({
        message:"your courses are",
        purchases,
        courseData
    })
})

module.exports={
    userRouter:userRouter
}