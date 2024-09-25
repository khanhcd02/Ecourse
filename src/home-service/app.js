const express = require('express');
const bodyParser = require('body-parser');
const homeRoute = require('./routes/homeRoute');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use('/home', homeRoute);
app.use('/', homeRoute);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(3002, () => {
  console.log('Home Service listening on port 3002');
});
