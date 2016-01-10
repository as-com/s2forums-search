import React from "react"
import {History} from "react-router"
import {Navbar, Input, Button} from "react-bootstrap"
import Icon from "./Icon"

export default React.createClass({
    mixins: [History],
    getInitialState: function() {
        return {search: ""}
    },
    handleInputChange: function(e) {
        this.setState({search: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        if (this.state.search)
            this.history.pushState(null, "/search", {
                q: this.state.search
            });
    },
    render: function() {
        return <form onSubmit={this.handleSubmit} action="/search">
            <Input
                type="text"
                placeholder="Search"
                onChange={this.handleInputChange}
                bsSize={this.props.size}
                buttonAfter={
                    <Button type="submit">
                        <Icon name="search" />
                    </Button>
                }
                maxLength="100"
                value={this.state.value}
                autoFocus={this.props.autoFocus}
                name="q"
                value={this.props.val} />
                {' '}
            </form>
        }
    });
