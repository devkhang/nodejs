// const express = require('express');
const Tour = require("./../model/TourModel");
const { Mongoose } = require('mongoose');
const APIfeature = require('./../utils/apifeature');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
// const fs = require('fs');


exports.aliasTopTour = (req,res,next)=>{
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,rating,summary,difficulty';
    next();
}

exports.getTourById = catchAsync(async(req,res,next)=>{
    // console.log(req.params);
        const Tours = await Tour.findById(req.params.id);
        if(!Tours){
            return next(new AppError('can not find this ID in database',404));
        }
        res.status(200).json({
            status:'success',
            data:{
                Tours
            }
        });
});


const test = (req, res) => {
    res.send('Welcome to the Tour API!');
};

exports.getAllTour = catchAsync(async (req, res,next) => {
        // Thực thi query
        const feature = new APIfeature(Tour.find(),req.query)
        .filter()
        .sort()
        .limitfields()
        .paginate();
        const tours = await feature.query;

        // if(!tours){
        //     return new AppError('can not find this ID in database',404);
        // }

        // Trả về kết quả
        res.status(200).json({
            // requestAt: current.toString(),
            status: 'success',
            length: tours.length,
            data: {
                tours
            }
        });
})

exports.createTour = catchAsync(async(req,res,next)=>{
    const newTour =  await Tour.create(req.body);

    res.status(201).json({
        status:'success',
        result: newTour.length,
        data:{
            tour:newTour
        }
    })
});

exports.updateTourById = catchAsync(async(req,res,next)=>{
    const Tours = await Tour.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!Tours){
        return next(new AppError('can not find this ID in database',404));
    }
    res.status(200).json({
        status:'success',
        data:{
            Tours
        }
    })
});

exports.deleteTourById = catchAsync(async(req,res,next)=>{
    const Tours = await Tour.findByIdAndDelete(req.params.id,{projection:{name:1,price:1}});
    if(!Tours){
        return new AppError('can not find this ID in database',404);
    }
    res.status(200).json({
        status:'success',
        data:{
            Tours
        }
    })
})

exports.getTourstats =  catchAsync(async(req,res,next)=>{
    const stats = await Tour.aggregate([
        {
            $match:{ratingsAverage:{$gte:4.5}}
        },
        {
            $group:{
                _id:{$toUpper:'$difficulty'},
                count:{$sum:1},
                sumquantity:{$sum:'$ratingsQuantity'},
                avgRating:{$avg:'$ratingsAverage'},
                avgprice:{$avg:'$price'},
                minprice:{$min:'$price'},
                maxprice:{$max:'$price'}
            }
        },
        {
            $sort:{avgprice:1}
        }
    ]);
    res.status(200).json({
        status:'success',
        length: stats.length,
        data:{
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async(req,res,next)=>{
        const year = req.params.year*1;
        const Plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`),
                    }
                },
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTours:{$sum:1},
                    tour:{$push:'$name'}
                }
            },
            {
                $addFields:{
                    month:'$_id'
                },
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{numTours:-1}
            },
        ]);
        res.status(200).json({
            status:'success',
            length: Plan.length,
            data:{
                Plan
            }
        })
})
