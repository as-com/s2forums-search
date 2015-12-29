import React from "react"
import Post from "../components/Post"
import {PageHeader} from "react-bootstrap"
import Spinner from "react-spinner"
import ErrorMessage from "../components/ErrorMessage"

if (__CLIENT__) {
    var scratchblocks2 = require("../lib/scratchblocks");
    var $ = require("npm-zepto");
}

export default class PostView extends React.Component {
    loadPost() {
        $.ajax({
            type: "GET",
            url: "/api/post",
            data: {id: this.props.params.id},
            dataType: "json",
            success: this.updatePostView,
            error: this.updatePostError
        });
    }
    updatePostView = (res) => {
        this.setState({response: res, loading: false});
    }
    updatePostError = (xhr, errType, err) => {
        this.setState({error: err, loading: false});
    }
    constructor(props) {
        super(props);
        this.state = {
            response: {},
            error: false,
            loading: true
        }
    }
    componentDidMount() {
        this.loadPost();
    }
    componentDidUpdate() {
        scratchblocks2.parse("pre.blocks");
    }
    render() {
        if (this.state.loading) {
            return <Spinner />
        }
        if (this.state.error) {
            return <ErrorMessage err={this.state.error} />
        }
        return <Post id={this.props.params.id} data={this.state.response.response} />
    }
}
