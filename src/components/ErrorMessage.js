var React = require("react");
var Alert = require("react-bootstrap/lib/Alert");

module.exports = function(props) {
    return <div>
        <Alert bsStyle="danger">
            <strong>An error occured: </strong>
            <pre>{props.err}</pre>
        </Alert>
    </div>
}
