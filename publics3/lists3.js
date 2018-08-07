/**
* A sample Lambda function that creates a public S3 bucket and applys a restrictive policy
**/
  
// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");
  
  // Exports.handler is always the entry point in your lamda function.
  // The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
  // The event.json file in the code directory is an example of a complete event source
  // Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
  // Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  exports.handler = function(event, context) {  
  
    //Variable containing an array of approved S3 buckets that can be public
    var myBucket = ["steven1234testbucketaaaaaa", "steven1234testbucket" ];
    
    // This creates a service interface object (function to query the S3 api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    var s3 = new aws.S3;

    s3.listBuckets(function(err, listBucketsResult) {

        if (err) {
            console.log(err, err.stack); // an error occurred
        }

        else {
            // console.log(JSON.stringify(listBucketsResult));
            // console.log(listBucketsResult); // successful response
            var buckets = listBucketsResult.Buckets

            for (var j = 0; j < buckets.length; j++) {
                // If mybucket variable contains an S3 bucket in the account with the same name, then true.
                if ( myBucket.indexOf(buckets[j].Name) > -1 ) {
                 console.log(buckets[j].Name + " Is an approved public bucket")
                 }
            
                 else {
                     console.log(buckets[j].Name + " Is not an approved public bucket")
                 }
            }
        }
      });
}
