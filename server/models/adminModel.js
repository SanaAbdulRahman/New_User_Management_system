const mongoose=require('mongoose');

const loginSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
});

const admin= new mongoose.model("admin", loginSchema);
module.exports = admin;