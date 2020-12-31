const { string, func } = require('joi')
const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
        path: String,
        filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.path.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    description: String,
    location: String,
    images: {
        type: [ImageSchema],
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    }
}, {
    toJSON: {
        virtuals: true
    }
})

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.remove({_id : {
            $in: doc.reviews
        }})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)