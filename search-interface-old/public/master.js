// Live document counter
var socket = socketCluster.connect();
socket.on("connect", function() {
    console.log("CONNECTED");
});
var docupd = socket.subscribe('docupd');
var docCount = document.getElementById("docupd");
docupd.watch(function(data) {
    docCount.innerHTML = data;
})

/* Handlebars helpers */
Handlebars.registerHelper("formatTime", function(time) {
    return moment(time).calendar();
});
Handlebars.registerHelper("unixTime", function(time) {
    return moment(time).unix();
});
Handlebars.registerHelper('with', function(context, options) {
    return options.fn(context);
});
Handlebars.registerHelper('if', function(conditional, options) {
    if (conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});
Handlebars.registerHelper("ifIsNull", function(input, output) {
    if (input) {
        return input;
    } else {
        return output;
    }
})
