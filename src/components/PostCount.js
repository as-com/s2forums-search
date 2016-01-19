import React from "react"
import socketCluster from "socketcluster-client"

export default class PostCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: Number(__SERVER__ ? global.getDocCount() : currentPostCount).toLocaleString()
        }
    };
    componentDidMount = () => {
        this.socket = socketCluster.connect();
        this.channel = this.socket.subscribe("count");
        this.channel.watch(this.updatePostCount);
        this.socket.emit("getCount");
        this.socket.on("count", this.updatePostCount);
    };
    componentWillUnmount = () => {
        // this.channel.destroy();
        this.channel.unwatch(this.updatePostCount);
        delete this.socket;
    };
    updatePostCount = (data) => {
        this.setState({count: Number(data).toLocaleString()});
    };
    render() {
        return <span>{this.state.count}</span>
    };
}
