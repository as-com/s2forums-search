import React from "react"
import UserLink from "./UserLink"
import PostTime from "./PostTime"
import {ListGroupItem, Button} from "react-bootstrap"
import ViewSource from "./ViewSource"

export default function(props) {
    return <div>
        <hr />
        <h3>Revision by <UserLink username={props.author} /> on <PostTime time={props.time} /></h3>
        {props.children}
        <ViewSource id={props.id} revId={props.revId} />
    </div>
}
