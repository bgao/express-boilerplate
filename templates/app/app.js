
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./routes/route')
  , http = require('http')
  , path = require('path')
  , flash = require('connect-flash')
  , passport = require('passport')
  , MongoStore = require('connect-mongo')(express);

// Database connection: Change to your mongodb url
var db_session_uri = "mongodb://username:password@your_mongodb_server:00000/db_xxxx";

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT||8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ store: new MongoStore({ db: 'db_session', url: db_session_uri}),
			    secret: 'keyboard cat',
			    cookie: { maxAge: 7*24*60*60*1000 } // session expires in a week
			  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'static')));
});

app.configure('development', function(){
  app.use(express.errorHandler({dumpException: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Start routing
route(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
