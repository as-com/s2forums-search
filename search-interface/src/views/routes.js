import Main from "views/Main"
import About from "views/About"
import Home from "views/Home"
import NotFound from "views/NotFound"
import PostView from "views/PostView"
import Search from "views/Search"
import React from "react"
import {Router, Route, IndexRoute, NotFoundRoute} from "react-router"

/**
* The React Router 1.0 routes for both the server and the client.
*/
export default (
	<Router>
		<Route path="/" component={Main}>
			<IndexRoute component={Home} />
			<Route path="/about" component={About} />
			<Route path="/post/:id" component={PostView} />
			<Route path="/search" component={Search} />
		</Route>
	</Router>
);
