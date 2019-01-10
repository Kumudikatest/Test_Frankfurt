let AWS = require('aws-sdk');
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
            StreamName: 'Test_Frankfurt'
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

    callback(null, { "message": "Successfully executed" });
}