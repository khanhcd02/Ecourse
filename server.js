const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const apiProxy = httpProxy.createProxyServer();
const path = require('path');

const authService = 'http://localhost:3001';
const homeService = 'http://localhost:3002';
const userService = 'http://localhost:3003';
const courseService = 'http://localhost:3004';
const examService = 'http://localhost:3005';
const adminService = 'http://localhost:3006';

app.use(express.static(path.join(__dirname, '/static/css')));
app.use(express.static(path.join(__dirname, '/static/img')));
app.use(express.static(path.join(__dirname, '/static/img/web')));
app.use(express.static(path.join(__dirname, '/static/img/users')));
app.use(express.static(path.join(__dirname, '/static/js')));
app.use(express.static(path.join(__dirname, '/static/lib')));
app.use(express.static(path.join(__dirname, '/static/assets/css')));
app.use(express.static(path.join(__dirname, '/static/assets/js')));
app.use(express.static(path.join(__dirname, '/static/assets')));

app.all('/home/*', (req, res) => {
  apiProxy.web(req, res, { target: homeService }, handleError);
});

app.all('/auth/*', (req, res) => {
  apiProxy.web(req, res, { target: authService }, handleError);
});

app.all('/user/*', (req, res) => {
  apiProxy.web(req, res, { target: userService }, handleError);
});

app.all('/courses/*', (req, res) => {
  apiProxy.web(req, res, { target: courseService }, handleError);
});

app.all('/Exam/*', (req, res) => {
  apiProxy.web(req, res, { target: examService }, handleError);
});

app.all('/admin/*', (req, res) => {
  apiProxy.web(req, res, { target: adminService }, handleError);
});

function handleError(err, req, res) {
  console.error('Proxy error:', err);
  res.status(500).json({ error: 'Service unavailable', details: err.message });
}

app.listen(3000, () => {
  console.log('API Gateway listening on port 3000');
});
