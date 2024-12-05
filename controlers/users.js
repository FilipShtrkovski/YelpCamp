const User = require('../models/user.js')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async (req, res, next)=>{
    try{
        const {username, email, password} = req.body
        const user = new User({ email, username })
        const registerUser = await User.register(user, password)
        req.login(registerUser, (err)=>{
            if (err) return next(err)
            req.flash("success","WELCOME TO YELPCAMP")
            res.redirect('/campgrounds')
        })
        
    }catch(error){
        req.flash('error', error.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success', 'Welcome back')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

