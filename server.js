const dotenv = require('dotenv');
dotenv.config({path :'./env_config.env'});
const app = require('./app');
const mongoose = require('mongoose')

const DB = process.env.database.replace("<Password>",process.env.database_Password);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
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
app.listen(port,()=>{
    console.log("listening app port 3000");
})