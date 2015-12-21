moment.locale('en', {
    calendar: {
        lastDay: '[Yesterday at] LT',
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        lastWeek: '[last] dddd [at] LT',
        nextWeek: 'dddd [at] LT',
        sameElse: 'YYYY-MM-DD hh:mm:ss A'
    }
});

function renderResults(data) {
    var template = $("#result-template").html();
    Mustache.parse(template);
    data.formatTime = function() {
        return moment(this._source.time).calendar();
    }
    data.formatEditTime = function() {
        return moment(this.time).calendar();
    }
    data.getCachebuster = function() {
        return moment(this._source.time).unix();
    }
    $("#results").html(Mustache.render(template, data));
}

function fetchResults(text) {
    $.ajax('/search', {
            data: JSON.stringify({
                query: text
            }),
            contentType: "application/json",
            type: "POST",
            dataType: "json",
        })
        .done(function(data, textStatus, xhr) {
            // console.log(data, textStatus, xhr)
            $(".search-box, .search-sub").removeAttr("disabled");
            renderResults(data.response);
        });
}

$(".search-form").submit(function(e) {
    e.preventDefault();
    $(".search-box, .search-sub").attr("disabled", 1);
    fetchResults(document.getElementById("big-search-box").value);
    $("html")[0].scrollTop = $("#results").offset().top - 70;
});

$("#top-search-box").on("input propertychange paste", function() {
    document.getElementById("big-search-box").value = this.value;
});
$("#big-search-box").on("input propertychange paste", function() {
    document.getElementById("top-search-box").value = this.value;
});
}
