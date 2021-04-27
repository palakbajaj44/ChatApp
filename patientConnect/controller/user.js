const User=require('../models/user');
const bcrypt=require('bcryptjs');
exports.getHome=(req,res,next)=>{
	res.render('index');
}


exports.getLogin=(req,res,next)=>{
	let message=req.flash('error');
	if(message.length>0){
		message=message[0];
	}
	else{
		message=null;
	}
	res.render('login',{
		errorMessage:message
	});
};

exports.getRegister=(req,res,next)=>{
	let message=req.flash('error');
	if(message.length>0){
		message=message[0];
	}
	else{
		message=null;
	}
	res.render('register',{
		errorMessage:message,
		email:'',
		name:''
	});
};
exports.getAfterLogin=(req,res,next)=>{
	console.log(req.session.user.name);
	res.render('client',{
		title:'Loggedin',
		user:req.session.user.name
	});
};
exports.getUpdate=(req,res,next)=>{
	res.render('medical_history');
};

exports.postLogin=(req,res,next)=>{
	const password=req.body.password;
	const email=req.body.email;
	User.findOne({email:email})
	.then(result=>{
		if(!result){
			req.flash('error','Invalid Data');
			return res.redirect('/login');
		}
		user=result;
		bcrypt
		.compare(password,result.password)
		.then(re=>{
			if(re){
				req.session.isLoggedIn=true;
				req.session.user=result;
				req.session.save(err=>{
					console.log('caller');
					res.redirect('/afterlogin');
				}); 
			}
			else{
				req.flash('error','Invalid Data');
				return res.redirect('/login');
			}
		
		})
		.catch((err)=>{
			const er=new Error('Error');
			next(er);
			});
	})
	.catch(err=>{
		console.log('Error in postlogin::');
		console.log(err);
		res.redirect('/');
	});
};

exports.postRegister=(req,res,next)=>{
	const password=req.body.password;
	const name=req.body.name;
	const email=req.body.email;
	const pass1=req.body.pwd1;
	if(pass1!==password){
		res.render('register',{
		errorMessage:"password are not same",
		email:email,
		name:name
		});
	}
	User.findOne({email:email})
	.then(result=>{
		if(result){
			req.flash('error','Already register');
			return res.redirect('/login');
		}
		return bcrypt
		.hash(password,12)
		.then(hashedPassword=>{
			const user=new User({
				email:email,
				name:name,
				password:hashedPassword
			});
			return user.save();
		})
		.then(result=>{
			res.redirect('/login');
		})
	})
	.catch((err)=>{
			const er=new Error('Error');
			next(er);
		});
	//console.log(pass+" name: "+name);
		
};

exports.postLogout=(req,res,next)=>{
	req.session.destroy((err)=>{

		console.log("sussesfully destroyed"+err);
		res.redirect('/login');
	});
};

exports.postUpdate=(req,res,next)=>{
	const name=req.body.name;
	const gender=req.body.gender;
	const dob=req.body.dob;
	const heathstatus=req.body.heathstatus;
	const symptions=req.body.symptions;
	const diseases=req.body.diseases;
	const addition=req.body.addition;
	const allergies=req.body.allergies;
	const hospitalized=req.body.hospitalized;
	const additionalinfo=req.body.additionalinfo;
		console.log(req.body);
		console.log("#####");

	User.findById(req.user._id)
	.then(result=>{
			result.name=name;
			result.medical.gender=gender;
			result.medical.dob=dob;
			result.medical.heathstatus=heathstatus;
			result.medical.symptions=symptions;
			result.medical.diseases=diseases;
			result.medical.addition=addition;
			result.medical.allergies=allergies;
			result.medical.hospitalized=hospitalized;
			result.medical.additionalinfo=additionalinfo;

			return result.save((err)=>{
				console.log(err);
				req.session.user=result;
				res.redirect('/afterlogin');
			});
		})
	.catch((err)=>{
			const er=new Error('Error');
			next(er);
		});
		
};


