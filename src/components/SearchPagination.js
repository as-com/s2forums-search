var React = require("react");
var Pagination = require("react-bootstrap/lib/Pagination");
var History = require("react-router/lib/History");

module.export = React.createClass({
    mixins: [History],
    handleSelect: function(e, selected) {
        this.history.pushState(this.state, "/search", {
            q: this.props.query,
            p: selected.eventKey,
            sort: this.props.sort
        });
    },
    render: function() {
        if (this.props.total < 1) {
            return <span></span>
        }
        return <Pagination prev next first ellipsis items={Math.ceil(this.props.total / 10)} maxButtons={10} activePage={this.props.page} onSelect={this.handleSelect} />
    }
});
