var React = require("react");
var UserLink = require("./UserLink");
var PostTime = require("./PostTime");
var ListGroupItem = require("react-bootstrap/lib/ListGroupItem");
var Button = require("react-bootstrap/lib/Button");
var ViewSource = require("./ViewSource");

module.exports = function(props) {
    return <div>
        <hr />
        <h3>Revision by <UserLink username={props.author} /> on <PostTime time={props.time} /></h3>
        {props.children}
        <ViewSource id={props.id} revId={props.revId} />
    </div>
}
