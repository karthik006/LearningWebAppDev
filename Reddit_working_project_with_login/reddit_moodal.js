var main = function() {
    "use strict";
    var i = 1,
        totalnumofitems, jsondata;
    var user = {
            id: 0,
            userName: ""
        },
        username, pwd, like = [],
        notLike = [];

    function myfunction() {

        $.get("http://localhost:3000/reddit", function(getData) {

            getData.forEach(function(reddit) {

                var imgId = reddit.id;
                var postsList = "<div class ='postContent z-depth-1'>" +
                    "<div class = 'votes'>" +
                    "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" +
                    "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" +
                    "<strong id =" + reddit.id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" +
                    "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" +
                    "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" +
                    "</div>" + "<div class='image'>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                    "<img autoplay='false' src=" + JSON.stringify(reddit.image_link) + "width='70' height='60' class='postimage'>" + "</a>" + "</div>" +
                    "<div class='Content-List'>" +
                    "<a href=" + JSON.stringify(reddit.main_link) + ">" +
                    "<p class='postname'>" + reddit.link_title + "</p>" +
                    "<div class='subtitles'>" + "<p class='username'>By " + reddit.username + "</p>" +
                    "<p class='time'>" + timeSince(new Date(reddit.post_time)) + "</p>" +
                    "<p class='share'> share" + "</p>" + "</div>" + "</a>" + "<div id=" + reddit.id + " class='imageDivLink' ></div>" +
                    "<div id=" + reddit.id + " class='contentDivImg'></div>" + "</div>";
                $(postsList).appendTo('div.postsContainer');
                //$("#" + reddit.id + ".votesNum").text(reddit.likes);
                i = i + 1;
                if (reddit.image_link != "image/herald.jpg") {
                    // alert(reddit.id);
                    $("#" + reddit.id + ".imageDivLink").html("<i class='material-icons thumbdown'>play_circle_filled</i>");
                }

                $("#" + reddit.id + ".imageDivLink").on("click", function() {
                    if ($("#" + this.id + ".contentDivImg").css('display') === 'none') {
                        $(".contentDivImg").hide();
                        $("#" + this.id + ".contentDivImg").html("<iframe id=" + reddit.id + " src=" + JSON.stringify(reddit.image_link) + " width='auto' height='auto' frameborder='0' allowfullscreen></iframe>");
                        $("#" + this.id + ".contentDivImg").css('display', 'block');
                        $("#" + reddit.id + ".imageDivLink").html("<i class='material-icons thumbdown'>pause_circle_filled</i>");
                    } else {
                        $("#" + this.id + ".contentDivImg").css('display', 'none');
                        $("#" + reddit.id + ".imageDivLink").html("<i class='material-icons thumbdown'>play_circle_filled</i>");
                    }
                });
                $("#postform")[0].reset();

            }); //end of foreach function
            if (sessionStorage.getItem('user')) {
                user.id = sessionStorage.getItem('id');
                user.userName = sessionStorage.getItem('user');
                username = sessionStorage.getItem('user');
                pwd = sessionStorage.getItem('password');
                var x, y;
                x = sessionStorage.getItem('like');
                y = sessionStorage.getItem('notLike');
                console.log(username);
                //console.log(x);
                //console.log(notLike);

                var i = 0;
                while (i <= x.length) {
                    like.push(x[i]);
                    i = i + 2;
                }
                console.log(like);
                like.forEach(function(element) {
                    $("#" + element + ".voteUpButton").hide();
                    $("#" + element + ".voteUpButtonDisabled").show();
                });

                var i = 0;
                while (i <= y.length) {
                    notLike.push(y[i]);
                    i = i + 2;
                }
                console.log(notLike);
                notLike.forEach(function(element) {
                    $("#" + element + ".voteDownButton").hide();
                    $("#" + element + ".voteDownButtonDisabled").show();
                });
            }

            //Like event:
            $("img.voteUpButton").on("click", function() {
                var $imgId = this.id,
                    main_link, link_title, image_link, result = $("#" + this.id + ".votesNum").text();
                if (username) { // check if the user loged in before letting user to change the Likes status.
                    //if the like button and not like button, both are off:
                    if (!like.includes(this.id) && !notLike.includes(this.id)) {
                        like.push(this.id); // push the post Id to the like list.
                        //write the like array content to the json file.
                        var dt1 = JSON.stringify(like);
                        var dt2 = JSON.stringify(notLike);
                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/users/" + user.id,
                            data: {
                                "id": user.id,
                                "name": user.userName,
                                "password": pwd,
                                "likes": dt1,
                                "notLikes": dt2
                            }
                        });
                        //hide the like button and show the blurrd like button:
                        $("#" + this.id + ".voteUpButton").hide();
                        $("#" + this.id + ".voteUpButtonDisabled").show();
                        result++; // result is the number of likes after increasing or decreasing
                    }

                    //if the post is already not liked before:
                    else if (notLike.includes(this.id)) {
                        notLike.splice(notLike.indexOf(this.id), 1); //take the id from not like list.
                        like.push(this.id); //push the id to the like list.
                        //writting the like array to the json file.
                        var dt1 = JSON.stringify(like);
                        var dt2 = JSON.stringify(notLike);
                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/users/" + user.id,
                            data: {
                                "id": user.id,
                                "name": user.userName,
                                "password": pwd,
                                "likes": dt1,
                                "notLikes": dt2
                            }
                        });
                        $("#" + this.id + ".voteUpButton").hide();
                        $("#" + this.id + ".voteUpButtonDisabled").show();
                        $("#" + this.id + ".voteDownButton").show();
                        $("#" + this.id + ".voteDownButtonDisabled").hide();
                        result++;
                        result++;
                    }
                    sessionStorage.setItem('like', like);
                    sessionStorage.setItem('notLike', notLike);
                    $("#" + this.id + ".votesNum").text(result); //updating the html with the new "Likes" value
                    //get request to get other reddit.json elements by using only the ID:
                    main_link = getData[this.id - 1].main_link;
                    link_title = getData[this.id - 1].link_title;
                    image_link = getData[this.id - 1].image_link;
                    $.ajax({
                        type: "PUT",
                        url: "http://localhost:3000/reddit/" + $imgId,
                        data: {
                            "id": $imgId,
                            "image_link": image_link,
                            "likes": result,
                            "link_title": link_title,
                            "main_link": main_link,
                            "post": "submitted"
                        }
                    });
                } else { //check if not loged in, then it want let the user to do likes or not likes.
                    alert("OOPs! Sorry, you need to log-in first..");
                }
            }); //end of like up event.


            //Not Like event:
            $("img.voteDownButton").on("click", function() {
                var $imgId = this.id,
                    main_link, link_title, image_link, result = $("#" + this.id + ".votesNum").text();
                if (username) { // check if the user loged in before letting user to change the Likes status.
                    if (!notLike.includes(this.id) && !like.includes(this.id)) {
                        notLike.push(this.id);
                        //writting the content of notlike array to the json file.
                        var dt1 = JSON.stringify(like);
                        var dt2 = JSON.stringify(notLike);
                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/users/" + user.id,
                            data: {
                                "id": user.id,
                                "name": user.userName,
                                "password": pwd,
                                "likes": dt1,
                                "notLikes": dt2
                            }
                        });
                        $("#" + this.id + ".voteDownButton").hide();
                        $("#" + this.id + ".voteDownButtonDisabled").show();
                        result--; // result is the number of likes after increasing or decreasing
                    } else if (like.includes(this.id)) {
                        like.splice(like.indexOf(this.id), 1);
                        notLike.push(this.id);
                        var dt1 = JSON.stringify(like);
                        var dt2 = JSON.stringify(notLike);
                        $.ajax({
                            type: "PUT",
                            url: "http://localhost:3000/users/" + user.id,
                            data: {
                                "id": user.id,
                                "name": user.userName,
                                "password": pwd,
                                "likes": dt1,
                                "notLikes": dt2
                            }
                        });
                        $("#" + this.id + ".voteDownButton").hide();
                        $("#" + this.id + ".voteDownButtonDisabled").show();
                        $("#" + this.id + ".voteUpButton").show();
                        $("#" + this.id + ".voteUpButtonDisabled").hide();
                        result--;
                        result--;
                    }
                    sessionStorage.setItem('like', like);
                    sessionStorage.setItem('notLike', notLike);

                    $("#" + this.id + ".votesNum").text(result); //updating the html with the new "Likes" value
                    //get request to get other reddit.json elements by using only the ID:
                    main_link = getData[this.id - 1].main_link;
                    link_title = getData[this.id - 1].link_title;
                    image_link = getData[this.id - 1].image_link;
                    $.ajax({
                        type: "PUT",
                        url: "http://localhost:3000/reddit/" + $imgId,
                        data: {
                            "id": $imgId,
                            "image_link": image_link,
                            "likes": result,
                            "link_title": link_title,
                            "main_link": main_link,
                            "post": "submitted"
                        }
                    });
                } else {
                    alert("OOPs! Sorry, you need to log-in first..");
                }
            }); //end of like down event.
            jsondata = getData;
            totalnumofitems = getData.length;
            pages(totalnumofitems);
        }); //end of $.get function
        $(".button-collapse").sideNav();
        $('.modal-trigger').leanModal();
        $('.tooltipped').tooltip({
            delay: 50
        });
    } //end of my function
    function login() {
        $("#login").on("click", function() {
            //initilaizing user object to zero.
            user.id = 0;
            user.userName = "";
            like = [];
            notLike = [];

            username = document.getElementById("username").value;
            pwd = document.getElementById("password").value;
            //console.log(username);
            if (username === "") {
                alert("please enter your username");
            } else if (pwd === "") {
                alert("please enter your password");
            } else {
                var j = JSON.parse('{"name":"' + username + '","password":"' + pwd + '"}');
                $.ajax({
                    url: "http://localhost:3000/users",
                    type: "GET",
                    dataType: "json",
                    data: j,
                    success: function(result) {
                        console.log(result.length);
                        if (result.length === 0) {
                            alert("login failed");
                        } else {
                            alert("login Successful");

                            //tempObject to store initial get request value, in order to parse it later, then store in in user object.
                            var tempObject = result[0];
                            user.id = tempObject.id;
                            user.userName = tempObject.name;
                            like = JSON.parse(tempObject.likes);
                            notLike = JSON.parse(tempObject.notLikes);
                            console.log(like);
                            console.log(notLike);
                            sessionStorage.setItem('id', user.id);
                            sessionStorage.setItem('user', username);
                            sessionStorage.setItem('password', pwd);
                            sessionStorage.setItem('like', like);
                            sessionStorage.setItem('notLike', notLike);

                            function showUserHistory() {
                                //reflect the data from reddit.json file, into the html page:
                                like.forEach(function(element) {
                                    $("#" + element + ".voteUpButton").hide();
                                    $("#" + element + ".voteUpButtonDisabled").show();
                                });
                                notLike.forEach(function(element) {
                                    $("#" + element + ".voteDownButton").hide();
                                    $("#" + element + ".voteDownButtonDisabled").show();
                                });
                            }
                            showUserHistory();
                        }
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            }

        });

        $("#Register").on("click", function() {
            var username = document.getElementById("reguser").value;
            var pass = document.getElementById("regpass").value;
            var confirm = document.getElementById("confirmpass").value;
            if (username === "" || pass === "" || confirm === "") {
                alert("please enter the values !!!!");
            } else if (pass !== confirm) {
                alert("password not matching");
            } else {
                var j = JSON.parse('{"name":"' + username + '","password":"' + pass + '"}');
                $.ajax({
                    type: "POST",
                    data: j,
                    url: "http://localhost:3000/users",
                    dataType: "json",
                    success: function() {
                        alert("Registered successfully");
                        document.getElementById("reguser").value = "";
                        document.getElementById("regpass").value = "";
                        document.getElementById("confirmpass").value = "";
                    },
                    failure: function(errMsg) {
                        alert(errMsg);
                    }
                });
            }
        });
    } /// end of login function

    function logout() {
        $("#logout").on("click", function() {
            //clearing user data befor loging out & refreshing the page.
            username = "";
            user.id = 0;
            user.userName = "";
            like = [];
            notLike = [];
            sessionStorage.clear();
            location.reload(true);
            console.log("logged out!\n");
        });
    } //end of logout function

    //Start- hovering action on posts
    $("div").on("mouseover", "div.postContent", function() {
        $(this).addClass("z-depth-2");
    });

    $("div").on("mouseleave", "div.postContent", function() {
        $(this).removeClass("z-depth-2");
    });
    //End- hovering action on posts

    //Start- thumb up/down hovering
    $("div").on("mouseover", "i.material-icons.thumbup ", function() {
        $(this).css("color", "black");
    });
    $("div").on("mouseleave", "i.material-icons.thumbup", function() {
        $(this).css("color", "darkgrey");
    });
    $("div").on("mouseover", "i.material-icons.thumbdown ", function() {
        $(this).css("color", "black");
    });
    $("div").on("mouseleave", "i.material-icons.thumbdown", function() {
        $(this).css("color", "darkgrey");
    });

    function search() {
        $("#search").keyup(function() {

            // Retrieve the input field text and reset the count to zero
            var filter = $(this).val(),
                count = 0;

            // Loop through the comment list
            $(".postContent").each(function() {

                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).fadeOut();

                    // Show the list item if the phrase matches and increase the count by 1
                } else {

                    $(this).show();
                    count++;
                }


            });
            if (filter === "") {
                $('.postsContainer').empty();
                myfunction();
            }
        });

    } //end of search function

    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    } //end of function timesince

    //Start- for postform validation

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    $("#postform").validate({
        rules: {
            field: {
                required: true,
                url: true
            }
        }
    }); // end of jquery validator

    $("a.postnews").on("click", function() {
        var form = $("#postform");
        form.validate(); //End- post form validation
        //Start- JQuery code for post fields
        $("#postbutton").click(function(element) {

            var check = $("#checkbox").is(':checked');
            if (check === true) {
                if ($("#input1").val() === "" || $("#input2").val() === "" || $("#input3").val() === "") {
                    element.preventDefault();
                    setTimeout(fade_out, 5000);
                    $("#spanbutton").css({
                        "visibility": "visible",
                        "display": "inline"
                    }).text("Enter input");

                    function fade_out() {
                        $("#spanbutton").fadeOut().empty();
                    }
                }
                /*else if ($("#input1").val() !== "" || $("#input2").val() !== "" || $("#input3").val() !== "") {

                                   jsondata.forEach(function(reddit1) {
                                       if ((reddit1.link_title === $("#input1").val())) {
                                           alert(JSON.stringify(reddit1.main_link)+"\\\\   "+$("#input2").val() );
                                           console.log(reddit1.main_link);
                                           element.preventDefault();
                                           setTimeout(fade_out2, 5000);
                                           $("#spanbutton").css({
                                       "visibility": "visible",
                                       "display": "inline"
                                       }).text("Post Title already exists in the site");

                                           function fade_out2() {
                                       $("#spanbutton").fadeOut().empty();
                                       $("#postform")[0].reset();
                                           }
                                       }
                                       else if(JSON.stringify(reddit1.main_link) === $("#input2").val()){
                                           alert("in second if");
                                           element.preventDefault();
                                           setTimeout(fade_out4, 5000);
                                           $("#spanbutton").css({
                                       "visibility": "visible",
                                       "display": "inline"
                                   }).text("URL already exists in the site");
                                           
                                           function fade_out4() {
                                       $("#spanbutton").fadeOut().empty();
                                       $("#postform")[0].reset();
                                           }
                                       }
                                       else if($("#input3").val()!=="undefined"){
                                           if(JSON.stringify(reddit1.image_link) === $("#input3").val()){
                                           alert($("#input3").val());
                                           element.preventDefault();
                                           setTimeout(fade_out3, 5000);
                                           $("#spanbutton").css({
                                       "visibility": "visible",
                                       "display": "inline"
                                   }).text("Image/Video URL already exists in the site");
                                           function fade_out3() {
                                       $("#spanbutton").fadeOut().empty();
                                       $("#postform")[0].reset();
                                           }
                                       }
                                       }

                                   });
                                  
                             } */
                else {
                    if (form.valid() === true) {
                        alert("in form valid");
                        var date = new Date();
                        $("#spanbutton").css({
                            "visibility": "visible"
                        }).text("");
                        if ($("#input3").val() === "undefined") {
                            $.post("http://localhost:3000/reddit", {
                                "link_title": $("#input1").val(),
                                "main_link": $("#input2").val(),
                                "image_link": "image/herald.jpg",
                                "likes": 0,
                                "post_time": date
                            }, function() {
                                myfunction();

                            });
                        } else {
                            $.post("http://localhost:3000/reddit", {
                                "link_title": $("#input1").val(),
                                "main_link": $("#input2").val(),
                                "image_link": $("#input3").val(),
                                "likes": 0,
                                "post_time": date
                            }, function() {
                                myfunction();

                            });
                        }
                    }
                }
            } else {
                element.preventDefault();
                setTimeout(fade_out1, 5000);

                function fade_out1() {
                    $("#spanbutton").fadeOut().empty();
                }
                $("#spanbutton").css({
                    "visibility": "visible",
                    "display": "inline"
                }).text("Log in to post");
            }
        });
    }); // end of post news function
    $("div.addimage").on("click", function() {
        $("div.addimage").replaceWith("<div id='imageinput'><label id='imageurl' for='input3'>Enter image URL...</label><input class='input-field validate tooltipped' data-position='right' data-delay='50' data-tooltip='We only accept video urls from Youtube/Vimeo/imgur.com' name='input3' type='url' id='input3'></div>");
    });

    function pages(totalnumofitems) {
        var numofitems_page = 5,
            numofpages = Math.ceil(totalnumofitems / numofitems_page),
            pagenumbers;
        $("ul.pagination").empty();
        for (var i = 1; i <= numofpages; i++) {
            pagenumbers = "<li class='waves-effect'>" + i + "</li>";
            $(pagenumbers).appendTo("ul.pagination");
        }
        $("div.postsContainer").children().hide();
        $("div.postsContainer div:nth-child(-n+5)").slice(0).show();
        $("ul.pagination").on("click", "li", function() {
            var page = $(this).text(),
                x = page * 5,
                y = (page - 1) * 5;
            $("li").removeClass("pages");
            $(this).addClass("pages");
            $("div.postsContainer").children().hide();
            $("div.postsContainer div.postContent").slice(y, x).show();
        });
    }
    //End of Pagination

    search();
    login();
    logout();
    myfunction();
}; //end of main function

$(document).ready(main);