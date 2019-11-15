const axios = require('axios')
let google_auth = require('../lib/google-auth')

let BASE_API_URL = process.env.BASE_API_URL

let homepage = function(req, res){
    console.log('homepage')
    let user_details = false
    if (req.session.hasOwnProperty('user')){
        user_details = req.session.user
    } else {
        return res.status(301).redirect('/login')
    }
    res.render('pages/index', {
        title: 'Home',
        user: user_details
    });
}

let googleURLHandler = function(req, res) {
    return res.status(200).send({
        google_url: google_auth.googleUrl()
    })
}

let loginpage = function(req, res) {
    res.render('pages/login', {
        google_url: google_auth.googleUrl(),
        title: 'login'
    })
}

let loginHandler = async function(req, res) {
    let params = req.body
    console.log('params: ', params)

    let API_URL = BASE_API_URL + '/login'
    console.log('API_URL: ', API_URL)

    axios.post(API_URL, {
        email: params.email,
        password: params.password
    })
    .then(function (response) {
        console.log('[signIn] axios response: ', response);
        res.render('pages/index')
    })
    .catch(function (error) {
        console.log('error: ', error)
        res.render('pages/login')
    });

}

let logoutHandler = async function(req, res) {
    let logged_out = await req.session.destroy()
    console.log('logged_out: ', logged_out)
    if (logged_out){
        res.status(301).redirect('/login')
    } else {
        res.status(301).redirect('/')
    }
}

let callbackHandler = async function(req, res) {
    let code = req.query.code
    console.log('code: ', code)
    let user_details = await google_auth.getGoogleAccountFromCode(code)
    console.log('user_details: ', user_details)

    if (user_details.hasOwnProperty('id')){
        req.session.user = user_details
        res.redirect('/')
        return
    } else {
        res.redirect('pages/login')
    }
}

module.exports = {
    homepage: homepage,
    loginView: loginpage,
    loginHandler: loginHandler,
    callbackHandler: callbackHandler,
    logoutHandler: logoutHandler,
    googleURLHandler: googleURLHandler
}