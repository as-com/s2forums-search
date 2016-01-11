import React from "react"
import {PageHeader} from "react-bootstrap"
import socketCluster from "socketcluster-client"
import DocumentTitle from "react-document-title"
import LivePost from "../components/LivePost"

if (__CLIENT__)
    var $ = require("browserify-zepto");

export default class Live extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }
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
    }
    componentWillUnmount = () => {
        this.socket.unsubscribe("live");
        this.channel.unwatch();
        delete this.socket;
    }
    addPost = (data) => {
        var dat = data.concat(this.state.posts);
        dat.length = 10;
        this.setState({posts: dat});
    }
    render() {
        return <DocumentTitle title="Live View - Scratch Forums Search">
            <div>
                <PageHeader>Live Post View</PageHeader>
                <p>See posts moments after they are posted.</p>
                {this.state.posts.map((element) => {
                    return <LivePost {...element} key={element.id} />
                })}
            </div>
        </DocumentTitle>
    }
}
