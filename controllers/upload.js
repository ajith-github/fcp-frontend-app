let s3 = require('../lib/s3')

let uploader = function(req, res){
    try {
        console.log('return upload ejs')
        res.render('pages/filepond', { title: 'filepond' });
    } catch(err) {
        console.log('Error: ', err);
        return res.status(500).send('Internal Server Error');
    }

}


function uploadToS3(client, filename) {
    let params = {
        localFile: filename,

        s3Params: {
            Bucket: process.env.S3_BUCKET,
            Key: "some/remote/file"
        },
    };
    var uploader = client.uploadFile(params);
    uploader.on('error', function (err) {
        console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function () {
        console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function () {
        console.log("done uploading");
    });
}

let create = function(req, res){
    let s3_client = s3.client;
    let params = req.body;
    console.log('params: ', req)
    // filename = req.body.params
    // uploadToS3(s3_client, filename)
    return res.status(200).send('OK');
}


module.exports = {
    create: create,
    uploader: uploader
}