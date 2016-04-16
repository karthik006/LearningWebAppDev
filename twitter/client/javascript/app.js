var main = function () {
    "use strict";

    $.getJSON("/counts.json", function (wordCounts) {
        // Now "wordCounts" will be the object that
        // is returned by the counts.json route we
        // set up in Express
        console.log(wordCounts);
    });
}

$(document).ready(main);