const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async(req,res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, {limit:1})
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.features[0].geometry
    campground.images = req.files.map(f => ({url:f.path, filename:f.filename}))
    campground.author = req.user.id
    console.log(campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    .populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    }).populate('author')
    if(!camp){
        req.flash('error', 'Campgorund not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {camp})
}

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    if(!camp){
        req.flash('error', 'Campgorund not found')
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit', {camp})
}

module.exports.updateCampground = async(req,res) => {
    const {id} = req.params
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url:f.path, filename:f.filename}))
    camp.images.push(...imgs)
    await camp.save()
    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images:{ filename: {$in: req.body.deleteImages} } } })
    }
    
    req.flash('success', 'Successfully updated a new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a new campground')
    res.redirect('/campgrounds')
}