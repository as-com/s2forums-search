import React from "react"
import {PageHeader, ListGroup, Button} from "react-bootstrap"
import DocumentTitle from "react-document-title"
import TopicLink from "./TopicLink"
import UserLink from "./UserLink"
import UserAvatar from "./UserAvatar"
import Revision from "./Revision"
import PostTime from "./PostTime"
import Icon from "./Icon"
import sanitizeHTML from "../lib/sanitizeHTML"

function createDangerousMarkup(text) {
    return {
        __html: text
    }
}

export default function(props) {
    var revisionNodes = props.data._source.revisions.map(function(revision, index) {
          return <Revision key={index} revId={index} author={revision.author} time={revision.time} id={props.id}><div dangerouslySetInnerHTML={createDangerousMarkup(sanitizeHTML(revision.html) || "<p class='text-muted'>Post empty</p>")}></div></Revision>
        });
    return <DocumentTitle title={`${props.data._source.author} on ${props.data._source.topic} - Scratch Forums Search`}>
        <div>
        <h2><UserAvatar id={props.data._source.authorID} size="50" /> <UserLink username={props.data._source.author} /> wrote on <TopicLink id={props.data._source.topicID} title={props.data._source.topic} /> on <PostTime time={props.data._source.time} />
        {' '}<Button href={`https://scratch.mit.edu/discuss/post/${props.id}/`} target="_blank" className="pull-right"><Icon name="new-tab" /></Button></h2>
            {revisionNodes}
        </div>
    </DocumentTitle>
}
