const express=require('express');
const router=require('express').Router();
const usermanageController=require('../controllers/usermanageController')

//usermanage routes
router.get('/admin',usermanageController.dashbord)
router.get('/add',usermanageController.addUser)
router.post('/add',usermanageController.postUser)




module.exports=router