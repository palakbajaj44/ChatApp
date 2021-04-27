const express=require('express');
const userC=require('../controller/user');
const isAuth=require('../middleware/is-auth');

const routes=express.Router();

routes.get('/home',userC.getHome);
routes.get('/login',userC.getLogin);
routes.get('/register',userC.getRegister);
routes.get('/afterlogin',isAuth,userC.getAfterLogin);
routes.get('/update',isAuth,userC.getUpdate);
routes.post('/login',userC.postLogin);
routes.post('/register',userC.postRegister);
routes.post('/logout',userC.postLogout);
routes.post('/update',userC.postUpdate);
module.exports=routes;
