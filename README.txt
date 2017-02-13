# This is a training project.
It can be used as a template for a restfull app based on NodeJS.
Source 'https://github.com/baugarten/node-restful is used as an example to build this app.

## Used helpers
This app provides basic authentication based on JSON Web Tokens.

To simulate ssl protocol and real domain use nGrok service. Visit https://ngrok.com/
The nGroc tool archive is able to find in app/thirdPartyTools folder 
to find out how to use it. You have to proper configure the localhost. 
Since than the app will be available by ref similar to http://f23fcc90.ngrok.io 

## Start
To fire this app up execute 'npm start' at app-root directory. The working app will be 
available by 'http://localhost:3000/app/<action_name>' address.

## Data storage
This app works with MongoDB database. Its name is exhibition. You can find the DB backup
in dbBackups folder.


## Used API's
The best business cart service is a Microsoft computer vision API + Aylien text 
extraction API bunch.
https://www.microsoft.com/cognitive-services/en-us/computer-vision-api
http://docs.aylien.com/

This statement because this bunch is a best from API's that were tried because they 
most exact and fast and have least cost.