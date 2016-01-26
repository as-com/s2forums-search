var React = require("react");
var ReactDOM = require("react-dom");
var Router = require("react-router/lib/Router");
var match = require("react-router/lib/match");
var routes = require("./routes/MainRoute");
var createBrowserHistory = require("history/lib/createBrowserHistory");

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

var history = createBrowserHistory();

if (__PRODUCTION__) {
    history.listen(function() {
        _paq.push(['trackPageView']);
    });
}

match({ routes, location }, () => {
  ReactDOM.render(
    <Router routes={routes} history={history} />,
    window.document.getElementById("react-root")
  )
});

/**
 * Detect whether the server-side render has been discarded due to an invalid checksum.
 */
// if (process.env.NODE_ENV !== "production") {
// 	if (!reactRoot.firstChild || !reactRoot.firstChild.attributes ||
// 	    !reactRoot.firstChild.attributes["data-react-checksum"]) {
// 		console.error("Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.");
// 	}
// }
