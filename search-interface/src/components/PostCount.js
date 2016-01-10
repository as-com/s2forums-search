import React from "react"
var io = require("socket.io-client");

export default class PostCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: Number(__SERVER__ ? global.getDocCount() : currentPostCount).toLocaleString()
        }
    }
    componentWillMount = () => {
        if (__CLIENT__) {
            this.socket = io(window.location.host + "/postcount");
            this.socket.on("a", this.updatePostCount);
        }
    }
    componentWillUnmount = () => {
        this.socket.off("a", this.updatePostCount);
        delete this.socket;
    }
    updatePostCount = (data) => {
        this.setState({count: Number(data).toLocaleString()});
    }
    render() {
        return <span>{this.state.count}</span>
    }
}
