const express = require('express')
const router = express.Router()
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware.js')
const campgrounds = require('../controlers/campgrounds.js')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground,  catchAsync(campgrounds.createCampground))
    
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isAuthor, isLoggedIn, catchAsync(campgrounds.renderEditForm))


module.exports = router 
