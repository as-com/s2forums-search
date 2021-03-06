var React = require("react");
var SearchResults = require("../components/SearchResults");
var ErrorMessage = require("../components/ErrorMessage");
var Form = require("../components/Form");
var PageHeader = require("react-bootstrap/lib/PageHeader");
var Spinner = require("../components/Spinner.js");

if (__CLIENT__)
    var ajax = require("../lib/psAjax");

module.exports = class Search extends React.Component {
    loadSearchResults() {
        var requestData = {
            q: this.props.location.query.q,
            p: this.props.location.query.p || 1
        };
        if (this.props.location.query.sort && this.props.location.query.sort != "relevance") {
            requestData.sort = this.props.location.query.sort;
        }
        ajax({
            type: "GET",
            url: "/api/search",
            data: requestData,
            dataType: "json",
            success: this.updateSearchResults,
            error: this.updateSearchError
        });
    };
    updateSearchResults = (res) => {
        this.setState({response: res, loading: false});
    };
    updateSearchError = (xhr, errType, err) => {
        this.setState({error: err, loading: false});
    };
    constructor(props) {
        super(props);
        this.state = {
            response: {},
            error: "",
            loading: true
        }
    };
    componentDidMount() {
        if (this.props.location.query.q)
            this.loadSearchResults();
        else
            this.setState({error: "You must specify a search query", loading: false});
    };
    componentDidUpdate = (prevProps) => {
        if (JSON.stringify(this.props.location) != JSON.stringify(prevProps.location)) {
            this.setState({
                response: {},
                error: "",
                loading: true
            })
            this.loadSearchResults();
        }
    };
    render() {
        return <div>
            <Form size="medium" autoFocus={false} val={this.props.location.query.q} />
            {
                (() => {
                    if (this.state.loading) {
                        return <Spinner />
                    }
                    else if (this.state.error) {
                        return <ErrorMessage err={this.state.error} />
                    } else {
                        return <SearchResults res={this.state.response} query={this.props.location.query.q} page={parseInt(this.props.location.query.p) || 1} sort={this.props.location.query.sort || "relevance"} />
                    }
                })()
            }
        </div>
    };
}
