var main = function() {
    "use strict";
    var fillHtml;

    function myfunction() {
        $.get("http://localhost:3000/actors", function(getData) {

            getData.forEach(function(actor) {
                if (actor.starred === true) {
                    fillHtml = "<li class ='mdl-list__item'>" + "<span class ='mdl-list__item-primary-content'>" + "<i class='material-icons mdl-list__item-avatar'>person</i>" +
                        "<span>" + actor.name + "</span>" + "</span>" + "<a class='mdl-list__item-secondary-action'><i id =" + actor.id + " class='material-icons' >star</i></a>" + "</li>";
                    $(fillHtml).appendTo('ul.mdl-list');
                } else {
                    fillHtml = "<li class ='mdl-list__item'>" + "<span class ='mdl-list__item-primary-content'>" + "<i class='material-icons mdl-list__item-avatar'>person</i>" +
                        "<span>" + actor.name + "</span>" + "</span>" + "<a class='mdl-list__item-secondary-action'><i id =" + actor.id + " class='material-icons'>star_border</i></a>" + "</li>";
                    $(fillHtml).appendTo('ul.mdl-list');
                }

            });
        });
    }
    myfunction();
    $("button").on("click", function() {
        $.post("http://localhost:3000/actors", {
            name: $("#sample1").val(),
            starred: false
        });
        $("ul").empty();
        myfunction();
    });

    $(document).bind("click", ".mdl-list__item-secondary-action .material-icons", function (evt) {
            var icon = $(evt.target);
            var id = icon.attr("id");
            $.get("http://localhost:3000/actors", function(data) {
                data.forEach(function(actor) {
                    if (id === JSON.stringify(actor.id)) {
                      if (JSON.stringify(actor.starred) === "true") {
                        $(icon).replaceWith("<i id=" +actor.id + " class='material-icons'>star_border</i>");
                            $.ajax({
                                type: 'PUT',
                                contentType: 'application/json',
                                url: 'http://localhost:3000/actors/' + id,
                                data: JSON.stringify({
                                      name: actor.name,
                                      starred: false
                                })
                            });
                        }
                        else {
                            $(icon).replaceWith("<i id=" + actor.id+ " class='material-icons'>star</i>");
                            $.ajax({
                                type: 'PUT',
                                contentType: 'application/json',
                                url: 'http://localhost:3000/actors/' + id,
                                data: JSON.stringify({
                                      name: actor.name,
                                      starred: true
                                })
                            });
                        }
                    }
                });
            });
        }

    );
};
$(document).ready(main);
