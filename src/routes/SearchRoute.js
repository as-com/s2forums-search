module.exports = {
    path: "/search",
    getComponent: function(location, cb) {
        require.ensure([], function(require) {
            cb(null, require("../containers/Search"));
        }, "search");
    }
};
