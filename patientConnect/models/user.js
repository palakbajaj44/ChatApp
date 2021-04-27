const mongoose =require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	},
	medical:{
		gender:{
		type:String,
		//required:true
	},
	dob:{
		type:Date,
		//required:true
	},
	heathstatus:{
		type:String,
		//required:true
	},
	symptions:{
		type:String,
		//required:true
	},
	diseases:[{
		type:String,
		//required:true
	}],
	addition:[{
		type:String,
		//required:true
	}],
	allergies:{
		type:String,
		//required:true
	},
	hospitalized:{
		type:String,
		//required:true
	},
	additionalinfo:{
		type:String,
	}
	}
});

module.exports=mongoose.model('User',userSchema);