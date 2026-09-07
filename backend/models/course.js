import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description : String,
    departement : {type :mongoose.Schema.Types.ObjectId, ref : "Departement", required: true},
    teacher :{type : mongoose.Schema.Types.ObjectId, ref: "User",required :true},
    duration : {type : Number},
    level : String,
    image : String,
    pdf : String,
},{timestamps : true});
export default mongoose.models.Course || mongoose.model('Course', courseSchema);