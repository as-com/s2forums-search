module.exports = {
    path: "/post/:id",
    getComponent: function(location, cb) {
        require.ensure([], function(require) {
            cb(null, require("../containers/PostView"));
        }, "postview");
    }
};
