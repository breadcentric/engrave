require('dotenv').config();

var mongoose = require('mongoose');
let config = require('./config');
mongoose.connection.on('error', function (err) { console.log(err) });
mongoose.connect(config.get_config().database_url);

config.refresh_config(function() {
    let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let expressSanitized = require('express-sanitize-escape');

let steem = require("steem");
let moment = require("moment");

let featured_posts = require('./modules/featured.js');
let reward_tools = require('./modules/reward-tools');
let authors = require('./modules/authors');
let sitemap = require('./modules/sitemap');
let articles = require('./modules/articles');

let lang = require('./translation');

var fs = require('fs');

console.log("Launched on " + moment().format("LLLL"));
console.log(config.get_config());

let app = express();

app.use(session({
    secret: config.get_config().session_secret,
    saveUninitialized: true,
    resave: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

lang.initialize(config.get_config().frontpage_language);

app.use((req, res, next) => {
    res.locals.config = config.get_config();
    res.locals.translation = lang.get_translation();
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized.middleware());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let index = require('./routes/index');
let authorize = require('./routes/authorize');
let action = require('./routes/action');
let dashboard = require('./routes/dashboard');

app.use('/authorize', authorize);
app.use('/action', action);
app.use('/dashboard', dashboard);
app.use('/', index);
app.use('/logout', authorize);

app.locals.moment = require('moment');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('main/' + config.get_config().theme + '/error', {categories: config.get_config().categories});
});

let debug = require('debug')('boilerplate:server');


/**
 * Create HTTP server.
 */
var http = require('http');
let server = http.createServer(app).listen(parseInt(config.get_config().port));
let port = normalizePort(config.get_config().port);
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

featured_posts.initialize();
reward_tools.initialize();
authors.initialize();
sitemap.initialize();
articles.initialize();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

});
