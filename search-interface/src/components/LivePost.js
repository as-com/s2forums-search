import React from "react"
import {Link} from "react-router"
import {Panel} from "react-bootstrap"
import PostTime from "./PostTime"
import UserAvatar from "./UserAvatar"

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
        var title = <h3>
            <Link to={"/post/" + this.props.id} id={"p" + this.props.id}>
                <UserAvatar id={this.props.authorID} size={50} className="sideAvatar" /> {this.props.author} wrote on {this.props.topic} <span className="pull-right"><PostTime time={this.props.time} /></span>
            </Link>
        </h3>
        return <Panel header={title} className={"animated bounceIn resultPanel"}>
                    <div dangerouslySetInnerHTML={createResultMarkup(this.props.html)}></div>
                </Panel>
    }
}
