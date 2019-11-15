const axios = require('axios')
let google_auth = require('../lib/google-auth')

let BASE_API_URL = process.env.BASE_API_URL

function setPrimaryTheme() {
    let theme = process.env.PRIMARY_THEME
    let theme_list = {
        "DEFAULT": "bg-gradient-default",
        "BLUE": "bg-gradient-primary",
        "GREEN": "bg-gradient-success"
    }
    return theme_list[theme]
}

let homepage = function(req, res){
    try {
        let user_details = false
        if (req.session.hasOwnProperty('user')){
            console.log('[homepage frontend] redirect user to dashboard')
            user_details = req.session.user
            console.log('[homepage frontend] user_details ', user_details)
            res.render('pages/index', {
                title: 'Home',
                user: user_details,
                queue_url: process.env.QUEUE_URL,
                primary_theme: setPrimaryTheme()
            });
            return
        } else {
            console.log('[homepage frontend] redirect user to login')
            return res.status(301).redirect('/login')
        }
    } catch(error) {
        console.error('[loginHandler frontend] error: ', error);
    }
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

async function callbackend(email, password) {
    let API_URL = BASE_API_URL + '/login'
    console.log('[loginHandler frontend] API_URL: ', API_URL)
    let user_details = await axios.post(API_URL, {
                            email: email,
                            password: password
                        })
                        .then(function (response) {

                            // let status_code = response.status
                            // let user_details = response.data

                            console.log('[loginHandler frontend] status code: %s, data: ',
                            response.status, response.data)
                            return response.data
                        })
                        .catch(function (error) {
                            console.log('[loginHandler frontend] error: ', error)
                            return false
                        });
    return user_details
}

let loginHandler = async function(req, res) {
    try {
        let params = req.body
        console.log('[loginHandler frontend] params: ', params)
        let user_details = await callbackend(params.email, params.passwd)
        console.log('user details from axios: ', user_details)
        // let user_details = {
        //     id: '115407523459751158832',
        //     email: 'ajith26488@gmail.com'
        // }
        if (user_details) {
            console.log('got user details')
            req.session.user = user_details
            return res.redirect('/')
        } else {
            console.log('no user_details')
            return res.redirect('/')
        }

    } catch(error) {
        console.error('[loginHandler frontend] error: ', error);
        return res.status(301).redirect('/login')
    }

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