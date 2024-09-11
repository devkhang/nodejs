const express = require('express');
const Router = express.Router();
const UserController = require('./../controller/UserController');

Router.route('/').get(UserController.getAllUser).post(UserController.createUser);

Router.route('/:id').get(UserController.getUser).patch(UserController.UpdateUser).delete(UserController.deleteUser);

module.exports = Router;