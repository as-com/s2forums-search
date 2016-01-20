var React = require("react");
var PageHeader = require("react-bootstrap/lib/PageHeader");
var Form = require("../components/Form");
var PostCount = require("../components/PostCount");

module.exports = function() {
    return <div>
        <PageHeader>
        Search <PostCount volatile={true} /> posts on the Scratch forums
        </PageHeader>
        {/*<div className="hero">
        <h1><img src="/img/big-scratch-logo.png" alt="Scratch" height="120" /> Forums Search <sup className="beta-mark">BETA</sup></h1>
        </div>*/}
        <Form size="large" autoFocus={true} />
    </div>
}
