/**
* A simple Lambda function that creates a dynamoDB table with only one attribute definiton.
**/
  
// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");
// This creates a service interface object (function to query the dynamo api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
var dynamodb = new aws.DynamoDB({region: 'ap-southeast-2'});

//Create a function which can create a basic dynamo table. The function takes two parameters - tableName, attributeName
function createdynamotable(tableName, attributeName) {

    //These are the params for the api call which creates the table
    var params = {
        AttributeDefinitions: [
          {
            AttributeName: attributeName,
            AttributeType: "S"
          },
        ],
        KeySchema: [
          {
            AttributeName: attributeName,
            KeyType: "HASH"
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1, 
          WriteCapacityUnits: 1
        }, 
        TableName: tableName
       };
    
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property
    //This is the call to create the table
    //Some basic logic has been added to send a message based upon response from AWS
    dynamodb.createTable(params, function(err, data) {
      if (err) {
        if (err.code == "ResourceInUseException") {
          console.log("Table already exists");
        }
        else if (err.code != "ResourceInUseException") {
          console.log("Something went wrong creating table, please investigate log output");
          console.log(err, err.stack);
        }
      }
      else {
        console.log(data);
        console.log("Table created");
      }
    });
}

  // Exports.handler is always the entry point in your lamda function.
  // The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
  // The event.json file in the code directory is an example of a complete event source
  // Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
  // Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
exports.handler = function(event, context) {

  //Run the function with two parameters. These params are provided as environment variables
  createdynamotable(process.env.tableName, process.env.attributeName);

}
