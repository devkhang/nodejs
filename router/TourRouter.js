const express = require('express');
const Router = express.Router();
const authController = require('../controller/authController');
const TourController = require('./../controller/TourController');
const ReviewController = require('../controller/ReviewController');

Router.param('id',(req,res,next,val)=>{
    console.log(`id in param ${val}`);
    next();
})
Router.route('/monthly-plan/:year').get(TourController.getMonthlyPlan);

Router.route('/tours-stats').get(TourController.getTourstats);

Router.route('/top-5-cheap').get(TourController.aliasTopTour,TourController.getAllTour);

Router.route('/').get(TourController.getAllTour).post(TourController.createTour);

Router.route('/:id').get(TourController.getTourById).patch(TourController.updateTourById).delete(authController.Protect,authController.restrictTo('admin','lead-guide'),TourController.deleteTourById);

Router.route('/:TourId/Review').post(authController.Protect,authController.restrictTo('user'),ReviewController.CreateNewReview)

module.exports = Router;