const AWS = require('aws-sdk');

function getSQSClient() {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    return sqs
}

function createQueue(queue_name){
    return new Promise((resolve, reject) => {
        let sqs = getSQSClient()
        var params = {
            QueueName: queue_name,
            Attributes: {
              'DelaySeconds': '60',
              'MessageRetentionPeriod': '86400'
            }
        };

        sqs.createQueue(params, function(err, data) {
            if (err) {
                console.log("[createQueue] Error", err);
                reject(err)
            } else {
                console.log("[createQueue] Success", );
                resolve(data.QueueUrl)
            }
        });
    })
}

function listQueue(){
    return new Promise((resolve, reject) => {
        let sqs = getSQSClient()
        var params = {};
        sqs.listQueues(params, function(err, data) {
            if (err) {
                console.log("[listQueue] Error", err);
                reject(err)
            } else {
                console.log("[listQueue] Success", );
                resolve(data.QueueUrls)
            }
        });
    })
}

function sendMessage(message_data) {
    return new Promise((resolve, reject) => {
        let sqs = getSQSClient()
        sqs.sendMessage(message_data, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err)
            } else {
                console.log("Success", data.MessageId);
                resolve(data.MessageId)
            }
        });
    });
}


function getMessage(data) {
    return new Promise((resolve, reject) => {
        let sqs = getSQSClient()
        sqs.receiveMessage(data, function(err, data) {
            if (err) {
                console.log("[getMessage] Receive Error", err);
                reject(err.stack)
            } else {
                console.log('[getMessage] ', data)
                resolve(data)
            }
        });
    });
}

function deleteMessage(data) {
    return new Promise((resolve, reject) => {
        let sqs = getSQSClient()
        var deleteParams = {
            QueueUrl: process.env.QUEUE_URL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
            if (err) {
                console.log("[deleteMessage Delete Error", err);
                reject(err.stack)
            } else {
                console.log("[deleteMessage] Message Deleted", data);
                resolve(data)
            }
        });
    });
}



module.exports = {
    createQueue: createQueue,
    listQueue: listQueue,
    sendMessage: sendMessage,
    getMessage: getMessage,
    deleteMessage: deleteMessage
}