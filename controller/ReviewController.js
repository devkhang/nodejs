const Review = require('../model/ReviewModel');
const catchAsync = require('../utils/catchAsync')

exports.getAllReview = catchAsync(async(req,res,next)=>{
    const review = await Review.find();

    res.status(200).json({
        status:'success',
        result: review.length,
        data:{
            review:review
        }
    })
})
exports.CreateNewReview = catchAsync(async(req,res,next)=>{
    if(!req.body.tour) req.body.tour = req.params.TourId;
    if(!req.body.user) req.body.user = req.user.id;
    const NewReview = await Review.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            review:NewReview
        }
    })
})