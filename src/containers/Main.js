var React = require("react");
var Header = require("../components/Header");
var Footer = require("../components/Footer");
var ErrorReporter = require("../components/ErrorReporter");
var NoScriptWarning = require("../components/NoScriptWarning");
var DocumentTitle = require("react-document-title");

require("../css/main.scss");
require("semantic-ui-less/definitions/globals/reset.less");
require("semantic-ui-less/definitions/globals/site.less");
require("semantic-ui-less/definitions/globals/site");
require("semantic-ui-less/definitions/collections/grid.less");
require("semantic-ui-less/definitions/elements/container.less");

module.exports = function(props) {
	return <DocumentTitle title='Scratch Forums Search'>
		<div className="ui grid container">
			<ErrorReporter />
			<Header />
			<div className="container">
				<NoScriptWarning />
				{props.children}
			</div>
			<Footer />
		</div>
	</DocumentTitle>
}
