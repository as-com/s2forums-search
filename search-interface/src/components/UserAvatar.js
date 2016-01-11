import React from "react";

var UserAvatar = function(props) {
    return <img src={`https://cdn2.scratch.mit.edu/get_image/user/${props.id || "default"}_${props.size}x${props.size}.png`} width={props.size} height={props.size} {...props} />
}

export default UserAvatar
