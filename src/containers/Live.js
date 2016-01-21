var React = require("react");
var PageHeader = require("react-bootstrap/lib/PageHeader");
var socketCluster = require("socketcluster-client");
var DocumentTitle = require("react-document-title");
var LivePost = require("../components/LivePost");
var Spinner = require("../components/Spinner.js");

if (__CLIENT__)
    var ajax = require("../lib/psAjax");

module.exports = class Live extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            loading: true
        }
    };
    componentDidMount = () => {
        this.socket = socketCluster.connect();
        this.channel = this.socket.subscribe("live");
        this.channel.watch(this.addPost);
        ajax({
            type: "GET",
            url: "/api/lastLive",
            dataType: "json",
            success: this.addPost,
            // error: this.updatePostError
        });
    };
    componentWillUnmount = () => {
        this.socket.unsubscribe("live");
        this.channel.unwatch();
        delete this.socket;
    };
    addPost = (data) => {
        var dat = data.concat(this.state.posts);
        dat.length = 10;
        this.setState({posts: dat, loading: false});
    };
    render() {
        return <DocumentTitle title="Live View - Scratch Forums Search">
            <div>
                <PageHeader>Live Post View</PageHeader>
                <p>See new posts moments after they are posted.</p>
                {(() => {
                    if (this.state.loading) {
                        return <Spinner />
                    }
                })()}
                {this.state.posts.map((element) => {
                    return <LivePost {...element} key={element.id} />
                })}
            </div>
        </DocumentTitle>
    };
}
