const bcrypt=require('bcrypt');
const User=require('../models/user');
const mongoose=require('mongoose');

exports.getLogin=(req,res,next)=>{
	let message=req.flash('error');
	if(message.length>0){
		message=message[0];
	}
	else{
		message=null;
	}
	res.render('ad_log',{
		errorMessage:message
	});
};

exports.postLogin=(req,res,next)=>{
	const password=req.body.password;
	const email=req.body.email;
	User.findOne({email:email})
	.then(result=>{
		if(!result){
			req.flash('error','Invalid Data');
			return res.redirect('/admin/login');
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
					res.redirect('/admin/afterlogin');
				});
			}
			else{
				req.flash('error','Invalid Data');
				return res.redirect('/admin/login');
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

exports.getAfterLogin=(req,res,next)=>{
	res.render('admin',{
			name:'',
			gender:'',
			email:'',
			data:false,
			heathstatus:'',
			symptions:'',
			diseases:'',
			addition:'',
			allergies:'',
			hospitalized:'',
			additionalinfo:''
		});
};
exports.postLogout=(req,res,next)=>{
	req.session.destroy((err)=>{

		console.log("sussesfully destroyed"+err);
		res.redirect('/admin/login');
	});
};

exports.postShow=(req,res,next)=>{
	console.log('REached#######');
	//{ where: { id: prodId }
	//Card.find({userId:new mongoose.Types.ObjectId(req.session.user._id)})
	User.find({_id:new mongoose.Types.ObjectId(req.body.id)})
	.then(re=>{
		//console.log(re);
		const e=re[0];
		if(e){
			let data=true;
		res.render('admin',{
			name:e.name,
			gender:e.medical.gender,
			email:e.email,
			data:data,
			heathstatus:e.medical.heathstatus,
			symptions:e.medical.symptions,
			diseases:e.medical.diseases,
			addition:e.medical.addition,
			allergies:e.medical.allergies,
			hospitalized:e.medical.hospitalized,
			additionalinfo:e.medical.additionalinfo
		});
	}
	else{
		res.render('admin',{
			name:'',
			gender:'',
			email:'',
			data:false,
			heathstatus:'',
			symptions:'',
			diseases:'',
			addition:'',
			allergies:'',
			hospitalized:'',
			additionalinfo:''
		});
	}
	})
	.catch(er=>{console.log("err in fetching cards",er)});
};
