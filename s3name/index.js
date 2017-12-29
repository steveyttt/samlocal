//This example uses env variables inside a javscript function
//sam local invoke TestFunction --event event.json --env-vars env.json
//echo '{"stdin":"Hellostdin"}' | sam local invoke
//You need to send some std input to invoke the function - junk json is fine
var AWS = require('aws-sdk');
     
exports.handler = function(event, context, callback) {  
  var bucketName = process.env.S3_BUCKET;       
  console.log(process.env.TZ);
  callback(null, bucketName);     
}

