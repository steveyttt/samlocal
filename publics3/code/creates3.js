/**
* A sample Lambda function that creates a public S3 bucket and applys a restrictive policy
**/

// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");

// This creates a service interface object (function to query the dynamo api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html
var dynamodb = new aws.DynamoDB({region: 'ap-southeast-2'});

// This creates a service interface object (function to query the s3 api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
var s3 = new aws.S3;

//Scan a table for ALL entries, iterate through them and for each send a "create s3 bucket api call"
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
function scanDynamo(tableName, attributeName) {
  dynamodb.scan({TableName: tableName}, function(err, dynamoresults) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      var items = dynamoresults.Items;
      for (var j = 0 ; j < items.length; j++) {
        //you cannot include a variable inside an object property, to get around this attributeName needs to be enclosed in square brackets
        console.log("Sending call to create s3 bucket " + items[j][attributeName].S);
        CreateS3Bucket(items[j][attributeName].S)
      }
    }
  });
}

//Create an s3 bucket
//If bucket already exists simply enforce the bucket policy using addS3BucketPolicy
//If bucket does not exist then create bucket and then add policy using addS3BucketPolicy
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
function CreateS3Bucket(bucketName) {  
  s3.createBucket({Bucket: bucketName, CreateBucketConfiguration: {LocationConstraint: "ap-southeast-2" }}, function(err, data) {
    if (err) {
      if (err.code == "BucketAlreadyOwnedByYou") {
        console.log("Bucket " + bucketName + " already exists, applying policy");
        addS3BucketPolicy(bucketName);
      }
      else if (err.code != "Bucket already exists") {
        console.log("Something went wrong on bucket " + bucketName + " please investigate");
        console.log(err, err.stack);
      }
    }
    else {
      console.log(data);
      console.log("Bucket " + bucketName + " was created");
      addS3BucketPolicy(bucketName);
    }
  });
}

function addS3BucketPolicy(bucketName) {
    
  var bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "IPAllow",
        Effect: "Allow",
        Principal: "*",
        Action: [
          "s3:GetObject",
        ],
        Resource: [
          "arn:aws:s3:::" + bucketName + "/*"
          ],
        Condition: {
          IpAddress: {
          "aws:SourceIp": "106.69.220.172/32"
          }
        }
      }
    ]
  };

  //putBucketPolicy expects data to be in string format
  //JSON.stringify transforms var bucketPolicy from an object to a string
  var bucketPolicyParams = {Bucket: bucketName, Policy: JSON.stringify(bucketPolicy)};

  //set the new policy on the selected bucket
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property
  s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      console.log("Error Applying policy to bucket " + bucketName);
    }
    else {
      console.log("Applied policy to bucket " + bucketName);
    }
  });
}

// Exports.handler is always the entry point in your lamda function.
// The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
// The event.json file in the code directory is an example of a complete event source
// Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
// Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
exports.handler = function(event, context) {  

  scanDynamo(process.env.tableName, process.env.attributeName);

}