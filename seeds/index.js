const mongoose = require('mongoose')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', ()=>{
    console.log('Database connected')
})

const cities = ['Lahore', 'Karachi', 'Islamabad', 'Quetta', 'Gawadar', 'Multan', 'Kumrat']
const prices = [12000, 15000, 13000, 8000, 10000, 17000]
const areas = ['Mountain', 'Riverside', 'Canyon', 'Beach', 'Forest', 'Lake', 'Ruins']
const climate = ['Snowy', 'Cold', 'Arid', 'Cloudy', 'Humid', 'Warm', 'Hot']

const getItem = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async ()=> {
    await Campground.deleteMany({})

    for(let i = 0; i < 20; i++){
        const camp = new Campground({
            author: '5fea16fc9153250da0a4c307',
            title: `${getItem(climate)} ${getItem(areas)}`,
            price: getItem(prices),
            location: getItem(cities),
            description: 'random description to sell to random people',
            geometry :{
                type : "Point",
                coordinates : [ -0.1275, 51.50722 ]
            },
            images: [
                {
                  path: 'https://res.cloudinary.com/dplrqxlo7/image/upload/v1609324856/YelpCamp/ccrdgngzzkdjtxzy57tn.jpg',
                  filename: 'YelpCamp/ccrdgngzzkdjtxzy57tn'
                },
                {
                  path: 'https://res.cloudinary.com/dplrqxlo7/image/upload/v1609324855/YelpCamp/pfyoddueilcrsxasgzye.jpg',
                  filename: 'YelpCamp/pfyoddueilcrsxasgzye'
                }
              ]
        })

        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})