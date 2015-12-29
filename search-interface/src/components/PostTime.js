import React from "react";

var PostTime = function(props) {
    return <time dateTime={props.time}>{new Date(props.time).toLocaleString()}</time>
}
export default PostTime;
