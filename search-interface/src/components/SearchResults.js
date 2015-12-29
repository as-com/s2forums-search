import React from "react"
import {Panel, PageHeader, Col, Row} from "react-bootstrap"
import SearchTiming from "./SearchTiming"
import SearchResult from "./SearchResult"
import SearchPagination from "./SearchPagination"
import SearchSorting from "./SearchSorting"
import DocumentTitle from "react-document-title"

var SearchResults = function(props) {
    var resultNodes = props.res.response.hits.hits.map(function(result) {
        return (
            <SearchResult
                key={result.id}
                id={result.id}
                author={result._source.author}
                topic={result.highlight.topic[0]}
                text={result.highlight['revisions.text'].join(" (...) ")}
                time={result._source.time} />
        );
    });
    return <DocumentTitle title={`“${props.query}” - Scratch Forums Search`}>
        <div>
            <PageHeader>Search results for “{props.query}”</PageHeader>
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
                query={props.query} />
        </div>
    </DocumentTitle>
}

export default SearchResults
