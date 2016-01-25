// Polyfill require.ensure function
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

var Main = require("../containers/Main");
var Home = require("../containers/Home");

module.exports = {
    path: "/",
    component: Main,
    childRoutes: [
        require("./AboutRoute"),
        require("./PostRoute"),
        require("./SearchRoute"),
        require("./LiveRoute")
    ],
    indexRoute: {
        component: Home
    }
}
