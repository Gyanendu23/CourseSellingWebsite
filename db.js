const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const ObjectId=mongoose.Types.ObjectId;



const User=new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const Admin=new Schema({
    email:{type:String, unique:true},
    password:String,
    firstName:String,
    lastName:String
})

const courses=new Schema({
    title:{type:String, unique:true},
    description:String,
    Price:Number,
    ImageUrl:String,
    creatorId:ObjectId
})

const purchases=new Schema({
    courseId:ObjectId,
    userId:ObjectId
})

const UserModel=mongoose.model("user",User);
const adminModel=mongoose.model("admin",Admin);
const courseModel=mongoose.model("course",courses);
const purchaseModel=mongoose.model("purchase",purchases);

module.exports={
    UserModel,
    adminModel,
    courseModel,
    purchaseModel
}