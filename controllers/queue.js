var queue = require('../lib/queue')

let createHandler = async function(req, res) {
    let queue_name = req.body.queue_name
    console.log('[createHandler frontend] queue_name: ', queue_name)

    let queue_url = await queue.createQueue(queue_name)
    console.log('[createHandler frontend] queue_url: ', queue_url)
    return res.status(200).json(queue_url)
}

let listQueueHandler = async function(req, res) {
    let queue_urls = await queue.listQueue()
    console.log('[listQueueHandler frontend] queue_urls: ', queue_urls)
    return res.status(200).json(queue_urls)
}

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
        console.log('[listMessageHandler frontend] message: ', message)
        return res.status(200).json(message)

    } catch(ex) {
        console.log('[listMessageHandler frontend] ex: ', ex)
        return res.status(500).send(ex)
    }
}

let sendMessageHandler = async function(req, res) {
    let message_body = req.body.message
    let title = req.body.title
    let author = req.body.author

    console.log('[sendMessageHandler frontend] message_body: ', message_body)
    var params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "Title": {
                DataType: "String",
                StringValue: title
            },
            "Author": {
                DataType: "String",
                StringValue: author
            }
        },
        MessageBody: message_body,
        QueueUrl: process.env.QUEUE_URL
    };
    let messageId = await queue.sendMessage(params)
    console.log('[sendMessageHandler frontend] messageId: ', messageId)
    return res.status(200).json(messageId)
}

module.exports = {
    createHandler: createHandler,
    listQueueHandler: listQueueHandler,
    listMessageHandler: listMessageHandler,
    sendMessageHandler: sendMessageHandler
}