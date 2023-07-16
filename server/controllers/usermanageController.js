//const User = require('./models/user');
const User=require('../models/user')
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const Admin=require('../models/adminModel');
const user = require('../models/user');


// GET admin page

// exports.dashbord = async (req,res)=>{
//     const messages=await req.flash('info');
//     try {
//         const users=await User.find({}).limit(22)
//         res.render('index',{admin:true,messages,users});
//     } catch (error) {
//         console.log(error);
//     }
   
// }
//GET
//ADmin login page
exports.adminlogin=(req,res)=>{
    res.render('adminLogin',{admin:false});
}

//GET dashboard 

exports.dashbord = async (req, res) => {

    const messages = await req.flash('info');
     let perPage = 8;
    let page = req.query.page || 1;

    try {
        const admin=await Admin.find();
        const getAdmin=admin[0]
      const users = await User.aggregate([ { $sort: { updatedAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await User.count();

      res.render('index', {
        admin:true,
        adminName:getAdmin.username,
        users,
        current: page,
        pages: Math.ceil(count / perPage),
        messages
      });

    } catch (error) {
      console.log(error);
    }
}

exports.postAdmin = async (req, res) =>{ 
    console.log(req.body);
    const {username,password} =req.body;
    //console.log(password)
    if(!username || !password){
      return res.render("login",{error:"Please enter username or password",admin:false});
    }
   const admin=await Admin.find();
   const getAdmin=admin[0]
   console.log(admin);
    //compare password
    //const isPasswordValid=await bcrypt.compare(password,user.password)
   // console.log(isPasswordValid);
    if(username===getAdmin.username && password===getAdmin.password)
  {
    const accessToken=jwt.sign({
      user:{
        username:admin.username,
        id:admin.id
      }
    },process.env.ADMIN_TOKEN,
    {expiresIn:"10m"}
    )
   console.log(accessToken);
   //res.render('home',{username,admin:false});

   return res.cookie('accessToken', accessToken).render("dashboard",{user:username,admin:true});
    }else{
    return res.render("adminLogin",{error: "Invalid username or password",admin:false});
  }
  
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
        await User.create(newUser);
        await req.flash('info','New user has been added.');
    } catch (error) {
        console.log(error);
    }

    res.redirect('/admin')
}

//GET
//User data
exports.viewUser=async (req,res)=>{
    try {
        const user=await User.findOne({_id:req.params.id})
        res.render('user/view',{user,admin:true})
    } catch (error) {
        console.log(error);
    }
}

//GET 
//Edit user data
exports.editUser=async (req,res)=>{
    try {
        const user=await User.findOne({_id:req.params.id})
        res.render('user/edit',{user,admin:true})
    } catch (error) {
        console.log(error);
    }
}

//PUT
//Update user data
exports.editPost=async (req,res)=>{
    try {
        await User.findByIdAndUpdate(req.params.id,{
            userName:req.body.userName,
            email:req.body.email,
            updatedAt:Date.now()

        });
        await res.redirect('/edit/'+req.params.id);
        console.log("redirected");
    } catch (error) {
        console.log(error);
    }
}

//delete
//Delete user data
exports.deleteUser= async (req,res)=>{
    try {
        await User.deleteOne({_id:req.params.id});
        res.redirect('/admin')
    } catch (error) {
        console.log(error);
    }
}

//Get
//Search user data
exports.searchUser= async (req,res)=>{
   try {
    let searchTerm=req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const users= await User.find({
        $or:[
            {userName:{$regex:new RegExp(searchNoSpecialChar,"i")}}
        ]
    });
    res.render('search',{admin:true,users})
   } catch (error) {
    console.log(error);
   }
}