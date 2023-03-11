const mongoose=require('mongoose');
const schema=mongoose.Schema;


const userSchema=new schema({
	fullName:{type:String,trim:true},
	userName:{type:String,required:true,unique:true,trim:true},
	email:{type:String,required:true},
	password:{type:String,required:true,trim:true},	
	token: { type: String },
	contacts:[{
		userName:{type:String},
		chatListTable:{type:String}
		}]

},{timestamps:true});

const messageSchema=new schema({
	sender:{type:String},//insert their userName
	reciever:{type:String},
	message:{type:String,trim:true},

},{timestamps:true});

const locationSchema=new schema({
	lat:{type:Number},
	lng:{type:Number},
	userName:{type:String}

},{timestamps:true});
  



const Location =mongoose.model("Location",locationSchema);
const User=mongoose.model('User',userSchema);
const Message=mongoose.model('Messages',messageSchema);

module.exports.messageSchema=messageSchema;
module.exports.Location=this.Location;
module.exports.User=User;
module.exports.Message=Message;