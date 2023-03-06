const mongoose = require("mongoose")
const Schema = mongoose.Schema

const user = new Schema({
    email: String,
    password:String,
    role:String,
    
})

module.exports = mongoose.model("user",user)