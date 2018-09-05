var express = require('express'),
  app = express(),
  bodyParser = require('body-parser');

var shell = require('shelljs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});
app.use(function(req, res, next) {
  if (req.method.toLowerCase() !== "options") {
    return next();
  }
  return res.send(204);
});

// shell.cd('~/Documents')

var routes = require('./api/routes/routes'); //importing route
routes = routes.routes;
routes(app); //register the route

app.use(function(req, res) {
  console.log(res);
  res.status(404).send({url: req.originalUrl + ' not found!'})
});

export default app;
