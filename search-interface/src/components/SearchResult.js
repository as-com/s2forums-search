import React from "react"
import {Link} from "react-router"
import {Panel} from "react-bootstrap"
import PostTime from "./PostTime"
import UserAvatar from "./UserAvatar"

function createResultMarkup(text) {
    return {
        __html: text
    }
}

export default function(props) {
    var title = (<h3><UserAvatar id={props.authorID} size={50} className="sideAvatar" /> {props.author} wrote on <span dangerouslySetInnerHTML={createResultMarkup(props.topic)}></span><span className="pull-right"><PostTime time={props.time} /></span></h3>);
    return <Link to={"/post/" + props.id} className="resultLink">
            <Panel header={title} className="resultPanel">
                <div dangerouslySetInnerHTML={createResultMarkup(props.text)}></div>
            </Panel>
        </Link>
}
