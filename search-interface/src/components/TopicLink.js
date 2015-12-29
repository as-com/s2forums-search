import React from "react";

var TopicLink = function(props) {
    return <a href={`https://scratch.mit.edu/discuss/topic/${props.id}/`} target="_blank">{props.title}</a>
}

export default TopicLink
