const express = require('express');
const User = require("./../model/UserModel");
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');

const filterObj = (obj,...allowfields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el =>{
        if(allowfields.includes(el))newObj[el] = obj[el];
    });
    return newObj;
}

exports.getAllUser = catchAsync(async(req,res,next)=>{
    const user = await User.find();

    res.status(200).json({
        // requestAt: current.toString(),
        status: 'success',
        length: user.length,
        data: {
            user
        }
    });
})
exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{Active:false});
    res.status(204).json({
        status:"success",
        data:null
    })
})

exports.updateMe = catchAsync(async(req,res,next) =>{
    if(req.body.password||req.body.password){
        return next(new AppError("This route is not for password updates. Please use /updateMyPassword"),400)
    }
    const filteredBody = filterObj(req.body,'name','email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    })
})

exports.getUser = (req,res)=>{
    res.status(500).json({
        status : 'error',
        message :'this router is not define yet'
    })
}

exports.createUser = (req,res)=>{
    res.status(500).json({
        status : 'error',
        message :'this router is not define yet'
    })
}


exports.UpdateUser = (req,res)=>{
    res.status(500).json({
        status : 'error',
        message :'this router is not define yet'
    })
}


exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status : 'error',
        message :'this router is not define yet'
    })
}