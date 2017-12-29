/*
Strict Mode is a new feature in ECMAScript 5 that allows you to place a program, or a function, in a “strict” operating context. This strict context prevents certain actions from being taken and throws more exceptions (generally providing the user with more information and a tapered-down coding experience).
https://johnresig.com/blog/ecmascript-5-strict-mode-json-and-more/
*/
'use strict';

exports.handler = (event, context, callback) => {

    //let allows you to declare variables that are limited in scope to the block, statement, or expression on which it is used
    //like var but limited to scope of where it is (so cannot be global)
    let id = event.pathParameters.product || false;

    //Cheeky console.log to show what is going on when we send the request
    console.log(event);
    console.log(event.httpMethod);
    console.log(event.pathParameters);
    console.log(event.pathParameters.product);

    //Switch evaluates an expresion and performs case clause based upon the expressions value
    switch(event.httpMethod){
        case "GET":

            if(id) {
                callback(null, {body: "This is a READ operation on product ID " + id});
                return;  
            } 

            callback(null, {body: "This is a LIST operation, return all products"});
            break;

        case "POST":            
            callback(null, {body: "This is a CREATE operation"}); 
            break;

        case "PUT": 
            callback(null, {body: "This is an UPDATE operation on product ID " + id});
            break;

        case "DELETE": 
            callback(null, {body:"This is a DELETE operation on product ID " + id});
            break;

        default:
            // Send HTTP 501: Not Implemented
            console.log("Error: unsupported HTTP method (" + event.httpMethod + ")");
            callback(null, { statusCode: 501 })

    }

}