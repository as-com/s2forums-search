import React from "react"

require("../css/icons/style.css");

export default function(props) {
    return <i className={`icon-${props.name}`}></i>
}
