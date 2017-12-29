# samlocal
https://github.com/awslabs/aws-sam-local  

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

