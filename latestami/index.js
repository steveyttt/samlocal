/**
* A sample Lambda function that looks up the latest AMI ID for a given region and OS.
**/

// Map instance OS Name to an AMI name pattern
// This is an object variable of all approved OS types
// When creating new approved ami's for the below OS types, their names must match the below pattern.
// New OS build standards should have EPOCH time appended to them. This ensures the below code grabs the newest version.
var osNamePattern = {
  "win2012-std": "win2012-std-*",
  "win2012-stdiis": "win2012-stdiis-*",
  "win2016-std": "win2016-std-*",
  "win2016-stdiis": "win2016-stdiis-*",
  "win2016-ecs": "win2016-ecs-*",
  "amazonlin2-std": "AmazonLin2-std-*",
  "amazonlin-std": "AmazonLin-std-*",
  "amazonlin-ecs": "AmazonLin-ecs-*",
};

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

  // Log to the console a request received message and the event object received that invoked the lambda function
  // console.log messages are logged direct to the cloudwatch log stream for the lambda function
  // JSON.stringify converts an object to a string https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));

  // For Delete requests, immediately send a SUCCESS response.
  // Cloudformation is the only function to send a RequestType in it's event - we will probably never need this in our function.
  if (event.RequestType == "Delete") {
      sendResponse(event, context, "SUCCESS");
      return;
  }

  // Set the responseStatus to FAILED until we know it is OK
  var responseStatus = "FAILED";
  // Create an empty object to be populated by the lambda function and passed back to the client
  var responseData = {};

  // This creates a service interface object (function to query the ec2 api) - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
  // The region is set by querying the region sent in the event source json object. (This is done inside the cloudformation custom object)
  var ec2 = new aws.EC2({region: event.ResourceProperties.Region});
  
  // This creates a variable object which contains a json blob which is sent to the ec2.describeimages method
  var describeImagesParams = {
      // The osName property is provided in the event source json. This should be defined in the cloudformation custom object
      // This sets the ami name pattern based on the osName - i.e. if osName = win2012-std then search using name "win2012-std-*""
      Filters: [{ Name: "name", Values: [osNamePattern[event.ResourceProperties.osName]]}],
  };

  // Get the AMI ID's with the specified name pattern
  // DescribeImages is the method called on the ec2 object created above
  // The descibeimages method is explained here - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeImages-property
  ec2.describeImages(describeImagesParams, function(err, describeImagesResult) {

      // If the call has an error drop to this script block
      if (err) {
          // respond with call failed by dumping it to the console and setting the responseData variable to a failed message.
          // console.log is dumped into cloudwatch and the responseData is sent to the client calling the function
          responseData = {Error: "DescribeImages call failed"};
          console.log(responseData.Error + ":\n", err);
      }

      // If the call succeeds then go here
      else {
          // Store the Images section of the describe api call as a variable
          var images = describeImagesResult.Images;

          // Sort images by name in decscending order. The names contain the AMI version, formatted as YYYY.MM.Ver.
          // Sort is a built in JS function that sorts the elements of an array - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          // This sort function modifies the images variable so the latest AMI is top of the list (It does it alphabetically with strings) - https://www.w3schools.com/jsref/jsref_sort.asp
          // Local compare is a built in method which compares two strings before or after one another - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
          images.sort(function(x, y) { return y.Name.localeCompare(x.Name); });

          // For loop in Node: start with an expression (j = 0)
          // Loop if condition is true (j < images.length)
          // Do this after each loop (j++)
          for (var j = 0; j < images.length; j++) {

              // Call isBeta function below
              // The if statement runs the isBeta function with the image name as the parameter
              // If the function returns true the loop responds with the image
              if (isBeta(images[j].Name)) continue;
              // Set the response status var to SUCCESS
              responseStatus = "SUCCESS";
              // Set the response data object variable id entry to the ami ID
              responseData["Id"] = images[j].ImageId;
              // Break from the loop immediately after processing the first image name (The top one in the list)
              break;
          }
      }
      // Call the send response function with 4 parameters
      sendResponse(event, context, responseStatus, responseData);
  });
};

// Check if the image is a beta or rc image. The Lambda function won't return any of those images.
// indexof is a JS built in method - https://www.w3schools.com/jsref/jsref_indexof.asp
// it scans a string for a specified string (In this case it is looking for beta or .rc)
// || is a logical operator which means OR https://www.w3schools.com/js/js_comparisons.asp
// Negative values in JS (-1) have a boolean value of "false" - basically if the image is beta this function returns a false response
function isBeta(imageName) {
  return imageName.toLowerCase().indexOf("beta") > -1 || imageName.toLowerCase().indexOf(".rc") > -1;
}

// This functions sends the response to the pre-signed S3 URL
// responseData is the actual amiID that we care about. This is what the client wants returned to them.
function sendResponse(event, context, responseStatus, responseData) {

  // Creates a variable which is a JSON string (json)
  // This is the response to send to the CF request
  var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
      PhysicalResourceId: context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      Data: responseData
  });

  // Log the response in the cloudwatch log stream
  console.log("RESPONSE BODY:\n", responseBody);

  // Add the https module - https://nodejs.org/api/https.html
  // Add the url module - https://nodejs.org/api/url.html
  // We need these to get node to make calls to url's
  var https = require("https");
  var url = require("url");

  // The url.parse() method takes a URL string, parses it, and returns a json object.
  // A var is then created that stores the url call as a json object
  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: "PUT",
      headers: {
          "content-type": "",
          "content-length": responseBody.length
      }
  };

  // Quick message to say it is sending a response
  console.log("SENDING RESPONSE...\n");

  // Construct a request to make a call to a web server
  // Output the status code and the headers (These go into cloudwatch)
  var request = https.request(options, function(response) {
      console.log("STATUS: " + response.statusCode);
      console.log("HEADERS: " + JSON.stringify(response.headers));
      // Tell AWS Lambda that the function execution is done  
      context.done();
  });

  // Uses the request variable to output any error responses to cloudwatch
  request.on("error", function(error) {
      console.log("sendResponse Error:" + error);
      // Tell AWS Lambda that the function execution is done
      context.done();
  });

  // This will push the data to the remote location that CF will check
  request.write(responseBody);
  request.end();
}