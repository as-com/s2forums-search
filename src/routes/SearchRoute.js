module.exports = {
    path: "/search",
    getComponent: function(location, cb) {
        if (__SERVER__) {
            global.chunks[global.chunks.length] = "search";
        }
        require.ensure([], function(require) {
            cb(null, require("../containers/Search"));
        }, "search");
    }
};
