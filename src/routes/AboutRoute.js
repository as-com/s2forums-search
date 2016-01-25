module.exports = {
    path: "/about",
    getComponent: function(location, cb) {
        if (__SERVER__) {
            global.chunks[global.chunks.length] = "about";
        }
        require.ensure([], function(require) {
            cb(null, require("../containers/About"));
        }, "about");
    }
};
