const express = require('express');
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
app.use(bodyParser.json());
app.use(cookieParser()); 

app.use('/user', userRoute);
app.use('/assets', express.static('assets'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../../assets/css')));
app.use(express.static(path.join(__dirname, '../../assets/js')));
app.use(express.static(path.join(__dirname, '../../assets')));
app.set('views', path.join(__dirname, 'views'));
app.listen(3003, () => {
  console.log('User Service listening on port 3003');
});
