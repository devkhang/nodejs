const express = require('express');
const Router = express.Router();
const UserController = require('./../controller/UserController');
const authController = require('../controller/authController')
Router.post("/signup",authController.SignUp);

Router.post("/login",authController.login);

Router.route('/').get(UserController.getAllUser).post(UserController.createUser);

Router.route('/:id').get(UserController.getUser).patch(UserController.UpdateUser).delete(UserController.deleteUser);

module.exports = Router;