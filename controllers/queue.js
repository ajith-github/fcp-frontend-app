var queue = require('../lib/queue')
var axios = require('axios')

let BASE_API_URL = process.env.BASE_API_URL

let listMessageHandler = async function(req, res) {
    try {
        var params = {
            AttributeNames: [
            "SentTimestamp"
            ],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
            "All"
            ],
            QueueUrl: process.env.QUEUE_URL,
            VisibilityTimeout: 0,
            WaitTimeSeconds: 0
        };
        let message = await queue.getMessage(params)
        // console.log('[listMessageHandler frontend] message: ', message)
        return res.status(200).json(message)

    } catch(ex) {
        console.log('[listMessageHandler frontend] ex: ', ex)
        return res.status(500).send(ex)
    }
}


let sendMessageHandler = async function(req, res) {
    let title = req.body.title
    let author = req.body.author
    let queue_url = process.env.QUEUE_URL
    let message_body = req.body.message


    let API_URL = BASE_API_URL + '/queue/message'
    try {
        let response = await axios.post(API_URL, {
                                    message_body,
                                    title,
                                    author,
                                    queue_url
                                })
        console.log('[sendMessageHandler frontend] response: ', response.data)

        return res.status(200).send(response.data)
    } catch(ex) {
        console.log('[sendMessageHandler frontend] exception ', ex)
        return res.status(500).send('Internal server error')
    }
}

module.exports = {
    listMessageHandler: listMessageHandler,
    sendMessageHandler: sendMessageHandler
}