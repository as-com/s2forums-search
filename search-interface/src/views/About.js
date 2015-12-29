import React from "react"
import {PageHeader} from "react-bootstrap"
import DocumentTitle from "react-document-title"

export default function() {
    return <DocumentTitle title="About - Scratch Forums Search">
        <div>
            <PageHeader>About</PageHeader>
            <p>This is a specialized search engine for <a href="https://scratch.mit.edu/discuss/">MIT's Scratch forums</a>. People have expressed distaste toward the existing Google Custom Search-based search engine, which often returns junk and duplicate results. I've created this to solve that issue.</p>
            <p>A search engine like this one, once it has finished indexing all of the posts on the forums, has the added perk of being able to capture and save posts right when they are posted, before the author or a moderator gets a chance to edit it. Remember kids, the Internet truly never forgets.</p>
            <p>Additionally, this project has given me to a chance to try modern web technologies, such as a backend server powered by Node.js and Elasticsearch, and a web interface powered by React. The technologies powering this site are very similar to Scratch's new design.</p>
            <p>Please keep in mind that this software is currently in a "beta" stage. There will be bugs. If you find any bugs, errors, or missing posts, you can <a href="https://github.com/as-com/s2forums-search/issues/">open an issue on the GitHub repository</a>.</p>
            <h2>Known issues</h2>
            <ul>
                <li>On mobile devices, the header bar is too tall because the logo area is too wide.</li>
                <li>Bad user input is sometimes treated badly.</li>
                <li>I'm not a great user interface designer, so some parts may look bad or not make sense.</li>
                <li>The search results may not be the most relevant. Relevance still needs optimization.</li>
                <li>The amount of JavaScript loaded could be reduced a bit</li>
            </ul>
            <h2>Planned features</h2>
            <ul>
                <li>Advanced search (aka faceted search)</li>
                <li>Better results for languages other than "strings of characters separated by spaces"</li>
                <li>Live post view</li>
                <li>A better "about" page</li>
            </ul>
        </div>
    </DocumentTitle>
}
