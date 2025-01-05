const express = require('express');
const User = require("./../model/UserModel");
const catchAsync = require('./../utils/catchAsync');

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