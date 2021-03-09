require('dotenv').config();
const express = require('express');
const path = require("path");

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');

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