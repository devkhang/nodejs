const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./TourModel');
const Tour = require('./TourModel');
const User = require('./UserModel');

const ReviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true,'review can not empty!!'],
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:Date,
        default:Date.now
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,"A Review must belong to tour"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"A Review must belong to User"]
    }
},
{
    toJson:{virtuals:true},
    toObject:{virtuals:true}
});

ReviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
    next();
})

const Review = mongoose.model("Review",ReviewSchema);
module.exports = Review;