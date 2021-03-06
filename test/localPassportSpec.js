var request      = require('supertest'),
    express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport     = require('passport'),
    session      = require('express-session'),
    mongoose     = require('mongoose'),
    User         = require('../server/users/userModel'),
    userController = require('../server/users/userController');

var mongoURI = require('../server/config/database');

mongoose.connect(mongoURI.URI);

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || "thisisasecret",
  key: 'user',
  resave: false,
  saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('../server/config/passport')(passport);

app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
  res.send('success signup');
});

app.post('/login', passport.authenticate('local-login'), function(req, res) {
  res.send('success login');
});

app.get('/test', userController.isLoggedIn, function(req, res) {
  console.log('authenticated successfully');
  res.send('authenticated successfully');
});


var agent;
describe('Local-Passport Specs', function() {

  before(function(done) {
    User.remove({}, function() {
      console.log('User Database Cleared');
      done();
    });
  });

  describe('POST signup', function () {
    it('should signup a new user successfully', function(done) {
      request(app)
        .post('/signup')
        .send({ email: 'kirby8u@hotmail.com', password: 'hackreactor'})
        .expect(200, done);
    });

    it('should return error if attempting to signup with a used email', function(done) {
      request(app)
        .post('/signup')
        .send({ email: 'kirby8u@hotmail.com', password: 'hackreactor'})
        .expect(401, done);
    });
  });

  before(function(done) {
    agent = request.agent(app);
    done();
  })

  describe('POST login', function() {
    it('should login into a current user successfully', function(done) {
      agent
        .post('/login')
        .send({ email: 'kirby8u@hotmail.com', password: 'hackreactor'})
        .expect(200, done);
    });

    it('should pass through authentication', function(done) {
      agent
        .get('/test')
        .expect(200, done);
    });

    it('should return error if attempting to login with incorrect password', function(done) {
      request(app)
        .post('/login')
        .send({ email: 'kirby8u@hotmail.com', password: 'wrong'})
        .expect(401, done);
    });


  });

});