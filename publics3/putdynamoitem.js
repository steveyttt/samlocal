/**
* A sample Lambda function that creates a public S3 bucket and applys a restrictive policy
**/
  
// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");
var dynamodb = new aws.DynamoDB({region: 'ap-southeast-2'});

function putitemdynamo(table, attribute) {

 var params = {
    Item: {
     "bucketname": {
       S: attribute
      }
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: table
   };
   dynamodb.putItem(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });

}

  // Exports.handler is always the entry point in your lamda function.
  // The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
  // The event.json file in the code directory is an example of a complete event source
  // Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
  // Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  exports.handler = function(event, context) {  

var bucket = ["zzzzstevetest1", "zzzzstevetest123" ];

for (var j = 0; j < bucket.length; j++) {
    putitemdynamo("Public-S3-Buckets", bucket[j]);
}

}
