module.exports = {
    path: "/post/:id",
    getComponent: function(location, cb) {
        if (__SERVER__) {
            global.chunks[global.chunks.length] = "postview";
        }
        require.ensure([], function(require) {
            cb(null, require("../containers/PostView"));
        }, "postview");
    }
};
