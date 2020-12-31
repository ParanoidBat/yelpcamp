const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.Index = async (req, res)=>{
    const camps = await Campground.find({})
    res.render('campground/index', {camps})
}

module.exports.AddNewCampground = async (req, res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()

    const camp = new Campground(req.body)
    camp.geometry = geoData.body.features[0].geometry
    camp.author = req.user._id
    camp.images = req.files.map(f => ({path: f.path, filename: f.filename}))

    await camp.save()

    req.flash('success', 'Successfully added new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.NewCampgroundForm = (req, res)=>{
    res.render('campground/new')
}

module.exports.ShowCampground = async (req, res)=>{
    const camp = await Campground.findById(req.params.id).populate(
        {path: 'reviews',
        populate:{
            path: 'author'
        }
        }).populate('author')
    
    if(!camp){
        req.flash('error', 'Campground doesn\'t exist')
        return res.redirect('/campgrounds')
    }
    res.render('campground/show', {camp})
}

module.exports.UpdateCampground = async (req, res)=>{
    const {id} = req.params

    const camp = await Campground.findByIdAndUpdate(id, req.body, {runValidators: true})
    camp.images.push(...req.files.map(f => ({path: f.path, filename: f.filename})))

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }

        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }

    await camp.save()

    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.DeleteCampground = async (req, res)=>{
    await Campground.findByIdAndDelete(req.params.id)

    req.flash('success', 'Your campround has been deleted')
    res.redirect('/campgrounds')
}

module.exports.EditCampgroundForm = async(req, res)=>{
    const camp = await Campground.findById(req.params.id)
    
    if(!camp){
        req.flash('error', 'Campground doesn\'t exist')
        return res.redirect('/campgrounds')
    }

    res.render('campground/edit', {camp})
}