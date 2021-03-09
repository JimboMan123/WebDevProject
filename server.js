require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();

const PORT = 3000;

var mysql = require('mysql');
var session = require('express-session');
app.set('view engine', 'ejs');


app.use(session({
	secret: process.env.SECRET_SESSION,
	resave: true,
	saveUninitialized: true
}));
app.use(express.urlencoded({extended : true}));
app.use(express.json());

var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : process.env.DB_DBNAME
});


connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');

  connection.query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});


app.get('/', function(request, response) {
	
  response.render('index.ejs');
       
response.end();
});

app.get('/index', function(request, response) {
	
  response.render('index.ejs');
       
response.end();
});

app.get('/cart', function(request, response) {
	
  response.render('cart.ejs');
       
response.end();
});

app.get('/phones', function(request, response) {
	
  response.render('phones.ejs');
       
response.end();
});

app.get('/login', function(request, response) {
	
  response.render('login.ejs');
       
response.end();
});

app.get('/register', function(request, response) {
	
  response.render('register.ejs');
       
response.end();
});


app.use(express.static(path.join(__dirname, 'public')));




app.listen(PORT, ()=> {
    console.log('App is listening at http://localhost:'+PORT)
})