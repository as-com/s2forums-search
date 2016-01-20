var React = require("react");

require("../css/icons/style.css");

module.exports = function(props) {
    return <i className={`icon-${props.name}`}></i>
}
