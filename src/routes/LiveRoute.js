module.exports = {
    path: "/live",
    getComponent: function(location, cb) {
        if (__SERVER__) {
            global.chunks[global.chunks.length] = "live";
        }
        require.ensure([], function(require) {
            cb(null, require("../containers/Live"));
        }, "live");
    }
};
