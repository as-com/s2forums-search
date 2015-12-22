var Promise = global.Promise || require('promise');
var express = require("express");
var _ = require("lodash");
var http = require("http");
var log4js = require("log4js");
var elasticsearch = require("elasticsearch");
var bodyParser = require("body-parser");
var socketClusterServer = require('socketcluster-server');
// var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var client = new elasticsearch.Client({
	host: '192.168.1.65:9200',
	log: 'info'
});
var logger = log4js.getLogger();
logger.setLevel('DEBUG');
var app = express();
var hbs = exphbs.create({
	defaultLayout: 'main',
	// helpers: helpers,
	// Uses multiple partials dirs, templates in "shared/templates/" are shared
	// with the client-side of the app (see below).
	partialsDir: ['views/templates/', 'views/partials/']
});
app.use(bodyParser.json());
app.use(express.static("public"));
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
// Middleware to expose the app's shared templates to the cliet-side of the app
// for pages which need them.
function exposeTemplates(req, res, next) {
	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
	// templates which will be shared with the client-side of the app.
	hbs.getTemplates('views/templates/', {
		cache: app.enabled('view cache'),
		precompiled: true
	}).then(function(templates) {
		// RegExp to remove the ".handlebars" extension from the template names.
		var extRegex = new RegExp(hbs.extname + '$');
		// Creates an array of templates which are exposed via
		// `res.locals.templates`.
		templates = Object.keys(templates).map(function(name) {
			return {
				name: name.replace(extRegex, ''),
				template: templates[name]
			};
		});
		// Exposes the templates during view rendering.
		if (templates.length) {
			res.locals.templates = templates;
		}
		setImmediate(next);
	}).catch(next);
}
app.get("/", function(req, res) {
	res.render("home", {
		documentCount: prevDocCount
	});
});
app.get("/templates.js", exposeTemplates, function(req, res) {
	res.set('Content-Type', 'text/javascript');
	res.render("templates", {
		layout: false,
		documentCount: prevDocCount
	});
});
app.post("/search", function(req, res) {
	if (req.body.query.length > 100) {
		res.json({
			// hasError: true,
			error: "Query must be no longer than 100 characters."
		});
		return;
	}
	// console.log(req.body)
	client.search({
		index: 's2forums',
		body: {
			"timeout": "1000ms",
			"_source": ["author", "authorID", "time", "topic", "topicID", "revisions.author", "revisions.time", "revisions.html"],
			"query": {
				"multi_match": {
					"query": req.body.query,
					"fields": ["revisions.text", "topic", "author"],
					// "slop": 1
				}
			}
		}
	}, function(error, response) {
		res.json({
			// hasError: Boolean(error),
			error: error,
			response: response
		});
	});
});
var httpSrv = http.createServer(app).listen(3000);
// var server = app.listen(3000, function() {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('App listening at http://%s:%s', host, port);
// });
var scServer = socketClusterServer.attach(httpSrv);
// var documentCount = -1;
var prevDocCount = -1;
scServer.on("connection", function(socket) {
	// logger.info("New connection!");
});
client.ping({
	requestTimeout: 30000,
	// undocumented params are appended to the query string
	hello: "elasticsearch"
}, function(error) {
	if (error) {
		logger.fatal("elasticsearch is down!");
		// console.error('elasticsearch cluster is down!');
	} else {
		// console.log('All is well');
		logger.info("Connected to elasticsearch!");
		setInterval(function() {
			if (_.size(scServer.clients)) {
                // logger.debug("has clients");
                updateDocCount();
            } else {
                // logger.debug("has no clients");
                prevDocCount = "?";
            }
		}, 1000);
	}
});

function updateDocCount() {
    client.count({
        index: "s2forums",
        type: "post"
    }, function(error, response) {
        if (response.count != prevDocCount) {
            prevDocCount = response.count;
            scServer.exchange.publish("docupd", response.count);
            // console.log(scServer.clients);
        }
        // documentCount = response.count;
    })
}
