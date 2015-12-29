import React from "react";

var UserLink = function(props) {
    return <a href={`https://scratch.mit.edu/users/${props.username}/`} target="_blank">{props.username}</a>
}
export default UserLink
