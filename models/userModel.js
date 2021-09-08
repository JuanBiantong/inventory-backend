const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
});

const Users = mongoose.model("User", UserSchema);
module.exports = Users;