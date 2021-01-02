var mysql = require('mysql');
const nodemailer = require("nodemailer");

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'fdb21.awardspace.net',
  user            : '2734291_data',
  password        : 'password',
  database        : '2734291_data',
  port            : '3306'
});

function getRandomText() {
  var charset = "0123456789".match(/./g);
  var text = "";
  for (var i = 0; i < 6; i++) text += charset[Math.floor(Math.random() * charset.length)];
  return text;
}

async function mail(receiver, code) {

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'gerard78@ethereal.email',
        pass: 'sdNNAMFVHaWxN4xQHV'
    }
});

let info = await transporter.sendMail({
  from: '"Authenticator" <prskid1000@gmail.com>',
  to: receiver,
  subject: "OTP for Authentication",
  text: code,
});
console.log("Message sent: %s", info.messageId);
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

exports.main= (req, res, next) => {
    res.render('pages/main');
    next();
};

exports.base= (req, res, next) => {
    res.render('pages/index');
    next();
};

exports.login= (req, res, next) => {
    res.render('pages/login');
    next();
};

exports.sendOTP= (req, res, next) => {
   //console.log(req.body.email);
   var code = getRandomText();
   res.cookie('OTP', code, {expire:400000+Date.now()});
   mail(req.body.email, code);
   //console.log(req.cookies.OTP);
   next();
};

exports.register= (req, res, next) => {
    res.render('pages/register');
    next();
};

exports.logOut=(req, res, next) => {
    res.clearCookie('name');
    res.clearCookie('email');
    res.clearCookie('phone');
    console.log("User Logged Out");
    res.render('pages/index');
}


exports.loginHub=(req, res, next) => {

  console.log(pool);

  pool.query("SELECT * FROM auth2 WHERE address = '"+ req.body.email +"'", function (err, rows, fields) {
    if (err)
    {
      throw err;
      console.log('Connection Failed');
      res.render('pages/login');
      next();
    }

    else if(req.cookies.OTP != req.body.otp) {
        console.log(req.cookies.OTP);
        console.log("Invalid OTP");
        res.clearCookie('OTP');
        res.redirect('/login');
        next();
    }
    else if(rows[0].email != req.body.email) {
        console.log("No User Found");
        res.clearCookie('OTP');
        res.redirect('/login');
        next();
    } else {
        console.log("User Logged In");
        res.clearCookie('OTP');
        res.cookie('name', rows[0].name, {expire:400000+Date.now()});
        res.cookie('email', rows[0].email, {expire:400000+Date.now()});
        res.cookie('phone', rows[0].phone, {expire:400000+Date.now()});
        res.redirect('/main',);
    }

  });
};

exports.registerHub=(req, res, next) => {

  connection.connect();
  console.log(connection);

  if(req.cookies.OTP != req.body.otp) {
      console.log(req.cookies.OTP);
      console.log("Invalid OTP");
      res.clearCookie('OTP');
      res.redirect('/login');
      next();
  }
  else {
    connection.query("INSERT INTO auth(id, name, email, phone) VALUES ( 'NULL','" + req.body.name + "','" + req.body.email + "','" + req.body.phone + "')",
    function (err, rows, fields) {
      if (err)
      {
        console.log('Connection Failed');
        res.render('pages/register');
        next();
      }
      else {
        console.log("User Logged In");
        res.clearCookie('OTP');
        res.cookie('name', req.body.name, {expire:400000+Date.now()});
        res.cookie('email', req.body.email, {expire:400000+Date.now()});
        res.cookie('phone', req.body.phone, {expire:400000+Date.now()});
        res.redirect('/main',);
      }
    });
    connection.end();
  }
};
