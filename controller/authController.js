const User = require("../model/UserModel");
const catchAsync = require('./../utils/catchAsync');
const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const SignToken = id => {
    return jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});
}

exports.SignUp = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password:req.body.password,
        passwordconfirm:req.body.passwordconfirm
    });
    const token = SignToken(newUser._id);
    res.status(201).json({
        status:"success",
        token,
        data:{
            User:newUser
        }
    });
})

exports.login = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email||!password){
        return next(new AppError("please provide email and password"));
    }

    const Users = await User.findOne({email}).select('+password')
    if(!Users||!await Users.CorrectPassword(password,Users.password)){
        return next(new AppError("Incorrect email or password"),401)
    }

    const token = SignToken(User._id);
    res.status(200).json({
        status:"success",
        token
    })
})