/**
* A sample Lambda function that populates data inside a dynamo table
**/

// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");

// This creates a service interface object (function to query the dynamo api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
var dynamodb = new aws.DynamoDB({region: 'ap-southeast-2'});

//A function to put data into a dynamo table, it takes 3 parameters table, item, attribute
function putitemdynamo(table, item, attribute) {

  var params = {
    Item: {
      },
    ReturnConsumedCapacity: "TOTAL", 
    TableName: table
  };
  
  //This populates the above params var with a key called item & then the attribute value. You cannot natively assign a var as a key in an object
  //Check this for more info - http://researchhubs.com/post/computing/javascript/set-object-key-by-variable-in-javascript.html
  params.Item[item] = {S: attribute}

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
  //Use the above params to populate data inside the specified dynamo table
  dynamodb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else { 
      console.log(data);
      console.log("Added " + attribute + " to " + item + " in table " + table );
     }
   });
}

// Exports.handler is always the entry point in your lamda function.
// The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
// The event.json file in the code directory is an example of a complete event source
// Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
// Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
exports.handler = function(event, context) {

  //take the provided "bucket" environment variable string and "split" it into an array
  var bucketsArray = process.env.buckets.split(" ");

  //for each bucket in the environment variable provided add an entry into the dynamo table
  for (var j = 0; j < bucketsArray.length; j++) {  
    putitemdynamo(process.env.tableName, process.env.item, bucketsArray[j]);
  }

}
