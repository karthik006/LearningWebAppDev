// Client-side code
/* jshint browser: true, jquery: true,curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true,eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
/* global io: true */
"use strict";
var main = function (toDoObjects) {
    var toDos = toDoObjects.map(function (toDo) {
        // we'll just return the description
        // of this toDoObject
        return toDo.description;
    });
    var socket = io();
    $(".tabs a span").toArray().forEach(function (element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function () {
            var $content,
                $input,
                $button,
                i;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul id='newest_tab'>");
                for (i = toDos.length - 1; i >= 0; i--) {
                    $content.append($("<li>").text(toDos[i]));
                }
            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul id='oldest_tab'>");
                toDos.forEach(function (todo) {
                    $content.append($("<li>").text(todo));
                });

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function (toDo) {
                    toDo.tags.forEach(function (tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function (tag) {
                    var toDosWithTag = [];

                    toDoObjects.forEach(function (toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });

                console.log(tagObjects);

                tagObjects.forEach(function (tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul id = 'tags'>");


                    tag.toDos.forEach(function (description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: "),
                    $button = $("<span>").text("+");

                $button.on("click", function () {

                    var description = $input.val(),
                        tags = $tagInput.val().split(","),
                        newToDo = {
                            "description": description,
                            "tags": tags
                        };



                    $.post("todos", newToDo, function (result) {
                        console.log(result);


                        //toDoObjects.push(newToDo);
                        toDoObjects = result;

                        // update toDos
                        toDos = toDoObjects.map(function (toDo) {
                            return toDo.description;
                        });

                        $input.val("");
                        $tagInput.val("");
                    });
                    socket.emit('todoItem', newToDo);
                });
                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);

            }
            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");

    socket.on('todoItem', function (msg) {
        console.log("hi der im connected");
        var $new_tab = $("#newest_tab"),
            $old_tab = $("#oldest_tab"),
            $tag_tab = $("#tags"),
            $new_desc = msg.description,
            $new_tags = msg.tags,
            $new_item = $("<li>").text($new_desc).hide();

			
 function notifyMe(params) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(params);
  }
   else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(params);
      }
    });
  }
}
        if (($new_tab.length) > 0) {
            $new_tab.prepend($new_item);
            $new_item.slideDown(500);
            //alert("New ToDO " + $new_tags + " has been added");
			notifyMe("New ToDO " + $new_tags + " has been added to the list");
        } else if (($old_tab.length) > 0) {
            $old_tab.append($new_item);
            $new_item.slideDown(500);
            notifyMe("New ToDO " + $new_tags + " has been added to the list");
        } else if (($tag_tab.length) > 0) {
            $("main .content").append($("<h3>").text($new_tags));
            $("main .content").append($new_item);
            $new_item.slideDown(500);
            notifyMe("New ToDO " + $new_tags + " has been added to the list");
        }
    });
};

$(document).ready(function () {
    $.getJSON("todos.json", function (toDoObjects) {
        main(toDoObjects);
    });
});