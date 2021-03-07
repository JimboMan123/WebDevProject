const express = require('express');
const path = require("path");

const app = express();

const PORT = 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.set('view-engine', 'ejs');

app.get('/login', (req, res) => {
    res.render('login.ejs')
  })



app.listen(PORT, ()=> {
    console.log('App is listening at http://localhost:'+PORT)
})