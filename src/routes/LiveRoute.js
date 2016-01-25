module.exports = {
    path: "/live",
    getComponent: function(location, cb) {
        require.ensure([], function(require) {
            cb(null, require("../containers/Live"));
        }, "live");
    }
};
