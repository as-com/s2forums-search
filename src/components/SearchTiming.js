var React = require("react");
var Alert = require("react-bootstrap/lib/Alert");

module.exports = function(props) {
    return <div className="text-muted">{props.page == 1 ? "Found" : "Page " + props.page + " of"} {props.count}{props.timed_out ? "+" : ""} {props.count == 1 ? "result" : "results"} ({props.time / 1000} seconds)</div>
}
