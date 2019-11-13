'use strict';
var BASE_API_URL = process.env.BASE_API_URL;

function getGoogleSSO(){
    try {
        let API_URL = BASE_API_URL + '/google/login'
        axios.get(API_URL, { crossdomain: true })
        .then(function (response) {
            console.log('[getGoogleSSO] response: ', response);
            $("#google-sso-link").attr("href",response.data.google_url);
        })
        .catch(function (error) {
            console.log('[getGoogleSSO] error: ', error);
        })

    } catch (error) {
        console.log('[getGoogleSSO] error: ', error)
    }
}


function signIn(){
    try {
        let API_URL = BASE_API_URL + '/login'
        let email = $('#user-email').val()
        let passwd = $('#user-passwd').val()
        console.log('email: %s, password: %s', email, passwd)
        axios.post(API_URL, {
            email: email,
            password: passwd
        })
        .then(function (response) {
            console.log('[signIn] axios response: ', response);
            window.location.href = '/'
        })
        .catch(function (error) {
            console.log('[signIn] axios error: ', error);
        });
    } catch (error) {
        console.log('[signIn] err: ', err)
    }


}
