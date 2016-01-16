import React from "react"

export default function(props) {
    return <a href={`https://scratch.mit.edu/users/${props.username}/`} target="_blank">{props.username}</a>
}
