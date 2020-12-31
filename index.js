if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require ('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MongoStore = require('connect-mongo')(session)

const ExpressError = require('./utils/ExpressError')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')

const User = require('./models/user')

const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(flash())

const dbUrl = process.env.DB_URL
const secret = process.env.SECRET || 'trolol'

const store = new MongoStore({
    url: dbUrl || 'mongodb://localhost:27017/yelp-camp',
    secret,
    touchAfter: 24*60*60 // seconds
}).on('error', function(e){
    console.log('Session Store Error:', e)
})

app.use(session({
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        maxAge: 7*24*60*60*1000 // milli seconds
    }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection error:'))
db.once('open', ()=>{
    console.log('Database connected')
})

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res)=>{
    res.render('campground/home')
})

app.all('*', (req, res, next) =>{
    next( new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500, message = 'Some Error Occurred'} = err
    res.status(statusCode).render('error', {message, stack : err.stack})
})