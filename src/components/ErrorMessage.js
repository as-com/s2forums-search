import React from "react"
import {Alert} from "react-bootstrap"

export default function(props) {
    return <div>
        <Alert bsStyle="danger">
            <strong>An error occured: </strong>
            <pre>{props.err}</pre>
        </Alert>
    </div>
}
