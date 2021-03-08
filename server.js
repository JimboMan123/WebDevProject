const express = require('express');
const path = require("path");

const app = express();

const PORT = 3000;

app.set('view engine', 'ejs');

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