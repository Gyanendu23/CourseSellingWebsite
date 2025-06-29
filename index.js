require('dotenv').config()
console.log(process.env.MONGO_URL)
const cors = require("cors");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
// app.use(cors());
const bcrypt = require("bcrypt");
const { z } = require("zod");
const mongoose = require("mongoose");
app.get("/",function(req,res){
    res.sendFile(__dirname+"/admin_index.html");
})
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(3000);
  console.log("listening to port 3000");
}
main();

