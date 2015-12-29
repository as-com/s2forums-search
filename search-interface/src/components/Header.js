import React from "react"
import { Link, IndexLink } from "react-router"
import { Nav, Navbar, NavItem } from "react-bootstrap"
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap"
import Icon from "./Icon"
import PostCount from "./PostCount"
import Form from "./Form"

export default function () {
    return <Navbar fixedTop={true}>
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
                <LinkContainer to="/about">
                    <NavItem eventKey={2}>About</NavItem>
                </LinkContainer>
            </Nav>
            <Navbar.Form pullLeft>
                <Form size="medium" autoFocus={false} />
            </Navbar.Form>
            <Nav>
                <NavItem href="https://github.com/as-com/s2forums-search" target="_blank"><Icon name="github" /> Fork me on GitHub</NavItem>
            </Nav>
            <Navbar.Text pullRight>
                <span className="post-count"><strong><PostCount /></strong> posts indexed so far.</span>
            </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>
}
