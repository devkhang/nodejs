const express = require("express");
const morgan = require('morgan');
const UserRouter = require('./router/UserRouter');
const TourRouter = require('./router/TourRouter');

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

// app.get('/',test);


// app.get('/api/v1/tour',getAllTour);

// app.get('/api/v1/tour/:id',getTourById);

// app.post('/api/v1/tour',createTour);

// app.patch('/api/v1/tour/:id',updateTourById);

// app.delete('/api/v1/tour/:id',deleteTourById);


app.use('/api/v1/tours',TourRouter);
app.use('/api/v1/User',UserRouter);

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`can't find ${req.originalUrl} Router on the server`
    // })
    const err = new Error(`can't find ${req.originalUrl} Router on the server`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
})

module.exports = app;