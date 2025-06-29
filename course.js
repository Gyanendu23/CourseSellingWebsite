const express=require("express");
const Router =express.Router;

const courseRouter=Router();
const {userMiddleware}=require("../middlewares/user")
const {courseModel,purchaseModel}=require("../db");
const jwt=require("jsonwebtoken");
const app=express();
app.use(express.json());
const bcrypt=require("bcrypt");
const { z } = require("zod");
const JWT_SECRET="GyanenduKumarJha";

courseRouter.post("/purchase",userMiddleware,async function(req,res){//to buy courses
    const userId=req.userId;
    const courseId=req.body.courseId;
    const k=await purchaseModel.findOne({
        courseId,
        userId
    })
    if(k){
        console.log("Course Already bought");
        return res.status(400).json({
            message: "You have already purchased this course"
        });
        return;
    }
    await purchaseModel.create({
        courseId,
        userId
    })
    res.json({
        message:"You have seccessfully bought the Course"
    })

})

courseRouter.get("/preview",async function(req,res){//for all courese
    const courses=await courseModel.find({});
    res.json({
        courses
    })
})

module.exports={
    courseRouter:courseRouter
}