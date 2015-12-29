import React from "react";
import {Alert} from "react-bootstrap";

var SearchTiming = function(props) {
    return <div className="text-muted">{props.page == 1 ? "Found" : "Page " + props.page + " of"} {props.count}{props.timed_out ? "+" : ""} {props.count == 1 ? "result" : "results"} ({props.time / 1000} seconds)</div>
}
export default SearchTiming;
