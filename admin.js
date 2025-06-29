const express=require("express");
const Router =express.Router;
const adminRouter=Router();
const {adminModel,courseModel}=require("../db");
const  { JWT_ADMIN_PASSWORD } = require("../config");
const jwt=require("jsonwebtoken");
const app=express();
app.use(express.json());
const bcrypt=require("bcrypt");
const { z } = require("zod");


const {adminMiddleware}=require("../middlewares/admin");

adminRouter.post("/signup",async function(req,res){

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
        }),
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
        await adminModel.create({
            email:email,
            password:hashedPass,
            firstName:firstName,
            lastName:lastName
        })
    }catch(e){
        console.log("Error while putting in the DB");
        res.json({
            message:"User already Exists"
        })
        error_hai=true;
    }
    if(!error_hai){
        res.json({
            message:"You are signed up"
        })
    }

})
adminRouter.post("/signin",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const admin=await adminModel.findOne({
        email:email
    })

    const matchedPass=await bcrypt.compare(password,admin.password);

    if(admin && matchedPass){
        const token=jwt.sign({
            id:admin._id.toString()
        },JWT_ADMIN_PASSWORD)
        res.json({
            message:"you are signed in",
            token
        })
    }
    else{
        res.status(403).json({
            message:"User not found, Please Signup"
        })
        
    }
})

adminRouter.post("/course",adminMiddleware,async function(req,res){//create courses 
    const adminId=req.userId;
    const {title, description, Price, ImageUrl }=req.body;

    const course =await courseModel.create({
        title,
        description,
        Price,
        ImageUrl,
        creatorId:adminId
    })
    res.json({
        message:"Course Created",
        courseId:course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req,res){//update existing courses
    const adminId=req.userId;
    const {title, description, Price, ImageUrl, courseId}=req.body;
    const k=await courseModel.findOne({
        _id:courseId,
        creatorId:adminId
    })
    if(!k){
        console.log("Don't try to update other's course");
        return res.status(403).json({ message: "Course not found or not owned by you" });
        return;
    }
    const course =await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title,
        description,
        Price,
        ImageUrl
    })
    res.json({
        message:"Course Updated",
        courseId
    })
})

adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId=req.userId;
    const courses =await courseModel.find({
        creatorId:adminId
    });
    res.json({
        message:"Courses",
        courses
    });
});


module.exports={
    adminRouter:adminRouter
}