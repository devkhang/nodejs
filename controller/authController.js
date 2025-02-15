const User = require("../model/UserModel");
const catchAsync = require('./../utils/catchAsync');
const jwt = require("jsonwebtoken")
const AppError = require("../utils/AppError")
const {promisify} = require("util")
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const SignToken = id => {
    return jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});
}
const CreateSendToken = (user,statusCode,res) =>{
    const token = SignToken(user.id);
    const cookieOption = {
        expires: new Date( Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV==='production')cookieOption.secure = true;
    res.cookie('jwt',token,cookieOption);
    user.password = undefined;
    res.status(statusCode).json({
        status : "success",
        token,
        data:{
            user
        }
    })
}

exports.SignUp = catchAsync(async (req,res,next) => {
    const newUser = await User.create({
        name : req.body.name,
        email: req.body.email,
        password:req.body.password,
        passwordconfirm:req.body.passwordconfirm,
        role:req.body.role
    });
    CreateSendToken(newUser,201,res);
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

    CreateSendToken(Users,200,res);
})
exports.Protect = catchAsync(async (req,res,next) =>{
    let token;
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token){
        return next(new AppError("You are not Logged in! please log in to get access "));
    }
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("The user belonging to this token does no longer exist.",401));
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
          new AppError('User recently changed password! Please log in again.', 401)
        );
    }
    req.user = currentUser;
    next();
})
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}
exports.forgotPassword = catchAsync(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return new AppError('There is no user with email address.', 404);
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
    
      const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    
      try {
        await sendEmail({
            email:user.email,
            subject:"Your password reset token (valid for 10 min)",
            message
        });
    
        res.status(200).json({
          status: 'success',
          message: 'Token sent to email!'
        });
      } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
    
        return next(
          new AppError('There was an error sending the email. Try again later!'),
          500
        );
      }
})
exports.resetPassword = catchAsync(async(req,res,next)=>{
    const hashedToken = crypto.createHash('sha256')
                              .update(req.params.token)
                              .digest("hex");
    const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}});
    if(!user){
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordconfirm = req.body.passwordconfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    CreateSendToken(user,200,res);
})
exports.updatePassword = catchAsync(async(req,res,next)=>{
    console.log("kkk");
    const user = await User.findById(req.user.id).select("+password");
    if(!(await user.CorrectPassword(req.body.currentPassword,user.password))){
        return next(new AppError("Your current password is wrong.",401))
    }
    user.password = req.body.password;
    user.passwordconfirm = req.body.passwordConfirm;
    await user.save();
    CreateSendToken(user,200,res);
})