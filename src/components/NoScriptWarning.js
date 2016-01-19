import React from "react"
import {Alert} from "react-bootstrap"

export default function() {
    return <noscript>
        <Alert bsStyle="danger">
            <strong>It looks like you have JavaScript disabled.</strong> This application heavily relies on JavaScript, and most of it will not work without JavaScript enabled. To enable JavaScript, follow <a href="http://www.enable-javascript.com/">these instructions</a>.
        </Alert>
    </noscript>
}
