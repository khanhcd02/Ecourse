const express = require('express');
const bodyParser = require('body-parser');
const examRoute = require('./routes/examRoute');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use('/Exam', examRoute);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(3005, () => {
  console.log('Exam Service listening on port 3005');
});
