var React = require("react");
var ReactDOM = require("react-dom");
var Router = require("react-router/lib/Router");
var routesContainer = require("containers/routes");
var createHistory = require("history/lib/createHistory");

/**
 * Fire-up React Router.
 */
const reactRoot = window.document.getElementById("react-root");
ReactDOM.render(<Router history={createHistory()}>{routesContainer}</Router>, reactRoot);

/**
 * Detect whether the server-side render has been discarded due to an invalid checksum.
 */
// if (process.env.NODE_ENV !== "production") {
// 	if (!reactRoot.firstChild || !reactRoot.firstChild.attributes ||
// 	    !reactRoot.firstChild.attributes["data-react-checksum"]) {
// 		console.error("Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.");
// 	}
// }
