var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var restful = require('node-restful');
var cors = require('cors');
var mongoose = restful.mongoose;
var debug = require('debug')('http');

var apiRoutes = express.Router();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var AuthMiddleware = require('./auth/AuthMiddlevare');
var authUser = require('./auth/Authenticate');

var config = require('./config/config'); // get our config file
var User = require('./models/User');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

mongoose.connect(config.database);
var db = mongoose.connection;

app.set('superSecret', config.secret);

// Set auth middleware
//var auth = new AuthMiddleware.auth;
//auth.authApply(apiRoutes, jwt, app);
//app.use('/app', apiRoutes);

var beforeRequestToResource = function (req, res, next) {
    if (req.query.limit) {
        req.query.limit = Math.abs(req.query.limit);
    }
    if (req.query.skip) {
        req.query.skip = Math.abs(req.query.skip);
    }
    console.log(req.query);
    next();
};

var Resource = app.resource = restful.model('quizResult', mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: String,
    goal: String,
    blankId: String,
    location: String
})).methods(['get', 'post', 'delete', {
        method: 'get',
        before: beforeRequestToResource
//        after: sendEmail, // specify the handler function that will be hanged on the specified method after execution
    }
]);



Resource.route('quizResults', {
    detail: true,
    handler: function (req, res, next) {
        console.log(req);
        console.log(res);
        console.log(next);
        // We can verify auth credentials here by read cookies or  o-auth headers
    }
});

Resource.register(app, '/app/quizResults');

//// This is a test route. It is used only to generate a test user.
//app.get('/setup', function (req, res) {
//    var nick = new User({
//        name: 'Joe',
//        password: 'pwd',
//        role: 'user'
//    });
//    nick.save(function (err) {
//        if (err)
//            throw err;
//
//        console.log('User saved successfully');
//        res.json({success: true});
//    });
//});

app.get('/app/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

app.post('/authenticate', function (req, res) {
    let authenticateUser = new authUser.authUser;
    authenticateUser.authUser(req, res, User, jwt, app);
});


app.listen(3000, function () {
    console.log(`Node-restfull is listening at http://0.0.0.0:3000`);
});