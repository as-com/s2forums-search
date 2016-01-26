var React = require("react");
var Link = require("react-router/lib/Link");
var IndexLink = require("react-router/lib/IndexLink");
var Nav = require("react-bootstrap/lib/Nav");
var Navbar = require("react-bootstrap/lib/Navbar");
var NavItem = require("react-bootstrap/lib/NavItem");
var LinkContainer = require("react-router-bootstrap/lib/LinkContainer");
var IndexLinkContainer = require("react-router-bootstrap/lib/IndexLinkContainer");
var Icon = require("./Icon");
var PostCount = require("./PostCount");
var Form = require("./Form");

require("semantic-ui-less/definitions/collections/menu.less");

/*
<Navbar fixedTop={true}>
    <Navbar.Header>
        <Navbar.Brand>
            <IndexLink to="/">
                <img src="/img/scratch-logo.png" width="81" height="30" alt="Scratch" /> Forums Search <sup className="beta-mark">BETA</sup>
            </IndexLink>
        </Navbar.Brand>
        <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
        <Nav>
            <IndexLinkContainer to="/">
                <NavItem eventKey={1}>Home</NavItem>
            </IndexLinkContainer>
            <LinkContainer to="/live">
                <NavItem eventKey={2}>Live</NavItem>
            </LinkContainer>
            <LinkContainer to="/about">
                <NavItem eventKey={2}>About</NavItem>
            </LinkContainer>
        </Nav>
        <Nav>
            <NavItem href="https://github.com/as-com/s2forums-search" target="_blank"><Icon name="github" /> Fork me on GitHub</NavItem>
        </Nav>
        <Navbar.Text pullRight>
            <span className="post-count"><strong><PostCount /></strong> posts indexed so far.</span>
        </Navbar.Text>
    </Navbar.Collapse>
</Navbar>
*/

module.exports = function () {
    return <div className="ui top fixed menu stackable large blue">
        <div className="header item">
            <IndexLink to="/"><img src="/img/scratch-logo.png" width="81" height="30" alt="Scratch" /> Forums Search <sup className="beta-mark">BETA</sup></IndexLink>
        </div>
        <IndexLink to="/" className="item">Home</IndexLink>
        <Link to="/live" className="item">Live</Link>
        <Link to="/about" className="item">About</Link>
    </div>
}
