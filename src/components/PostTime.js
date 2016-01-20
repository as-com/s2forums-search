var React = require("react");

module.exports = function(props) {
    return <time dateTime={props.time}>{new Date(props.time).toLocaleString()}</time>
}
