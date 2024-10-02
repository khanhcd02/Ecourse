const express = require('express');
const bodyParser = require('body-parser');
const courseRoute = require('./routes/courseRoute');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use('/courses', courseRoute);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(3004, () => {
  console.log('Course Service listening on port 3004');
});
