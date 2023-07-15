//const User = require('./models/user');
const User=require('../models/user')
const mongoose=require('mongoose');
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


exports.dashbord = async (req, res) => {

    const messages = await req.flash('info');
     let perPage = 8;
    let page = req.query.page || 1;

    try {
      const users = await User.aggregate([ { $sort: { updatedAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(); 
      const count = await User.count();

      res.render('index', {
        admin:true,
        users,
        current: page,
        pages: Math.ceil(count / perPage),
        messages
      });

    } catch (error) {
      console.log(error);
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