//This is more of a callback example than an actual get latest ami function
//I was just practising returning data to the requestor
'use strict';
var AWS = require("aws-sdk");
var ec2 = new AWS.EC2();
AWS.config.update({region:'ap-southeast-2'});

exports.handler = function (event, context, callback) {

  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));

  if (event.RequestType == "Delete") {
    sendResponse(event, context, "SUCCESS", null, callback);
    return;
    }

  getLatestAmi(event, context, callback);

};

function getLatestAmi(event, context, callback){
  console.log("PROCESSING REQUEST");

    ec2.describeImages({ImageIds: [ "ami-2452275e"] }, function(err, data) {
      if (err) {
        console.log("Cannot find the requested ami ID")
        callback(null, "cannot find ami");
        return
      } else {
          //console.log(data);
          callback(null, data.Images[0].Architecture);
        }
  });
}
