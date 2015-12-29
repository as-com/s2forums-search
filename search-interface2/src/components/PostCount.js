import React from "react"
import Transmit from "react-transmit"
var io = require("socket.io-client");

export default class PostCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: __SERVER__ ? global.getDocCount() : currentPostCount
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
        this.setState({count: data});
    }
    render() {
        return <span>{this.state.count}</span>
    }
}
