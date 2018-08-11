Setting up python:

Running on:
python - 2.7.10
Pip - 18.0
Sam CLI - 0.5.0

Pull down the pip install script:
curl -O https://bootstrap.pypa.io/get-pip.py
sudo python get-pip.py

Add the python executable path to your bash_profile file:
cat ~/.bash_profile
# Setting PATH for Python 2.7
PATH="/Users/steventyson/Library/Python/2.7/bin:${PATH}"
export PATH 
Update pip and setup tools:
sudo -H pip install --upgrade --ignore-installed pip setuptool

Install AWS tools
pip install awscli --upgrade --user
pip install aws-shell --upgrade --user
pip install aws-sam-cli --upgrade --user

To invoke commands ensure your terminal is logged into docker:
Docker login
Username: steveyttt

Cd into the folder with your code and invoke
sam local invoke -e sampleevent.json


S3:
List all buckets in the account, store them in a variable. Query the list of buckets to be public, if they don’t exist then create them
Create buckets from an array (This can be stored inside a dynamo DB table)
Add the restrictive policy to each bucket (restricted files, restricted IP’s, put only from internal IP’s)
Run a check on all buckets and notify if they are public and NOT in the approved list
Create a dynamo DB table
Add a set of strings to a dynamo DB table
Get the strings from dynamo and inject into create bucket command

configure the jobs to be deployed using cloud formation
- Write the CF
- Upload the lambda functions to S3
- Script the cli commands to upload the CF
add a policy for the lambda function to run on lightest possible permissons
Get the bucket policy to include Akamai IP’s
Get the bucket policy to restrict put on certain file types
Document all code
Tighten to two functions
- One to create and populate dynamo
- One to query dynamo and create S3
Configure the functions to take more parameters, remove any hard coded values
Add readme for all steps in REPO