'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');

var serverPort = 8080;
var serverIP = '0.0.0.0';

var cors = require('cors');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dbUser = process.argv[2];
var dbPass = process.argv[3];
var dbHost = process.argv[4];
var dbPort = process.argv[5];
var dbName = process.argv[6];

mongoose.connect('mongodb://' + dbUser + ':' + dbPass + '@' + dbHost + ':' + dbPort + '/' + dbName);
var model = require('./models/model');

var SettingsService = require('./controllers/SettingsService');

//Init the settings in the database to the defaults if they don't already exist. Load them to cache if they do
SettingsService.initAndPopulateSettings();

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Enable CORS
  app.use(cors());

  // Validate Swagger requests
  //app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, serverIP, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
