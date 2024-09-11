const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/TourModel');
dotenv.config({ path: './env_config.env' });
const DB = process.env.database.replace("<Password>",process.env.database_Password);

mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:false,
    useCreateIndex:true,
    useUnifiedTopology:true
}).then(conn=>console.log('connect successfully!!'));

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours_simple.json`,'utf-8')
)
const import_data = async()=>{
    try{
        console.log(tours);
        await Tour.create(tours);
        console.log('import successfully!!');
    }catch(err){
        console.log(err);
    }
    process.exit();
}

const delete_data = async()=>{
    try{
        await Tour.deleteMany();
        console.log('delete successfully !!');
    }catch(err){
        console.log(err);
    }
    process.exit();
}
console.log(process.argv);

if(process.argv[2]=='--import'){
    import_data();
}else if(process.argv[2]=='--delete'){
    delete_data();
}else{
    console.log('nothing');
}