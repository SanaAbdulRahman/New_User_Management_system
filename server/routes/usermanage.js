const express=require('express');
const router=require('express').Router();
const usermanageController=require('../controllers/usermanageController')

//usermanage routes
router.get('/admin',usermanageController.dashbord)



module.exports=router