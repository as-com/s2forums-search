import React from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ErrorReporter from "../components/ErrorReporter"
import NoScriptWarning from "../components/NoScriptWarning"
import DocumentTitle from "react-document-title"

export default class Main extends React.Component {
	render () {
		return <DocumentTitle title='Scratch Forums Search'>
			<div>
				<ErrorReporter />
				<Header />
				<div className="container">
					<NoScriptWarning />
					{this.props.children}
				</div>
				<Footer />
			</div>
		</DocumentTitle>
	}

}
