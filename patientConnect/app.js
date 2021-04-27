const express=require('express');
const bodyParser=require('body-parser');
const loginRoute=require('./routes/login');
const admin=require('./routes/admin');
const mongoose = require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const MongoDbStore=require('connect-mongodb-session')(session);
const User=require('./models/user');

const csrf=require('csurf');
const path=require('path');

const csrfProtection=csrf();

const MongoUri='mongodb+srv://try:try@cluster0.bsdng.mongodb.net/major?w=majority';
const store=new MongoDbStore({
	uri:MongoUri,
	collection:'sessions'
});


const app=express();
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
	secret:"My secret",
	resave:false,
	saveUninitialized:false,
	store:store
}));

app.use((req,res,next)=>{
	if(!req.session.user){
		return next();
	}
	User.findById(req.session.user._id)
	.then(re=>{
		req.user=re;
		next();
	})
	.catch(err=>console.log(err));
});
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
	res.locals.csrfTok=req.csrfToken();
	next();
});

app.use(loginRoute);
app.use('/admin',admin);
app.use((req,res,next)=>{
	res.status(404).render('404');
});
app.use((error,req,res,next)=>{
	console.log(error);
	res.status(500).render('500',{title:'Internal Error'});
})

mongoose
.connect(MongoUri,{ useUnifiedTopology: true,useNewUrlParser: true })
.then(result=>{
	console.log('working');
	app.listen(3001);
})
.catch(err=>{
	//const er=new Error('database not avalable');
	//next(er);
	console.log("Database is down.");
});
