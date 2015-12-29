import React from "react"
import {Link} from "react-router"
import {Dropdown, MenuItem} from "react-bootstrap"
import {LinkContainer} from "react-router-bootstrap"

const sortTerms = {
    "relevance": "Relevance",
    "date-desc": "Date (newest first)",
    "date-asc": "Date (oldest first)"
};

export default function(props) {
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
