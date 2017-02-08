This is a training project.
It can be used as a template for a restfull app based on NodeJS.

Source 'https://github.com/baugarten/node-restful is used as an example to build this app.

This app provides basic authentication based on JSON Web Tokens.

To fire this app up execute 'npm start' at app-root directory. The working app will be 
available by 'http://localhost:3000/app/<action_name>' address.

This app works with MongoDB database. Its name is exhibition. You can find the DB backup
in dbBackups folder.

Possible business card recognition SDK's:
    - ABBYY cloud OSR SDK: http://ocrsdk.com/documentation/quick-start/;
    - FullContact service: https://portal.fullcontact.com/#/welcome;
    
To simulate ssl protocol and real domain use nGrok service. Visit https://ngrok.com/
The nGroc tool archive is able to find in app/thirdPartyTools folder 
to find out how to use it. You have to proper configure the localhost. 
Since than the app will be available by ref similar to http://f23fcc90.ngrok.io 
