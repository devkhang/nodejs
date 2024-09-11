const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const Tourschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'a tour must have name'],
        unique:true,
        trim:true,
        minlength:[10,'tour name must have more or equal than 10 character'],
        maxlength:[40,'tour name must have less or equal than 40 character'],
        validate: [validator.isAlpha,'a tour must only have character']
    },
    slug:String,
    duration:{
        type:Number,
        require:[true,'a tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'a tour must have a maxGroupSize']
    },
    difficulty:{
        type:String,
        required:[true,'a tour must have a difficulty'],
        enum:['easy','medium','difficult'],
        message: '{VALUE} is not supported',
    },
    rating:{
        type:Number,
        default:4.5,
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1.0,'rating must have more than or equal than 1.0'],
        max:[5.0,'rating must have less than or equal 5.0']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'a tour must have price']
    },
    priceDiscount :{
        type:Number,
        default:0,
        validate: {
            validator: function(val){
            return val<this.price;
        },
        message: 'discount price {VALUE} must be lest than regular price'
        }
    },
    summary:{
        type:String,
        trim:true
    },
    secretTour:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:[true,'a tour must have a description'],
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'a tour must have a imageCover']
    },
    images:[String],
    createAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date]
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

Tourschema.virtual('durationweek').get(function(){
    return this.duration/7;
})

Tourschema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true,strict:true});
    next();
})

Tourschema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start = Date.now();
    next();
})



Tourschema.post(/^find/,function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
})

Tourschema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
    next();
})

Tourschema.post('aggregate',function(result,next){
    // console.log(result);
    next();
})

const Tour = mongoose.model("Tour",Tourschema);

module.exports = Tour;