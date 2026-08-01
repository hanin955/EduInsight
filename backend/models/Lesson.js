import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema({
    title : {type: String,required : true},
    content : String, 
    videoUrl : String,
    pdfUrl : String,
    order :{type : Number,default: 0},
    module : {type: mongoose.Schema.Types.ObjectId, ref: "module",required: true}
}, {timestamps: true});
export default mongoose.model("lesson", lessonSchema);