import React from "react"
import { LinkWrapper, IndexLinkWrapper } from "react-router-bootstrap"
import Icon from "./Icon"

export default function() {
    return <footer className="footer">
        <hr />
  <div className="container">
    <p className="text-muted">Made by <a href="https://andrewsun.com/">Andrew Sun</a>. This site is not affiliated with Scratch, the Scratch team, or MIT in any way. <span className="pull-right">v0.3.1-beta <Icon name="lab" /></span></p>
  </div>
</footer>
}
