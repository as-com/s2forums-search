import React from "react"
import {PageHeader} from "react-bootstrap"
import socketCluster from "socketcluster-client"
import DocumentTitle from "react-document-title"
import LivePost from "../components/LivePost"

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
    }
    componentWillUnmount = () => {
        this.socket.unsubscribe("live");
        this.channel.unwatch();
        delete this.socket;
    }
    addPost = (data) => {
        this.setState({posts: this.state.posts.concat(data)});
    }
    render() {
        return <DocumentTitle title="Live View - Scratch Forums Search">
            <div>
                <PageHeader>Live View</PageHeader>
                <p>See posts right as they are posted.</p>
                {this.state.posts.map((element) => {
                    return <LivePost {...element} key={element.id} />
                })}
            </div>
        </DocumentTitle>
    }
}
