import Main from "./Main"
import About from "./About"
import Home from "./Home"
import NotFound from "./NotFound"
import PostView from "./PostView"
import Search from "./Search"
import Live from "./Live"
import React from "react"
import {Router, Route, IndexRoute, NotFoundRoute} from "react-router"

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
