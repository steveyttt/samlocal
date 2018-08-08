/**
* A sample Lambda function that creates a public S3 bucket and applys a restrictive policy
**/
  
// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({region: 'ap-southeast-2'});

function createdynamotable() {

    var params = {
        AttributeDefinitions: [
           {
          AttributeName: "bucketname", 
          AttributeType: "S"
         },
        ],
        KeySchema: [
           {
          AttributeName: "bucketname", 
          KeyType: "HASH"
         },
        ],
        ProvisionedThroughput: {
         ReadCapacityUnits: 1, 
         WriteCapacityUnits: 1
        }, 
        TableName: "Public-S3-Buckets"
       };
    
       dynamodb.createTable(params, function(err, data) {
        if (err) {
            if (err.code == "ResourceInUseException") {
                console.log("Table already exists");
            }
            else if (err.code != "ResourceInUseException") {
                console.log("Something went wrong on bucket, please investigate");
                console.log(err, err.stack);
            }
        }
        else {
            console.log(data);
        }
       });
}

  // Exports.handler is always the entry point in your lamda function.
  // The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
  // The event.json file in the code directory is an example of a complete event source
  // Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
  // Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  exports.handler = function(event, context) {  

    createdynamotable();

}
