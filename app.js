var express = require('express');
var app = express();

var cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

const control=require('./controllers/control');

app.set('view engine', 'ejs');

app.get('/',control.base);
app.get('/main',control.main);
app.get('/login',control.login);
app.post('/loginAction',control.loginHub);
app.get('/register',control.register);
app.post('/registerAction',control.registerHub);
app.post('/OTP',control.sendOTP);
app.get('/logoutAction',control.isAuth,control.logOut);

app.listen(8060);
console.log('Info System Started');
