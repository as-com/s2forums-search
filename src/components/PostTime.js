import React from "react"

export default function(props) {
    return <time dateTime={props.time}>{new Date(props.time).toLocaleString()}</time>
}
