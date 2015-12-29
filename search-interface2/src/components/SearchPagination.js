import React from "react";
import {Pagination} from "react-bootstrap"
import {History} from "react-router"

export default React.createClass({
    mixins: [History],
    handleSelect: function(e, selected) {
        this.history.pushState(this.state, "/search", {
            q: this.props.query,
            p: selected.eventKey
        });
    },
    render: function() {
        if (this.props.total < 1) {
            return <span></span>
        }
        return <Pagination prev next first ellipsis items={Math.ceil(this.props.total / 10)} maxButtons={10} activePage={this.props.page} onSelect={this.handleSelect} />
    }
});
