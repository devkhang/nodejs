const express = require('express');
const Router = express.Router();
const ReviewController = require('../controller/ReviewController');
const authController = require("../controller/authController");

Router
.route('/')
.get(ReviewController.getAllReview)
.post(
    authController.Protect,
    authController.restrictTo('user'),
    ReviewController.CreateNewReview
)

module.exports = Router;