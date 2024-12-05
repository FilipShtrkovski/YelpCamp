const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const price= Math.floor(Math.random() * 20) + 10
        const camp = await new Campground ({
            //My id in author
            author: '673c94bd5a37695ce9f67f99',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city} - ${cities[rand1000].state}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus modi quia consequuntur quibusdam repellendus id provident, nam consectetur perferendis sint eum, neque dolore ipsam omnis ab ducimus cupiditate dolores quas?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [ 
                    cities[rand1000].longitude,
                    cities[rand1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/daiuoiqvv/image/upload/v1732721553/YelpCamp/g5jxompcwc9vd36qkust.jpg',
                    filename: 'YelpCamp/g5jxompcwc9vd36qkust'
                  },
                  {
                    url: 'https://res.cloudinary.com/daiuoiqvv/image/upload/v1732721578/YelpCamp/ksc4kxe2arwx2mwjwdr6.jpg',
                    filename: 'YelpCamp/ksc4kxe2arwx2mwjwdr6'
                  }
            ]
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})