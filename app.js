const express = require("express");
const morgan = require('morgan');
const UserRouter = require('./router/UserRouter');
const TourRouter = require('./router/TourRouter');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controller/ErrorController');
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSantitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const ReviewRouter = require('./router/ReviewRouter');

const app = express();
app.use(helmet());
console.log(process.env.Node_ENV);
if(process.env.Node_ENV === 'development'){
    app.use(morgan('dev'));
}

const limiter = ratelimit({
    max:100,
    windowMs:1000*60*60,
    message:"Too Many request from this IP,  please try again in hour later",
})
app.use("/api",limiter);

app.use(express.json({limit:"10kb"}));

app.use(mongoSantitize());

app.use(xss());

app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
);

app.use(express.static('public'));

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});

app.use('/api/v1/tours',TourRouter);
app.use('/api/v1/User',UserRouter);
app.use('/api/v1/Review',ReviewRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} Router on the server`,404));
})

app.use(globalErrorHandler);

module.exports = app;