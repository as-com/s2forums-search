import React from "react"
import {Alert} from "react-bootstrap"

export default function(props) {
    return <div className="text-muted">{props.page == 1 ? "Found" : "Page " + props.page + " of"} {props.count}{props.timed_out ? "+" : ""} {props.count == 1 ? "result" : "results"} ({props.time / 1000} seconds)</div>
}
