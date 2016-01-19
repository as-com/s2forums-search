import React from "react"

export default function(props) {
    return <a href={`https://scratch.mit.edu/discuss/topic/${props.id}/`} target="_blank">{props.title}</a>
}
