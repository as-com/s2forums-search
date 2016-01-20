var Main = require("./Main");
var About = require("./About");
var Home = require("./Home");
var NotFound = require("./NotFound");
var PostView = require("./PostView");
var Search = require("./Search");
var Live = require("./Live");
var React = require("react");
var Route = require("react-router/lib/Route");
var IndexRoute = require("react-router/lib/IndexRoute");

/**
* The React Router 1.0 routes for both the server and the client.
*/
module.exports = (
	<Route path="/" component={Main}>
		<IndexRoute component={Home} />
		<Route path="/about" component={About} />
		<Route path="/post/:id" component={PostView} />
		<Route path="/search" component={Search} />
		<Route path="/live" component={Live} />
	</Route>
);
