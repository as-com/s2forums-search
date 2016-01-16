import React from "react"
import {PageHeader} from "react-bootstrap"
import socketCluster from "socketcluster-client"
import DocumentTitle from "react-document-title"
import LivePost from "../components/LivePost"
import Spinner from "react-spinner"

if (__CLIENT__)
    var $ = require("browserify-zepto");

export default class Live extends React.Component {
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
        $.ajax({
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
