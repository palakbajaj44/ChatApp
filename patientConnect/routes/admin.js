const express=require('express');
const adminC=require('../controller/admin');

const router=express.Router();

router.get('/login',adminC.getLogin);
router.post('/login',adminC.postLogin);
router.get('/afterlogin',adminC.getAfterLogin);
router.post('/logout',adminC.postLogout);
router.post('/show',adminC.postShow);

module.exports=router;