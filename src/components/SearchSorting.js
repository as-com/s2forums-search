var React = require("react");
var Link = require("react-router/lib/Link");
var Dropdown = require("react-bootstrap/lib/Dropdown");
var MenuItem = require("react-bootstrap/lib/MenuItem");
var {LinkContainer} = require("react-router-bootstrap");

const sortTerms = {
    "relevance": "Relevance",
    "date-desc": "Date (newest first)",
    "date-asc": "Date (oldest first)"
};

module.exports = function(props) {
    return <Dropdown pullRight className="pull-right sorting-selector" bsSize="small" id="search-sort">
        <Dropdown.Toggle>
            <span className="text-muted">Sort by: </span><b>{sortTerms[props.sort]}</b>
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <LinkContainer to="/search" query={{q: props.query, sort: "relevance"}} disabled={props.sort == "relevance"}><MenuItem>Relevance</MenuItem></LinkContainer>
            <LinkContainer to="/search" query={{q: props.query, sort: "date-desc"}} disabled={props.sort == "date-desc"}><MenuItem>Date (newest first)</MenuItem></LinkContainer>
            <LinkContainer to="/search" query={{q: props.query, sort: "date-asc"}} disabled={props.sort == "date-asc"}><MenuItem>Date (oldest first)</MenuItem></LinkContainer>
        </Dropdown.Menu>
    </Dropdown>
}
