const dotenv = require('dotenv');
dotenv.config({path :'./env_config.env'});
const app = require('./app');
const mongoose = require('mongoose')

const DB = process.env.database.replace("<Password>",process.env.database_Password);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
    console.log('Database connection string:', mongoose.connection.client.s.url);
    console.log('Database name:', mongoose.connection.name);
}).catch(err => {
    console.error('Connection error', err.message);
});

// console.log(process.env);

// delete mongoose.models.Tour;
// delete mongoose.modelSchemas.Tourschema; 

const port = process.env.Port||3000;
const server = app.listen(port,()=>{
    console.log("listening app port 3000");
})

process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log("Unhandler REJECTION : SHUTTING DOWN ****");
    server.close(()=>{
        setTimeout(() => {
            console.log('Thực hiện tác vụ bất đồng bộ');
        }, 1000);// cái này không được chạy
        process.exit(1);
    })
})

process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    console.log("uncaughtException : SHUTTING DOWN ****");
    server.close(()=>{
        setTimeout(() => {
            console.log('Thực hiện tác vụ bất đồng bộ');
        }, 1000);// cái này không được chạy
        process.exit(1);
    })
})
