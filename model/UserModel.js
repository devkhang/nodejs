const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true,"User must have name"],
        maxlength:[40,"name must have less or equal 40"],
        minlength:[10,"name must have greater than or equal 10"]
    },
    email:{
        type:String,
        require:[true,"User must have email"],
        unique:true,
        validate:{validator:function(value){
            return validator.isEmail(value);
        },message:"please provide email address"}
    },
    photo:{
        type:String
    },
    password:{
        type:String,
        require:[true,"User must have password"],
        minlength:[8,"name must have greater than or equal 10"],
        validate:{validator:function(value){
            return /(?=.*[a-z])(?=.*[A-Z])/.test(value);
        },message: 'Password must contain at least one uppercase and one lowercase letter'},
        select : false
    },
    passwordconfirm:{
        type:String,
        require:[true,"please confirm you password"],
        minlength:[8,"name must have greater than or equal 10"],
        validate:{
            validator:function(value){
                return value==this.password;
            },
            message: 'Passwordconfirm is not same with Password'
        }
    }
});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,12);
    this.passwordconfirm = undefined;
    next();
});

UserSchema.methods.CorrectPassword = async function(candidatePassword,password){
    return await bcrypt.compare(candidatePassword,password);
};

const User = mongoose.model("User",UserSchema);
module.exports = User;