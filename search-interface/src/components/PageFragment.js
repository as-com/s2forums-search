import React from "react"
import Spinner from "react-spinner"
import Transmit from "react-transmit"
import ErrorMessage from "./ErrorMessage"

if (__CLIENT__)
    var $ = require("browserify-zepto");


function fetchPage(name) {
    if (__SERVER__) {
        return new Promise(
            function(resolve, reject) {
                setTimeout(function() {
                    resolve(global.pageFragments[name]);
                }, 0);
            }
        )
    }
    return new Promise(
        function(resolve, reject) {
            $.ajax({
                type: "GET",
                url: "/api/site/page_fragment",
                data: {name: name},
                dataType: "text",
                success: resolve,
                error: reject
            });
        }
    )
}

class PageFragment extends React.Component {
    createDangerousMarkup(html) {
        return {
            __html: html
        };
    }
    render() {
        // if (this.state.loading) {
        //     return <Spinner />
        // }
        // if (this.state.error) {
        //     return <ErrorMessage err={this.state.error} />
        // }
        return <div dangerouslySetInnerHTML={this.createDangerousMarkup(this.props.page)}></div>
    }
}

export default Transmit.createContainer(PageFragment, {
    initialVariables: {
        name: "about"
    },
    fragments: {
        page ({name}) {
            return fetchPage(name).then(res => res, (xhr, errType, err) => err);
        }
    }
});
