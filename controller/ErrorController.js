const AppError = require('./../utils/AppError');

const handleCastErrorDB = err =>{
    const message = `invalid ${err.path}:${err.value}`;
    return new AppError(message,400);
};

const handleJWTTokenExpired = ()=>{
    return new AppError("You Token has Expire! please log in again",401);
}

const handleJWTInvalidToken = ()=>{
    return new AppError("Invalid token! please log in again",401);
}

const handleDuplicateFieldsDB = err => {
    // console.log(err);
    // Giả sử `keyValue` chứa giá trị trường bị trùng lặp.
    // Lấy giá trị trùng lặp đầu tiên (nếu có nhiều hơn một trường bị trùng)
    const value = Object.values(err.keyValue);

    // Tạo thông báo lỗi với giá trị trùng lặp được tìm thấy
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
  
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const SendErrorDev = (err,res)=>{
    console.log(err.name);
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack:err.stack
    });
}
const SendErrorProd = (err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }else{
        console.error('error !!!!!!',err);
        res.status(500).json({
            status: 'error',
            message: 'something went wrong happening',
        });
    }
}

module.exports = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV ==='development'){
        SendErrorDev(err,res);
    }else if(process.env.NODE_ENV==='production'){
        let error = err;
        // console.log(error);
        // console.log(error.name);
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError')error = handleJWTInvalidToken();
        if(error.name === 'TokenExpiredError')error = handleJWTTokenExpired();
        SendErrorProd(error,res);
    }
}