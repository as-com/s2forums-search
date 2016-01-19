import React from "react"
import {PageHeader} from "react-bootstrap"
import Form from "../components/Form"
import PostCount from "../components/PostCount"

export default function() {
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
