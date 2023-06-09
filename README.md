# calcoolator-client
Calculator app with login and operation history features

## Installation
This requires npm previously installed.

Execute on root folder to install dependencies:
  npm install
  
Then to launch development server:
  npm start
  
To build for production:
  npm run build
  
Then use a webserver to serve the files, ie. Serve:
  serve -s build

## Configuration:
Configure the relevant parameters in src/config/config.js:
  WebserviceHost: 'your-endpoint.com',
	WebservicePort: '8099',
	WebserviceProtocol: 'http'
