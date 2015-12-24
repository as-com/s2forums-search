process.env.TZ = 'America/New_York';
var request = require("request");
var elasticsearch = require("elasticsearch");
var cheerio = require("cheerio");
var log4js = require('log4js');
var fs = require("fs");
require("heapdump");
var logger = log4js.getLogger();
require("sugar");
var moment = require("moment-timezone");
var client = new elasticsearch.Client({
	host: 'elasticsearch:9200',
	log: 'info'
});
logger.setLevel('DEBUG');
var post = 1;

function writeState(id) {
	fs.writeFile("currentID.json", JSON.stringify(id), function(err, data) {
		if (err) {
			logger.error("Failed to write state file: " + err);
		} else {
			logger.trace("Wrote state file to " + id);
		}
		err = null;
		data = null;
	})
	id = null;
}

function parsePost(response, body, id) {
	// console.log("Found post", id);
	logger.debug("Parsing post #" + id);
	// console.log("---------------------");
	// Super messy fragile parsing
	var $ = cheerio.load(body);
	var p = "#p" + id + " ";
	if ($(p).length == 0) {
		logger.warn("Server sent page, but post #" + id + " not found");
		return;
	}
	// Contains the time in UTC, in a string
	var time = moment(Date.create($(p + ".box-head > a").text())).format("YYYY-MM-DDTHH:MM:SS");
	logger.trace("Time: " + time);
	var author = $(p + "a.username").text();
	logger.trace("Author: " + author);
	var authorID = parseInt($(p + ".postavatar img").attr("src").split("/get_image/user/")[1].split("_")[0]);
	logger.trace("Author ID: " + authorID);
	var topicID = parseInt(response.request.uri.href.split("/discuss/topic/")[1].split("/")[0]);
	logger.trace("Topic ID: " + topicID);
	var topic = $(".linkst ul>li:last-child").contents(":not(:empty)").first().text().substr(1).trim();
	logger.trace("Topic title: " + topic);
	var section = $(".linkst ul>li:nth-child(2)>a").text();
	logger.trace("Topic section: " + section);
	var postText = $(p + ".post_body_html").text();
	var postHtml = $(p + ".post_body_html").html();
	var postEditAuthor;
	var postEditTime;
	try {
		postEditAuthor = $(p + ".posteditmessage").text().split("Last edited by ")[1].split(" (")[0];
		logger.trace("Post last edited by: " + postEditAuthor);
		postEditTime = moment(Date.create($(p + ".posteditmessage").text().split("Last edited by ")[1].split(" (")[1].split(")")[0])).tz("UTC").format("YYYY-MM-DDTHH:MM:SS");
		logger.trace("Post last edited on: " + postEditTime);
	} catch (e) {
		// post wasn't edited
		logger.trace("Post not edited.");
		postEditAuthor = author;
		postEditTime = time;
	}
	$ = null; // help free up some memory
	response = null;
	body = null;
	// Get the BBCode source of the post
	var postSource;
	request("https://scratch.mit.edu/discuss/post/" + id + "/source/", function(error, response, body) {
		if (error) {
			logger.error("Error getting BBCode: " + error);
			logger.error("Trying again...");
			setTimeout(function() {
				grabPost(id);
			}, 5000);
			error = null;
			response = null;
			body = null;
		} else {
			postSource = body;
			body = null;
			logger.trace("Successfully got BBCode");
			// check if we already have it
			client.get({
				index: "s2forums",
				type: "post",
				id: id
			}, function(error, response) {
				if (error) {
					logger.error("Error getting existing item: " + error);
					logger.error("Trying again...");
					setTimeout(function() {
						grabPost(id);
					}, 5000);
					error = null;
					response = null;
				} else if (response.found) {
					// post already in index
					// NOTE: Posts before 131141 store their date in UTC-12. Don't ask why.
					// posts after that use UTC.
					if (postEditTime != response._source.revisions[response._source.revisions.length - 1].time) {
						// post updated
						response = null;
						client.update({
							index: "s2forums",
							type: "post",
							id: id,
							body: {
								script: "ctx._source.revisions.add(rev)",
								params: {
									rev: {
										author: postEditAuthor,
										time: postEditTime,
										text: postText,
										html: postHtml,
										source: postSource
									}
								}
							}
						}, function(error, response) {
							if (error) {
								logger.error("Failed to update post #" + id + ": " + error);
								error = null;
								response = null;
								// logger.error("Trying again...");
								// grabPost(id);
							} else {
								logger.info("Updated post #" + id);
								writeState(id);
								error = null;
								response = null;
							}
						});
					} else {
						logger.info("Skipping post #" + id);
						writeState(id);
						response = null;
					}
				} else {
					response = null;
					// index it
					logger.debug("Indexing post #" + id);
					client.create({
						index: "s2forums",
						type: "post",
						id: id,
						requestTimeout: 60000,
						body: {
							author: author,
							authorID: authorID,
							time: time,
							topic: topic,
							topicID: topicID,
							section: section,
							revisions: [{
								author: postEditAuthor,
								time: postEditTime,
								text: postText,
								html: postHtml,
								source: postSource
							}]
						}
					}, function(error, response) {
						//console.log("Elasticsearch:", response);
						if (error) {
							logger.error("Failed to put post #" + id + " in index: " + error);
							logger.error("Trying again...");
							setTimeout(function() {
								grabPost(id);
							}, 5000);
							response = null;
							error = null;
						} else {
							logger.info("Indexed post #" + id);
							writeState(id);
							response = null;
						}
					});
				}
			});
		}
	});
}

function grabPost(id) {
	// fs.writeFile("currentID.json", id);
	request.get({
		uri: "https://scratch.mit.edu/discuss/post/" + id + "/",
		timeout: 45000
	}, function(error, response, body) {
		if (error) {
			logger.error("Error getting post: " + error);
			logger.error("Trying again in a few seconds...");
			setTimeout(function() {
				grabPost(id);
			}, 10000);
			error = null;
			response = null;
			body = null;
		}
		if (response.statusCode == 404) {
			logger.info("404 for post #" + id);
			// Workaround for early posts
			if (id > 1673188) {
				// Wait until post becomes available
				logger.debug("Waiting a few seconds for the post to become available...");
				setTimeout(function() {
					grabPost(id);
				}, 5000);
			} else {
				// Index next post
				logger.debug("Moving on to next post...");
				setTimeout(function() {
					grabPost(id + 1);
				}, 300);
			}
			response = null;
			body = null;
		} else if (response.statusCode == 403) {
			logger.info("Post #" + id + " deleted");
			// Index next post
			setTimeout(function() {
				grabPost(id + 1);
			}, 300);
			response = null;
			body = null;
		} else if (response.statusCode == 200) {
			parsePost(response, body, id);
			// Index next post
			setTimeout(function() {
				grabPost(id + 1);
			}, 300);
			response = null;
			body = null;
		} else {
			logger.error("Got unknown error code " + response.statusCode + " for " + id);
			// Wait until server is available
			logger.error("Waiting 10 seconds...");
			setTimeout(function() {
				grabPost(id);
			}, 10000);
			response = null;
			body = null;
		}
	});
}
client.ping({
	requestTimeout: 30000,
	// undocumented params are appended to the query string
	hello: "elasticsearch"
}, function(error) {
	if (error) {
		logger.fatal("elasticsearch is down!");
		process.exit(1);
		// console.error('elasticsearch cluster is down!');
	} else {
		// console.log('All is well');
		logger.info("Connected to elasticsearch!");
		var startPost = JSON.parse(fs.readFileSync("currentID.json"));
		logger.info("Resuming at post #" + startPost);
		grabPost(startPost);
	}
});
