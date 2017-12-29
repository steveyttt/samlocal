//http://docs.aws.amazon.com/lambda/latest/dg/test-sam-local.html
//Call this function with:
//sam local invoke HelloWorld --event event.json
'use strict';

// A simple hello world Lambda function
exports.handler = (event, context, callback) => {

    console.log('LOG: Name is ' + event.name);
    callback(null, "Hello " + event.name);

}