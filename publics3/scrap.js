/**
* A sample Lambda function that creates a public S3 bucket and applys a restrictive policy
**/
  
// This includes the AWS module inside your JS code
// This allows you to call functions / methods in the aws-sdk
// https://aws.amazon.com/sdk-for-node-js/
var aws = require("aws-sdk");
var s3 = new aws.S3;

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
              "s3:PutObject"
            ],
            Resource: [
                ""
            ],
            Condition: {
                IpAddress: {
                    "aws:SourceIp": "106.69.220.172/32"
                }
            }
          }
        ]
    };

    // create selected bucket resource string for bucket policy
    var bucketResource = "arn:aws:s3:::" + bucketName + "/*";
    bucketPolicy.Statement[0].Resource[0] = bucketResource;
    var bucketPolicyParams = {Bucket: bucketName, Policy: JSON.stringify(bucketPolicy)};

    // set the new policy on the selected bucket
    s3.putBucketPolicy(bucketPolicyParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        }
        else {
          console.log("Success", data);
        }
    });
}

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

  // Exports.handler is always the entry point in your lamda function.
  // The event parameter on exports.handler is a json blob, example event sources are: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html
  // The event.json file in the code directory is an example of a complete event source
  // Context is the second parameter passed to the lambda function. Context can be queried during runtime to get useful information like function name, cloudwatch log stream, remaining time, request ID)
  // Context info is here https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  exports.handler = function(event, context) {  
  
    // This creates a service interface object (function to query the S3 api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    var myBucket = ["zzzzstevetest1", "zzzzstevetest123" ];

    for (var j = 0; j < myBucket.length; j++) {
        CreateS3Bucket(myBucket[j]);
    }
}
