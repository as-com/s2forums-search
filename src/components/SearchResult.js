var React = require("react");
var Link = require("react-router/lib/Link");
var Panel = require("react-bootstrap/lib/Panel");
var PostTime = require("./PostTime");
var UserAvatar = require("./UserAvatar");

function createResultMarkup(text) {
    return {
        __html: text
    }
}

module.exports = function(props) {
    var title = (<h3><UserAvatar id={props.authorID} size={50} className="sideAvatar" /> {props.author} wrote on <span dangerouslySetInnerHTML={createResultMarkup(props.topic)}></span><span className="pull-right"><PostTime time={props.time} /></span></h3>);
    return <Link to={"/post/" + props.id} className="resultLink">
            <Panel header={title} className="resultPanel">
                <div dangerouslySetInnerHTML={createResultMarkup(props.text)}></div>
            </Panel>
        </Link>
}
