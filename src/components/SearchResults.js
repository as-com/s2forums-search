var React = require("react");
var Panel = require("react-bootstrap/lib/Panel");
var Col = require("react-bootstrap/lib/Col");
var Row = require("react-bootstrap/lib/Row");
var SearchTiming = require("./SearchTiming");
var SearchResult = require("./SearchResult");
var SearchPagination = require("./SearchPagination");
var SearchSorting = require("./SearchSorting");
var DocumentTitle = require("react-document-title");

module.exports = function(props) {
    var resultNodes = props.res.response.hits.hits.map(function(result) {
        return (
            <SearchResult
                key={result.id}
                id={result.id}
                author={result._source.author}
                authorID={result._source.authorID}
                topic={result.highlight.topic[0]}
                text={result.highlight['revisions.text'].join(" (...) ")}
                time={result._source.time} />
        );
    });
    return <DocumentTitle title={`“${props.query}” - Scratch Forums Search`}>
        <div>
                <Row>
                    <Col sm={8} xs={12}>
                        <SearchTiming
                            count={props.res.response.hits.total}
                            time={props.res.response.took}
                            timedout={props.res.response.timed_out}
                            page={props.page} />
                    </Col>
                    <Col sm={4} xs={12}>
                        <SearchSorting sort={props.sort} query={props.query} page={props.page} />
                    </Col>
                </Row>
            {resultNodes}
            <SearchPagination
                total={props.res.response.hits.total}
                page={props.page}
                query={props.query}
                sort={props.sort} />
        </div>
    </DocumentTitle>
}
