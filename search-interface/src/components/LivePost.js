import React from "react";
import {Link} from "react-router";
import {Panel} from "react-bootstrap";
import PostTime from "./PostTime";

if (__CLIENT__) {
    var scratchblocks2 = require("../lib/scratchblocks");
}

function createResultMarkup(text) {
    return {
        __html: text
    }
}

export default class LivePost extends React.Component {
    componentDidMount = () => {
        scratchblocks2.parse(`#p${this.props.id} pre.blocks`);
    }
    render() {
        var title = (<h3>{this.props.author} wrote on <span dangerouslySetInnerHTML={createResultMarkup(this.props.topic)}></span><span className="pull-right"><PostTime time={this.props.time} /></span></h3>);
        return <Link to={"/post/" + this.props.id} className="resultLink" id={"p" + this.props.id}>
                <Panel header={title}>
                    <div dangerouslySetInnerHTML={createResultMarkup(this.props.html)}></div>
                </Panel>
            </Link>
    }
}
