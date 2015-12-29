import React from "react"
import {Modal, Button} from "react-bootstrap"
import Spinner from "react-spinner"
import Icon from "./Icon"
import ErrorMessage from "./ErrorMessage"

if (__CLIENT__)
    var $ = require("browserify-zepto");

export default class ViewSource extends React.Component {
    loadPost() {
        $.ajax({
            type: "GET",
            url: "/api/post/source",
            data: {id: this.props.id, r: this.props.revId},
            dataType: "text",
            success: this.updateSourceView,
            error: this.updateSourceError
        });
    }
    open = () => {
        this.setState({
            show: true,
            loading: true,
            source: ""
        });
        this.loadPost();
    }
    close = () => {
        this.setState({
            show: false
        });
        setTimeout(this.cleanUp, 400);
    }
    cleanUp = () => {
        this.setState({
            source: ""
        });
    }
    updateSourceView = (data) => {
        this.setState({
            loading: false,
            source: data
        });
    }
    updateSourceError = (xhr, errType, err) => {
        this.setState({
            loading: false,
            source: <ErrorMessage err={err} />
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            source: "",
            loading: false
        }
    }
    render() {
        return <div>
                <Button className="pull-right" onClick={this.open}>
                    <Icon name="embed2" /> View BBCode
                </Button>
                <Modal
                    show={this.state.show}
                    onHide={this.close}
                    bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            View Source
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.loading ? <Spinner /> : <pre>{this.state.source}</pre>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        }
    }
