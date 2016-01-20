var React = require("react");
var History = require("react-router/lib/History");
var Navbar = require("react-bootstrap/lib/Navbar");
var Input = require("react-bootstrap/lib/Input");
var Button = require("react-bootstrap/lib/Button");
var Icon = require("./Icon");

module.exports = React.createClass({
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
                defaultValue={this.props.val} />
                {' '}
            </form>
        }
});
