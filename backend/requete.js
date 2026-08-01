import mongoose from "mongoose";
import user from "./models/User.js";
const getUsers = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/EduInsight");
        const students = await user.find({role : "student"});
        console.log(students);
    }catch(err){
        console.log("erreur",err.message);
    }finally{
        mongoose.connection.close();
    }   
};
getUsers();
