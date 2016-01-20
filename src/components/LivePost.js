var React = require("react");
var Link = require("react-router/lib/Link");
var Panel = require("react-bootstrap/lib/Panel");
var PostTime = require("./PostTime");
var UserAvatar = require("./UserAvatar");
var sanitizeHTML = require("../lib/sanitizeHTML");

if (__CLIENT__) {
    var scratchblocks2 = require("../lib/scratchblocks");
}

require("../css/bbcode.css");
require("../css/scratchblocks.css");
require("../css/pygments.css");
require("../css/animate-bounceIn.css");

function createResultMarkup(text) {
    return {
        __html: text
    }
}

module.exports = class LivePost extends React.Component {
    componentDidMount = () => {
        scratchblocks2.parse(`#p${this.props.id} pre.blocks`);
    };
    render() {
        var title = <h3>
            <Link to={"/post/" + this.props.id}>
                <UserAvatar id={this.props.authorID} size={50} className="sideAvatar" /> {this.props.author} wrote on {this.props.topic} <span className="pull-right"><PostTime time={this.props.time} /></span>
            </Link>
        </h3>
        return <Panel header={title} className="animated bounceIn resultPanel" id={"p" + this.props.id}>
                    <div dangerouslySetInnerHTML={createResultMarkup(sanitizeHTML(this.props.html))}></div>
                </Panel>
    };
}
