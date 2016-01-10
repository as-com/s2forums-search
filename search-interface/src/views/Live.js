import React from "react"
import {PageHeader} from "react-bootstrap"
var io = require("socket.io-client");

export default class Live extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }
    componentDidMount = () => {
        this.socket = io(window.location.host + "/live");
        this.socket.on("a", this.addPost);
    }
    componentWillUnmount = () => {
        this.socket.off("a", this.addPost);
        this.socket.disconnect();
        delete this.socket;
    }
    addPost = (data) => {
        this.setState({posts: this.state.posts.concat(data)});
    }
    render() {
        var posts = this.state.posts.map(function(element) {
            return <div>{JSON.stringify(element)}</div>
        });
        return <div>
            <PageHeader>Live View</PageHeader>
            <p>See posts right as they are posted.</p>
            {posts}
        </div>
    }
}
