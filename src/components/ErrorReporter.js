var React = require("react");
var Button = require("react-bootstrap/lib/Button");
var Modal = require("react-bootstrap/lib/Modal");

export default class ErrorReporter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            message: "",
            file: "",
            line: "",
            column: "",
            stackTrace: ""
        }
        if (__CLIENT__)
            window.onerror = this.handleError;
    };

    handleError = (message, file, line, column, errorObj) => {
        var stackTrace = "Browser does not support printing stack traces.";
        if(errorObj !== undefined)
            stackTrace = errorObj.stack;
        this.setState({
            showModal: true,
            message: message,
            file: file,
            line: line,
            column: column,
            stackTrace: stackTrace
        });
    };
    close = () => {
        this.setState({ showModal: false });
    };

    open = () => {
        this.setState({ showModal: true });
    };

    render() {
        return <Modal bsSize="large" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Oops! Something went wrong.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>An error occurred in this application. Here are the details of the error:</p>
            <pre>
                Message: {this.state.message} <br />
                File: {this.state.file} <br />
                Line: {this.state.line} <br />
                Column: {this.state.column} <br />
                Stack trace: {this.state.stackTrace}
            </pre>
            <p>The application may or may not be functioning properly now. If it isn't, you will need to reload the page.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
    };
}
