const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"User must have name"],
        maxlength:[40,"name must have less or equal 40"],
        minlength:[10,"name must have greater than or equal 10"]
    },
    email:{
        type:String,
        required:[true,"User must have email"],
        unique:true,
        validate:{validator:function(value){
            return validator.isEmail(value);
        },message:"please provide email address"}
    },
    photo:{
        type:String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password:{
        type:String,
        required:[true,"User must have password"],
        minlength:[8,"name must have greater than or equal 10"],
        validate:{validator:function(value){
            return /(?=.*[a-z])(?=.*[A-Z])/.test(value);
        },message: 'Password must contain at least one uppercase and one lowercase letter'},
        select : false
    },
    passwordconfirm:{
        type:String,
        required:[true,"please confirm you password"],
        minlength:[8,"name must have greater than or equal 10"],
        validate:{
            validator:function(value){
                return value==this.password;
            },
            message: 'Passwordconfirm is not same with Password'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    Active:{
        type:Boolean,
        select:false,
        default:true
    }
});

UserSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,12);
    this.passwordconfirm = undefined;
    next();
});
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')||this.isNew)return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
UserSchema.pre(/^find/,function(next){
    this.find({Active:{$ne:false}});
    next();
})

UserSchema.methods.CorrectPassword = async function(candidatePassword,password){
    return await bcrypt.compare(candidatePassword,password);
};
UserSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(JWTTimeStamp,changedTimeStamp);
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
}
UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
                                    .update(resetToken)
                                    .digest("hex");
    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const User = mongoose.model("User",UserSchema);
module.exports = User;