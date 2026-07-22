const mongoose = require("mongoose");
const { modelName } = require("./User");
const departementSchema = new mongoose.Schema({
    name : String,
    description : String,
},{timestamps :true});
module.exports = mongoose.model("Department", departementSchema);