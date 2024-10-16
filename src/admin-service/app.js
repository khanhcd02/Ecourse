const express = require('express');
const bodyParser = require('body-parser');
const adminRoute = require('./routes/adminRoute');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); 
app.use('/admin', adminRoute);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(3006, () => {
  console.log('Admin Service listening on port 3006');
});
