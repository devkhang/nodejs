const express = require("express");
const morgan = require('morgan');
const UserRouter = require('./router/UserRouter');
const TourRouter = require('./router/TourRouter');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/ErrorController');

const app = express();
console.log(process.env.Node_ENV);
if(process.env.Node_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static('public'));

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours',TourRouter);
app.use('/api/v1/User',UserRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} Router on the server`,404));
})

app.use(globalErrorHandler);

module.exports = app;