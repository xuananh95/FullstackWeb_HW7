const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    age: Number,
    address: String,
    gender: String,
    phone: String,
    email: String,
});

module.exports = mongoose.model("User", userSchema);
