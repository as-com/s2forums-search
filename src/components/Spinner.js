var React = require("react");

require("../css/spinner.css");

module.exports = React.createClass({
    render: function() {
        var bars = [];
        var props = this.props;

        for (var i = 0; i < 12; i++) {
            var barStyle = {};
            barStyle.WebkitAnimationDelay = barStyle.animationDelay =
            (i - 12) / 10 + 's';

            barStyle.WebkitTransform = barStyle.transform =
            'rotate(' + (i * 30) + 'deg) translate(146%)';

            bars.push(
                <div
                    style={barStyle}
                    className="react-spinner_bar"
                    key={i} />
            );
        }

        return (
            <div
                {...props}
                className={(props.className || '') + ' react-spinner'}>
                {bars}
            </div>
        );
    }
});
