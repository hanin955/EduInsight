const mongoose = require("mongoose");
const User = require("./User");
const adminSchema = mongoose.Schema({
    premissions :[{type : string}],
});
module.exports = User.discriminator("admin",adminSchema);
