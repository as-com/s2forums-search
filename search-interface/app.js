var express = require("express");
var http = require("http");
var _ = require("lodash");
var socketClusterServer = require('socketcluster-server');

var app = express();
var httpServer = http.createServer();
httpServer.on('request', app);
var scServer = socketClusterServer.attach(httpServer);

app.set('views', 'views');
app.set('view engine', 'jsx');
app.use(express.static('public'));
app.engine('jsx', require('express-react-views').createEngine());

scServer.on('connection', function(socket) {
	// ... Handle new socket connections here
});
