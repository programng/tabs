var request      = require('supertest'),
    express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport     = require('passport'),
    session      = require('express-session'),
    mongoose     = require('mongoose'),
    User         = require('../server/users/userModel');

mongoose.connect('mongodb://localhost/tabs');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || "thisisasecret",
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

User.remove({}, function() {
  console.log('Database Cleared');
});

describe('Local-Passport Specs', function() {

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

  describe('POST login', function() {
    it('should login into a current user successfully', function(done) {
      request(app)
        .post('/login')
        .send({ email: 'kirby8u@hotmail.com', password: 'hackreactor'})
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