import React from "react";
import {Link} from "react-router";
import {Panel} from "react-bootstrap";
import PostTime from "./PostTime";

function createResultMarkup(text) {
    return {
        __html: text
    }
}

var SearchResult = function(props) {
    var title = (<h3>{props.author} wrote on <span dangerouslySetInnerHTML={createResultMarkup(props.topic)}></span><span className="pull-right"><PostTime time={props.time} /></span></h3>);
    return <Link to={"/post/" + props.id} className="resultLink">
            <Panel header={title}>
                <div dangerouslySetInnerHTML={createResultMarkup(props.text)}></div>
            </Panel>
        </Link>
}

export default SearchResult;
