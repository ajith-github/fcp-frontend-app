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
        res.render('pages/index', {
            title: 'Home',
            queue_url: process.env.QUEUE_URL,
            primary_theme: setPrimaryTheme()
        });
        return
    } catch(error) {
        console.error('[loginHandler frontend] error: ', error);
    }
}

module.exports = {
    homepage: homepage
}