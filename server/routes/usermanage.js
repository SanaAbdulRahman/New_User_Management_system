const express=require('express');
const router=require('express').Router();
const usermanageController=require('../controllers/usermanageController')

//usermanage routes
router.get('/admin',usermanageController.dashbord)
router.get('/add',usermanageController.addUser)
router.post('/add',usermanageController.postUser)
router.get('/view/:id',usermanageController.viewUser)

router.get('/edit/:id',usermanageController.editUser)
router.put('/edit/:id',usermanageController.editPost)
router.delete('/edit/:id',usermanageController.deleteUser)
router.post('/search',usermanageController.searchUser)









module.exports=router