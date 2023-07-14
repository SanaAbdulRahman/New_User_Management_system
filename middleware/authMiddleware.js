const { request } = require('express');
const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    //check if the access token is present in he cookies or headers

    const accessToken=req.cookie.accessToken || req.headeers['x-access-token'];
   
    if(!accessToken){
        //if accesstoken is present, redirect the user to the login page
        return res.redirect('/login');
    }
    try{
        //verify the access token
        const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        req.user=decoded.user; //store the user object in the request
        next();

    }catch(error){
        //if the access token is invalid or expired ,redirect the user to the login page
        res.clearCookie('accessToken');
        return res.redirect('/login')

    }
};
module.exports=authenticate;