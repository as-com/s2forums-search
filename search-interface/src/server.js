import express from "express"
import http from "http"
import bodyParser from "body-parser"

import React from "react"
import ReactDOM from "react-dom/server"
import {RoutingContext, match} from "react-router"
import {createLocation} from "history"
import Transmit from "react-transmit"
import elasticsearch from "elasticsearch"
import moment from "moment-timezone"
import memwatch from "memwatch-next"
import cacheResponseDirective from "express-cache-response-directive"
import DocumentTitle from "react-document-title"

import routes from "views/routes"

memwatch.on('leak', function(info) {
	console.warn("Memory leak detected: " + info);
});
setTimeout(function() {
	memwatch.gc();
}, 10000);
setInterval(function() {
	memwatch.gc();
}, 120000);


var app = express();
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 8000;
var server = http.createServer(app);
var io = require("socket.io")(server);

var esclient = new elasticsearch.Client({
	host: '192.168.1.65:9200',
	log: 'info'
});

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(cacheResponseDirective());

function normalizeTime(str, id) {
	if (id < 131141) {
		return moment.tz(str, "Etc/GMT+12").tz("UTC").format();
	} else {
		return moment.tz(str, "UTC").tz("UTC").format();
	}
}

app.get("/api/search", function(req, res) {
	// Cache for 5 minutes
	res.cacheControl({
		maxAge: 300
	});
	var query = req.query.q;
	if (query.length > 100) {
		res.json({
			// hasError: true,
			error: "Query must be no longer than 100 characters."
		});
		return;
	}
	if (query.length < 1) {
		res.json({
			// hasError: true,
			error: "Empty query"
		});
		return;
	}

	var queryBody = {
		"timeout": "1000ms",
		"_source": ["author", "authorID", "time", "section"],
		"size": 10,
		"from": 10 * ((req.query.p || 1) - 1),
		"query": {
			"multi_match": {
				"query": query,
				"fields": ["revisions.text^1.5", "topic", "author^0.6"],
				// "slop": 1
			}
		},
		"highlight": {
			"pre_tags": ["<b>"],
			"post_tags": ["</b>"],
			"encoder": "html",
			"fields": {
				"revisions.text": {
					"fragment_size" : 150,
					"number_of_fragments" : 3,
					"no_match_size": 150
				},
				"topic": {
					"no_match_size": 9999
				},
			}
		}
		// "fields": ["field","another_field"]
	};

	if (req.query.sort == "date-desc") {
		queryBody.sort = {
			"time": {
				"order": "desc"
			}
		}
	} else if (req.query.sort == "date-asc") {
		queryBody.sort = {
			"time": {
				"order": "asc"
			}
		}
	}

	esclient.search({
		index: 's2forums',
		body: queryBody,
	}).then(function(body) {
		body.hits.hits.forEach(function(element) {
			element.id = element._id;
			delete element._id;
			delete element._type;
			delete element._index;
			// Normalize times
			element._source.time = normalizeTime(element._source.time, element._id);
			if (!("revisions.text" in element.highlight)) {
				element.highlight["revisions.text"] = ["<span class='text-muted'>Post empty</span><!--<b>-->"];
			}

			// Elasticsearch does not properly escape no_match output
			if (!~element.highlight["revisions.text"][0].indexOf("<b>")) {
				element.highlight["revisions.text"][0] = escapeHTML(element.highlight["revisions.text"][0]);
			}
		});
		delete body._shards;

		res.json({
			response: body
		});
	}, function(error) {
		res.json({
			error: error
		})
	});
});

app.get("/api/post", function(req, res) {
	// Cache for 5 minutes
	res.cacheControl({
		maxAge: 300
	});
	var id = req.query.id;
	esclient.get({
		index: "s2forums",
		type: "post",
		"_source": ["author", "authorID", "time", "topic", "topicID", "section", "revisions.author", "revisions.time", "revisions.html"],
		id: id
	}, function (error, response) {
		if (error) {
			res.json({
				error: error
			});
			return;
		}
		response._source.time = normalizeTime(response._source.time, id);
		response._source.revisions.forEach(function(element) {
			element.time = normalizeTime(element.time, id);
		});
		delete response._index;
		delete response._type;
		// response.id = response._id;
		delete response._id;

		res.json({
			response: response
		});
	});
});
app.get("/api/post/source", function(req, res) {
	// Cache for 5 minutes
	res.cacheControl({
		maxAge: 300
	});
	var id = req.query.id;
	esclient.get({
		index: "s2forums",
		type: "post",
		"_source": ["revisions.source"],
		id: id
	}, function (error, response) {
		if (error) {
			res.json({
				error: error
			});
			return;
		}

		res.type("text/plain");
		res.send(response._source.revisions[req.query.id.r || 0].source);
	});
});

app.get("*", function(req, res) {
	const location = createLocation(req.path);
	const webserver = process.env.NODE_ENV === "production" ? "" : "//" + hostname + ":8080";
	match({
		routes, location
	}, (error, redirectLocation, renderProps) => {
		if (redirectLocation) {
			res.redirect(redirectLocation.pathname + redirectLocation.search/*, "/"*/);
			return;
		}

		if (error || !renderProps) {
			res.status(404).send("404 not found");
			return;
		}

		Transmit.renderToString(RoutingContext, renderProps).then(({
			reactString, reactData
		}) => {
			let template = (
				`<!doctype html>
<html lang="en-us">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${DocumentTitle.rewind()}</title>
		<link rel="shortcut icon" href="/favicon.ico" />
		<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" integrity="sha256-Ucf/ylcKTNevYP6l7VNUhGLDRZPQs1+LsbbxuzMxUJM= sha512-FW2XqnqMwERwg0LplG7D64h8zA1BsxvxrDseWpHLq8Dg8kOBmLs19XNa9oAajN/ToJRRklfDJ398sOU+7LcjZA==" crossorigin="anonymous" />
		<link href="/css/style.css" rel="stylesheet" />
	</head>
	<body>
		<div id="react-root">${reactString}</div><script>var currentPostCount = ${global.getDocCount()}</script>
	</body>
</html>`
			);

			// this.type = "text/html";
			res.send(Transmit.injectIntoMarkup(template, reactData, [`${webserver}/dist/client.js`]));
		}).catch(function(e) {
			res.status(500).send("<img src='https://i.imgur.com/M11XaEq.png'><h1>Server error</h1><p>" + e + "</p>");
		});
	});

});




server.listen(port, () => {
	console.info("==> ✅  Server is listening");
	console.info("==> Go to http://%s:%s", hostname, port);
});

esclient.ping({
	requestTimeout: 30000,
	// undocumented params are appended to the query string
	hello: "elasticsearch"
}, function(error) {
	if (error) {
		console.error("elasticsearch is down!");
		// console.error('elasticsearch cluster is down!');
	} else {
		// console.log('All is well');
		console.info("Connected to elasticsearch!");
		setInterval(function() {
			updateDocCount();
		}, 1000);
	}
});

/*
 * Live Document Count
 */
var docCount = "?";
var docNS = io.of("/postcount");
global.getDocCount = () => {
	return docCount;
}
function updateDocCount() {
	esclient.count({
		index: "s2forums",
		type: "post"
	}, function(error, response) {
		if (response.count != docCount) {
			docCount = response.count;
			docNS.emit("a", docCount);
			// console.log(scServer.clients);
		}
		// documentCount = response.count;
	})
}
docNS.on("connection", function(socket) {
	socket.emit("a", docCount);
});
