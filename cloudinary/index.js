const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINERY_CLOUD_NAME,
    api_key: process.env.CLOUDINERY_KEY,
    api_secret: process.env.CLOUDINERY_SECRET
})


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'YelpCamp',
        allowedFormats: ['jpag', 'png', 'jpg']  
    }
     
})

module.exports = {
    cloudinary,
    storage
}
