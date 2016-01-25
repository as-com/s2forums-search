module.exports = {
    path: "/about",
    getComponent: function(location, cb) {
        require.ensure([], function(require) {
            cb(null, require("../containers/About"));
        }, "about");
    }
};
