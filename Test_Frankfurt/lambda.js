let AWS = require('aws-sdk');
let SL_AWS = require('slappforge-sdk-aws');
const sqs = new SL_AWS.SQS(AWS);
const sns = new AWS.SNS();
const s3 = new AWS.S3();
const kinesis = new AWS.Kinesis();
const cognito_idp = new AWS.CognitoIdentityServiceProvider();

exports.handler = function (event, context, callback) {
    cognito_idp.listUsers({
        UserPoolId: process.env.UserPoolId_cognitoCognitoFrankfurt1,
        Limit: "10"
    }, function (error, data) {
        if (error) {
            // implement error handling logic here
            throw error;
        }
        // your logic goes within this block
        console.log(data);

        kinesis.describeStream({
            StreamName: 'Test_Frankfurt',
            Limit: 10,
            ExclusiveStartShardId: 'shardId-000000000000'
        }).promise()
            .then(data => {
                // your logic goes here
                console.log(data);
            })
            .catch(err => {
                // error handling goes here
                console.log(err);
            });
    });
    s3.listObjects({
        'Bucket': 'cf-templates-8j7s4hdepmkt-us-east-1',
        'MaxKeys': 10,
        'Prefix': ''
    }).promise()
        .then(data => {
            console.log(data);           // successful response
            /*
            data = {
             Contents: [
                {
                   ETag: "\\"70ee1738b6b21e2c8a43f3a5ab0eee71\\"",
                   Key: "example1.jpg",
                   LastModified: <Date Representation>,
                   Owner: {
                      DisplayName: "myname",
                      ID: "12345example25102679df27bb0ae12b3f85be6f290b936c4393484be31bebcc"
                   },
                   Size: 11,
                   StorageClass: "STANDARD"
                },
                {...}
            */
        })
        .catch(err => {
            console.log(err, err.stack); // an error occurred
        });
    sns.listSubscriptionsByTopic({
        TopicArn: 'arn:aws:sns:eu-central-1:318300609668:Test_Frankfurt'
    }).promise()
        .then(data => {
            // your code goes here
            console.log(data);
        })
        .catch(err => {
            // error handling goes here
            console.log(err);
        });
    sqs.receiveMessage({
        QueueUrl: 'https://sqs.eu-central-1.amazonaws.com/318300609668/Test_Frankfurt',
        AttributeNames: ['All'],
        MaxNumberOfMessages: '1',
        VisibilityTimeout: '30',
        WaitTimeSeconds: '0'
    }).promise()
        .then(receivedMsgData => {
            if (!!(receivedMsgData) && !!(receivedMsgData.Messages)) {
                let receivedMessages = receivedMsgData.Messages;
                receivedMessages.forEach(message => {
                    // your logic to access each message through out the loop. Each message is available under variable message 
                    // within this block
                });
            } else {
                // No messages to process
            }
        })
        .catch(err => {
            // error handling goes here
            console.log(err);
        });

    callback(null, { "message": "Successfully executed" });
}