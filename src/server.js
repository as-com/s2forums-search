var bablePolyfill = require("babel-polyfill");
var express = require("express");
var http = require("http");
var bodyParser = require("body-parser");
var socketClusterServer = require("socketcluster-server");
var fs = require("fs");
var path = require("path");

var React = require("react");
var ReactDOM = require("react-dom/server");
var RoutingContext = require("react-router/lib/RoutingContext");
var match = require("react-router/lib/match");
var createLocation = require("history/lib/createLocation");
var elasticsearch = require("elasticsearch");
var moment = require("moment-timezone");
var memwatch = require("memwatch-next");
var cacheResponseDirective = require("express-cache-response-directive");
var DocumentTitle = require("react-document-title");
var escapeHTML = require("./lib/escapeHTML");

var routesContainer = require("./containers/routes");

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

let routes = routesContainer;
var server = http.createServer(app);
var scServer = socketClusterServer.attach(server);

scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function(req, next) {
	next({name: "denied", message: "Clients can't publish"});
});


var esclient = new elasticsearch.Client({
	host: (process.env.ELASTIC || "192.168.1.65") + ':9200',
	log: 'info'
});

app.use(express.static("static"));
app.use(bodyParser.json());
app.use(cacheResponseDirective());

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("<img src='https://i.imgur.com/M11XaEq.png'><h1>Server error</h1><p>" + e.stack + "</p>");
});

function normalizeTime(str, id) {
	if (id < 131141) {
		return moment.tz(str, "Etc/GMT+12").tz("UTC").format();
	} else {
		return moment.tz(str, "UTC").tz("UTC").format();
	}
}

// Precompile this monstrous regex for better performance

var luceneRegex = /AND|OR|NOT|[\w\.]:(?:[\("].*?[\)"]|\w+?|[\[{]\S+? TO \S+?[\]}]|[><])|".*?"|\\(?:[\+\-\=><\!\(\)\{\}\[\]\^"~\*\?\:\\\/]|(\&\&)|(\|\|))|\w+?[\?\*]|\w+?~|\w\^\d|\s[\+-]\w/; // superfluous newline because Atom screws up syntax highlighting
// Regex matching regexes to prevent people from clobbering database
var regexRegex = /((?![\S"]).|^)([^"\s]+)(?![\S"])/;
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

	// Detect Lucene query syntax
	if (!regexRegex.test(query) && luceneRegex.test(query)) {
		// TODO: https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
	}

	var queryBody = {
		"timeout": "1000ms",
		"_source": ["author", "authorID", "time", "section", "topic"],
		"size": 10,
		"from": 10 * ((req.query.p || 1) - 1),
		"query": {
			"bool": {
				"must": {
					"multi_match": {
						"query": query,
						"fields": ["revisions.text^1.5", "topic", "author^0.6"],
						"fuzziness": "AUTO",
						"minimum_should_match": "30%",
					}
				},
				"should": {
					"multi_match": {
						"query": query,
						"type": "phrase",
						"fields": ["revisions.text^1.5", "topic", "author^0.6"],
						// "fuzziness": "AUTO",
						"slop": 50
					}
				}
			}
		},
		// "rescore": {
	    //     "window_size": 100,
	    //     "query": {
	    //         "rescore_query": {
		// 			"multi_match": {
		// 				"query": query,
		// 				"type": "phrase",
		// 				"fields": ["revisions.text^1.5", "topic", "author^0.6"],
		// 				"fuzziness": "AUTO",
		// 				"slop": 50
		// 			}
	    //         }
	    //     }
	    // },
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
					// "no_match_size": 9999
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
		try {
			body.hits.hits.forEach(function(element) {
				// Normalize times
				element._source.time = normalizeTime(element._source.time, element._id);

				if (!("revisions.text" in element.highlight)) {
					element.highlight["revisions.text"] = ["<span class='text-muted'>Post empty</span><!--<b>-->"];
				}
				if (!("topic" in element.highlight)) {
					element.highlight.topic = [element._source.topic];
				}

				// Elasticsearch does not properly escape no_match output
				if (!~element.highlight["revisions.text"][0].indexOf("<b>")) {
					element.highlight["revisions.text"][0] = escapeHTML(element.highlight["revisions.text"][0]);
				}

				element.id = element._id;
				delete element._id;
				delete element._type;
				delete element._index;
				delete element._source.topic;
			});
			delete body._shards;

			res.json({
				response: body
			});
		} catch(e) {
			console.error(e.stack);
		}
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
app.get("/api/lastLive", function(req, res) {
	res.json(livePosts);
});

var assetURLs = JSON.parse(fs.readFileSync("dist/webpack-assets.json"));

app.get("*", function(req, res) {
	const location = createLocation(req.path);
	const webserver = __PRODUCTION__ ? "" : `//${hostname}:8080`;
	match({
		routes, location: req.url
	}, (error, redirectLocation, renderProps) => {
		if (redirectLocation) {
			res.redirect(redirectLocation.pathname + redirectLocation.search/*, "/"*/);
			return;
		}

		if (error || !renderProps) {
			res.status(404).send("404 not found");
			return;
		}

		let reactString = ReactDOM.renderToString(<RoutingContext {...renderProps} />);
		res.send(`<!DOCTYPE html>
<html>
	<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${DocumentTitle.rewind()}</title>
	<link rel="shortcut icon" href="/favicon.ico" />
	<link href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cerulean/bootstrap.min.css" rel="stylesheet" integrity="sha256-Ucf/ylcKTNevYP6l7VNUhGLDRZPQs1+LsbbxuzMxUJM= sha512-FW2XqnqMwERwg0LplG7D64h8zA1BsxvxrDseWpHLq8Dg8kOBmLs19XNa9oAajN/ToJRRklfDJ398sOU+7LcjZA==" crossorigin="anonymous" />
	<link href="${assetURLs.main.css}" rel="stylesheet" />
</head>
<body>
	<div id="react-root">${reactString}</div>
	<script>var currentPostCount = ${JSON.stringify(global.getDocCount())}</script>
	<script src="${assetURLs.main.js}"></script>
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-20687955-18', 'auto');
	  ga('send', 'pageview');

	</script>
</body>
</html>`);
	});

});




server.listen(port, () => {
	console.info("==> ✅  Server is listening");
	console.info("==> Go to http://%s:%s", hostname, port);
});

if (__DEV__) {
	if (module.hot) {
		console.log("[HMR] Waiting for server-side updates");
		module.hot.accept("containers/routes", () => {
			routes = require("containers/routes");
		});
		module.hot.addStatusHandler((status) => {
				if (status === "abort") {
					setTimeout(() => process.exit(0), 0);
				}
			});
	}
}

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
		getInitialLivePosts();
	}
});

/*
 * Live Document Count
 */
var docCount = "?";
global.getDocCount = () => {
	return docCount;
}
function updateDocCount() {
	esclient.count({
		index: "s2forums",
		type: "post"
	}, function(error, response) {
		if (response.count != docCount) {
			pushNewPosts(response.count - docCount);
			docCount = response.count;
			scServer.exchange.publish("count", docCount);
			// console.log(scServer.clients);
		}
		// documentCount = response.count;
	})
}

scServer.on("connection", function(socket) {
	socket.on("getCount", function() {
		socket.emit("count", docCount);
	});
});

/*
 * Live post view
 */
var livePosts = [];

function getInitialLivePosts() {
	esclient.search({
		index: "s2forums",
		type: "post",
		body: {
			"_source": ["author", "authorID", "time", "section", "topic", "topicID", "revisions.html"],
			"query": {
				"match_all": {}
			},
			"size": 10,
			"sort": [
				{
					"time": {
						"order": "desc"
					}
				}
			]
		}
	}).then(function(resp) {
		livePosts = transformLive(resp.hits.hits);
	});
}

function transformLive(hits) {
	return hits.map((element) => {
		return {
			id: element._id,
			topic: element._source.topic,
			topicID: element._source.topicID,
			author: element._source.author,
			authorID: element._source.authorID,
			section: element._source.section,
			time: normalizeTime(element._source.time),
			html: element._source.revisions[0].html
		};
	});
}
function pushNewPosts(count) {
	esclient.search({
		index: "s2forums",
		type: "post",
		body: {
			"_source": ["author", "authorID", "time", "section", "topic", "topicID", "revisions.html"],
			"query": {
				"match_all": {}
			},
			"size": count,
			"sort": [
				{
					"time": {
						"order": "desc"
					}
				}
			]
		}
	}).then(function(resp) {
		var transformed = transformLive(resp.hits.hits);
		livePosts = transformed.concat(livePosts);
		livePosts.length = 10;
		scServer.exchange.publish("live", transformed);
	});
}
