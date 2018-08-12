# README #
A few small generic lambda functions for managing public S3 buckets.

### What is this repository for? ###
* The code directory is designed to host all lambda functions necessary to create public S3 buckets & sam local configuration
* The cloudformation directory contains all CF necessary to deploy the functions to AWS
* MASTER branch is the only supported version to go into any environment currently

### How does it work? ###
* Three functions exist which perform the necessary tasks:
* createdynamo.js - This small function creates a dynamo table based upon 2 provided parameters (currently provided as environment variables)
* putdynamo.js - This small function populates data inside a dynamo table using the putitem api call. The function takes 3 params (currently provided as environment variables).
* creates3.js - This small function is designed to query a dynamo table and for each entry in it create an S3 bucket. Once the bucket is created a restrictive policy is applied to reduce levels of access.
* The three functions are designed to work together to create S3 buckets which have only been added to an approved whitelist inside dynamo.

### To Do ###
* Add tags when creating the bucket
* Add tags to the cf deployment commands
* Change policy on bucket to restrict on more IP's and file types
* Get the creates3 function to run on cron

### What versions used? ###
* python 2.7.10
* pip 18.0
* aws-cli 1.15.71
* SAM CLI 0.5.0 (SAM local)
* aws-shell
* node 6.10
* Docker version 18.03.0-ce

### How can I test it? ###
* You will require keys / access for your AWS account first
* Install [python](https://www.python.org/downloads/)
* Install [docker](https://docs.docker.com/docker-for-mac/install/)
* Install pip - `curl -O https://bootstrap.pypa.io/get-pip.py && sudo python get-pip.py`
* Add the python executable to your bash profile
```
cat ~/.bash_profile
# Setting PATH for Python 2.7
PATH="/Users/loggedinuser/Library/Python/2.7/bin:${PATH}"
export PATH
```
* Update pip and setup tools - `sudo -H pip install --upgrade --ignore-installed pip setuptool`
* Install necessary aws tools - `pip install awscli aws-shell aws-sam-cli --upgrade --user`
* login to docker from your terminal - `docker login`
* cd into the code directory - `cd code`
* run a test invocation of sam local - `sam local invoke -e sampleevent.json createdynamo`

### Sam Local ###
* [SAM-local](https://docs.aws.amazon.com/lambda/latest/dg/test-sam-cli.html) is well documented by AWS.
* This tool can be used for almosy 100% local lambda and apigateway testing, provided you have the above tools installed.
* An example local test invocation looks like this - `sam local invoke -e sampleevent.json createdynamo`
* The tool relies on a template.yaml file residing with your code. Check the doco for in-depth info.

### Deployment ###
* Deploy s3 bucket to hold lambda functions - `cloudformation create-stack --stack-name lambda-s3-bucket --template-body file://cloudformation/lambda-s3-bucket.yaml`
* cd into the code directory and run - `zip -r ../code .`
* Copy code zip to the lambda s3 bucket -  `aws s3 cp code.zip s3://private-test-lambda-tyson/code.zip`
* Deploy lambda functions - `cloudformation create-stack --stack-name lambda --template-body file://cloudformation/lambda.yaml --capabilities CAPABILITY_IAM`
