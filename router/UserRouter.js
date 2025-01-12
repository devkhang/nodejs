const express = require('express');
const Router = express.Router();
const UserController = require('./../controller/UserController');
const authController = require('../controller/authController')
Router.post("/signup",authController.SignUp);

Router.post("/login",authController.login);

Router.patch('/updateMe', authController.Protect, UserController.updateMe);
Router.patch("/updatePassword",authController.Protect,authController.updatePassword);
Router.delete("/deleteMe",authController.Protect,UserController.deleteMe);

Router.post("/forgotPassword",authController.forgotPassword)

Router.patch('/resetPassword/:token',authController.resetPassword)

Router.route('/').get(authController.Protect,UserController.getAllUser).post(UserController.createUser);

Router.route('/:id').get(UserController.getUser).patch(UserController.UpdateUser).delete(UserController.deleteUser);

module.exports = Router;