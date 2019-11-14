let google = require('googleapis').google

let REDIRECT_URL = process.env.GOOGLE_SSO_REDIRECT_URL
const googleConfig = {
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    redirect: REDIRECT_URL + '/auth/google/callback'
};

const defaultScope = [
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/profile.emails.read',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}

function getGooglePeopleApi(auth) {
    return google.people({ version: 'v1', auth });
}

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function urlGoogle() {
    const auth = createConnection(); // this is from previous step
    const url = getConnectionUrl(auth);
    return url;
}

async function getGoogleAccountFromCode(code) {
    try{
        console.log('*************'.repeat(15))
        const auth = createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        // console.log('tokens ', tokens)
        console.log('-'.repeat(150))
        auth.setCredentials(tokens);
        const service = getGooglePeopleApi(auth);

        console.log('-'.repeat(150))
        const person = await service.people.get({
                            resourceName: 'people/me',
                            personFields: 'emailAddresses,names,photos,nicknames'
                        });
        // console.log('person: ', person)
        console.log('-'.repeat(150))
        const userGoogleId = person.data.resourceName.split('/')[1];
        console.log('userGoogleId: ', userGoogleId)
        console.log('-'.repeat(150))
        const userGoogleEmail = person.data.emailAddresses[0].value
        console.log('userGoogleEmail: ', userGoogleEmail)
        console.log('-'.repeat(150))
        console.log('*************'.repeat(20))
        return {
            id: userGoogleId,
            email: userGoogleEmail,
            tokens: tokens,
        };
    } catch(err) {
        console.log('err: ', err)
        return {}
    }
}

module.exports = {
    googleUrl: urlGoogle,
    getGoogleAccountFromCode: getGoogleAccountFromCode
}