const express = require('express');
const Router = express.Router();
const TourController = require('./../controller/TourController');

Router.param('id',(req,res,next,val)=>{
    console.log(`id in param ${val}`);
    next();
})
Router.route('/monthly-plan/:year').get(TourController.getMonthlyPlan);

Router.route('/tours-stats').get(TourController.getTourstats);

Router.route('/top-5-cheap').get(TourController.aliasTopTour,TourController.getAllTour);

Router.route('/').get(TourController.getAllTour).post(TourController.createTour);

Router.route('/:id').get(TourController.getTourById).patch(TourController.updateTourById).delete(TourController.deleteTourById);

module.exports = Router;