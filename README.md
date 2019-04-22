# samlocal
https://github.com/awslabs/aws-sam-local  

##Figuring out IP usage for private lambda invocation
https://www.jeremydaly.com/mixing-vpc-and-non-vpc-lambda-functions-for-higher-performing-microservices/

`Projected peak concurrent executions * (Memory assigned in GB / 3GB)`
i.e. 500 (simultaneous invocations) * (2 / 3) = 334 ENI's


Pre-Reqs:  
Install node.js  
npm install -g sam-local  
Docker installed  
Docker hub account created and logged in at terminal
docker pull lambci/lambda

Set your credentials using a creds file with a default profile or by export key variables  

example invocation:  
Terminal expects a template.yaml  - invoke the function resource inside your template.yml
Env Variables can go indside a json file  
All Lambda fucntions need to be invoked by some event data - you can create an event file or send dummy data
sam local invoke TestFunction --event event.json --env-vars env.json

