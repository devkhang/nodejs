// const express = require('express');
const Tour = require("./../model/TourModel");
const { Mongoose } = require('mongoose');
const APIfeature = require('./../utils/apifeature');
// const fs = require('fs');


exports.aliasTopTour = (req,res,next)=>{
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,rating,summary,difficulty';
    next();
}

exports.getTourById = async(req,res)=>{
    // console.log(req.params);
    try{
        const Tour1 = await Tour.findById(req.params.id);
        res.status(200).json({
            status:'success',
            data:{
                Tour1
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });        
    }
};

const test = (req, res) => {
    res.send('Welcome to the Tour API!');
};

exports.getAllTour = async (req, res) => {
    try {
        // Thực thi query
        const feature = new APIfeature(Tour.find(),req.query)
        .filter()
        .sort()
        .limitfields()
        .paginate();
        const tours = await feature.query;

        // Trả về kết quả
        res.status(200).json({
            // requestAt: current.toString(),
            status: 'success',
            length: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        console.error('Error details:', err);  // In ra lỗi chi tiết để debug
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createTour = async(req,res)=>{
    try{
    const newTour =  await Tour.create(req.body);

    res.status(201).json({
        status:'success',
        result: newTour.length,
        data:{
            tour:newTour
        }
    })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateTourById = async(req,res)=>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
};

exports.deleteTourById = async(req,res)=>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id,{projection:{name:1,price:1}});
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    }
};

exports.getTourstats =  async(req,res)=>{
    try{
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
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })        
    }
}

exports.getMonthlyPlan = async(req,res)=>{
    try{
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
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })  
    }
}