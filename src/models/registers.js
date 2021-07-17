const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    
    age:{
        type: Number,
        required: true
    },
    number:{
        type: Number,
        required: true
    },

    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        console.log("vanthuten")
        const token =  jwt.sign({_id:this._id},process.env.SECRET)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(error){
res.send("the error "+ error)
    }
}
//hash
userSchema.pre("save",async function(next){
    if(this.isModified('password')){

    this.password = await bcrypt.hash(this.password,10);
        this.cpassword = await bcrypt.hash(this.password,10);
}
    next()
})
//collections

const Register = new mongoose.model("Register",userSchema)  //singular form collection name

module.exports = Register