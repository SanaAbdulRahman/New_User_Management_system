//const User = require('./models/user');
const User=require('../models/user')
const mongoose=require('mongoose');
// GET admin page

exports.dashbord = async (req,res)=>{

    res.render('index',{admin:true})
}
// GET new user form

exports.addUser = async (req,res)=>{

    res.render('user/addUser',{admin:true})
}

//POST 
//Create new user

exports.postUser=async (req,res)=>{
    console.log(req.body);
    const newUser= new User({
        userName:req.body.userName,
        email:req.body.email
    })
    try {
        await User.create(newUser)
    } catch (error) {
        console.log(error);
    }

    res.redirect('/admin')
}