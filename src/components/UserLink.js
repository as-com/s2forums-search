var React = require("react");

module.exports = function(props) {
    return <a href={`https://scratch.mit.edu/users/${props.username}/`} target="_blank">{props.username}</a>
}
