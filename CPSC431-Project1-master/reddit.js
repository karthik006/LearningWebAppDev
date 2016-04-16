var main = function() {
   "use strict";
    var user= { id:0 ,userName:"", likes:[{}], notLikes:[{}] },//object tracks the user activity, and used to store the user data in the json file.
    username, pwd, like=[], notLike=[];// like, notLike are lists to capture user data while the program is running, and store it in the user object later.
    function myfunction() {
        //Initial page loading:
        $.get("http://localhost:3000/reddit", function(getData) {
            getData.forEach(function(reddit) {
                var imgId = reddit.id;
                var postsList = "<div class ='postContent'>" + "<div class = 'votes'>" + "<img  id=" + imgId + " class='voteUpButton' src='image/up.png'>" + "<img  id=" + imgId + " class='voteUpButtonDisabled' src='image/upDisabled.png' style='opacity:0.4; display: none;'>" + "<br>" + "<strong id =" + reddit.id + " class='votesNum'>" + reddit.likes + "</strong>" + "<br>" + "<img  id=" + imgId + " class='voteDownButton' src='image/down.png'>" + "<img  id=" + imgId + " class='voteDownButtonDisabled' src='image/downDisabled.png' style='opacity:0.4; display: none;'>" + "</div>" + "<div class ='Content-List'>" + "<p>" + "<a href=" + JSON.stringify(reddit.main_link) + ">" + reddit.link_title + "</a>" + "</p>" + "</div>";
                $(postsList).appendTo('div.postsContainer');
            }); //end of ForEach loop


            //Vote up event:
            $("img.voteUpButton").on("click", function() {
              var $imgId = this.id,
                  main_link, link_title, image_link, result = $("#" + this.id + ".votesNum").text();
              if (username) { // check if the user loged in before letting user to change the Likes status.

                  //if the like button and not like button, both are off:
                  if (! like.includes(this.id) && ! notLike.includes(this.id)){
                    like.push(this.id); // push the post Id to the like list.

                    //hide the like button and show the blurrd like button:
                    $("#"+this.id+".voteUpButton").hide();
                    $("#"+this.id+".voteUpButtonDisabled").show();
                    result++; // result is the number of likes after increasing or decreasing
                  }
                  else if(user.likes.includes(this.id)){
                    return;
                  }
                  //if the post is already not liked before:
                  else if(notLike.includes(this.id)){
                    notLike.splice(notLike.indexOf(this.id),1); //take the id from not like list.
                    like.push(this.id);//push the id to the like list.
                    $("#"+this.id+".voteUpButton").hide();
                    $("#"+this.id+".voteUpButtonDisabled").show();
                    $("#"+this.id+".voteDownButton").show();
                    $("#"+this.id+".voteDownButtonDisabled").hide();
                    result++;
                    result++;
                  }

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
               }
               else {//check if not loged in, then it want let the user to do likes or not likes.
                    alert("OOPs! Sorry, you need to log-in first..");
                }
            });//end of like up event.


            //Vote down event:
            $("img.voteDownButton").on("click", function() {
                var $imgId = this.id,
                    main_link, link_title, image_link, result = $("#" + this.id + ".votesNum").text();
                if (username) { // check if the user loged in before letting user to change the Likes status.
                  if (! notLike.includes(this.id) && ! like.includes(this.id)){
                    notLike.push(this.id);
                    $("#"+this.id+".voteDownButton").hide();
                    $("#"+this.id+".voteDownButtonDisabled").show();
                    result--; // result is the number of likes after increasing or decreasing
                  }
                  else if(user.notLikes.includes(this.id)){
                    return;
                  }
                  else if(like.includes(this.id)){
                    like.splice(like.indexOf(this.id),1);
                    notLike.push(this.id);
                    $("#"+this.id+".voteDownButton").hide();
                    $("#"+this.id+".voteDownButtonDisabled").show();
                    $("#"+this.id+".voteUpButton").show();
                    $("#"+this.id+".voteUpButtonDisabled").hide();
                    result--;
                    result--;
                  }
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
            });//end of like down event.

        }); //end of $.get function
    }


    function login() {
        $("#login").on("click", function() {
            //initilaizing user object to zero.
            user.id=0;
            user.userName="";
            user.likes=[{}];
            user.notLikes=[{}];

            username = document.getElementById("username").value;
            pwd = document.getElementById("password").value;
            console.log(username);
            if (username === "") {
                alert("please enter your username");
            } else if (pwd === "") {
                alert("please enter your password");
            } else {
                var j = JSON.parse('{"name":"' + username + '","password":"' + pwd + '"}');
                $.ajax({
                    url: "http://localhost:3000/users/",
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
                           user.id= tempObject.id;
                           user.userName=tempObject.name;
                           user.likes=JSON.parse(tempObject.likes);
                           user.notLikes=JSON.parse(tempObject.notLikes);
						   console.log(user.likes);

                        //Re-empty the (likes & notLikes) in the reddit.json file to prevent duplicates.
                        //So each time you log-in, (likes & notLikes) in the json file thier valuse are taken, then they get emptied,
                        //in order to prevent duplicated writing when you log out.
                           $.ajax({
                               type: "PUT",
                               url: "http://localhost:3000/users/"+ user.id,
                               data: {
                                   "id":user.id,
                                   "name":user.userName,
                                   "password":pwd,
                                   "likes":"[{}]",
                                   "notLikes":"[{}]"
                               }
                           });
                            //incorporate the like array with the values from the user object:
                             user.likes.forEach(function(element){
                                   if(element.postId){
                                    like.push(element.postId);
                                  }
                             });
                             //incorporate the notLike array with the values from the user object:
                              user.notLikes.forEach(function(element){
                                    if(element.postId){
                                     notLike.push(element.postId);
                                   }
                              });

                               //reflect the data from reddit.json file, into the html page:
                               like.forEach(function(element){
                                 $("#"+element+".voteUpButton").hide();
                                 $("#"+element+".voteUpButtonDisabled").show();
                               });
                               notLike.forEach(function(element){
                                 $("#"+element+".voteDownButton").hide();
                                 $("#"+element+".voteDownButtonDisabled").show();
                               });

                              //clear the likes and not likes in the user object after log in.
                              //to prevent duplicates in the user object.
                              user.likes=[{}];
                              user.notLikes=[{}];
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
    }


  //witten by Dean, for the sake of letting other stuff work(not a full logout functionality):
    $("#logout").on("click", function(){
      //if like and notLike arrays have data, then store these data in the user object.
       if (like.length > 0){
           like.forEach(function(element){
                var obj={postId:element};//transform the post ID from the like array, into a temporary object.
                user.likes.push(obj);//store that temp object in user.likes, cuz it is an array of objects.
           });
       }
       if (notLike.length > 0){
           notLike.forEach(function(element){
               var obj={postId:element};
               user.notLikes.push(obj);
           });
       }

      //I needed to stringify the likes and notlikes arrays to be able to store them in the json file.
       var dt1= JSON.stringify(user.likes);
       var dt2 = JSON.stringify(user.notLikes);
       $.ajax({
          type: "PUT",
          url: "http://localhost:3000/users/"+user.id,
          data: {
              "id":user.id,
              "name":user.userName,
              "password":pwd,
              "likes":dt1,
              "notLikes":dt2
          }
      });
      //clearing user data befor loging out.
      username="";
      user.id=0;
      user.userName="";
      user.likes=[{}];
      user.notLikes=[{}];
      console.log("logged out!\n");
      location.reload(true);
    });


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
    });
    var form = $("#postform");
    form.validate(); //End- post form validation
    //Start- JQuery code for post fields
    $("#postbutton").click(function(element) {
        var check = $("#checkbox").is(':checked');
        if (check === true) {
            if ($("#input1").val() === "" || $("#input2").val() == "" || $("#input3").val() == "") {
                element.preventDefault();
                setTimeout(fade_out, 5000);
                $("#spanbutton").css({
                    "visibility": "visible",
                    "display": "inline"
                }).text("Enter input");

                function fade_out() {
                    $("#spanbutton").fadeOut().empty();
                }
            } else {
                if (form.valid() === true) {

                    $("#spanbutton").css({
                        "visibility": "visible"
                    }).text("");
                    $.post("http://localhost:3000/reddit", {
                        "link_title": $("#input1").val(),
                        "main_link": $("#input2").val(),
                        "image_link": $("#input3").val(),
                        "likes": 0,
                        "post": "submitted"
                    }, function() {
                        myfunction();

                    });

                }

            }
        } else {
            element.preventDefault();
            setTimeout(fade_out, 5000);

            function fade_out() {
                $("#spanbutton").fadeOut().empty();
            }
            $("#spanbutton").css({
                "visibility": "visible",
                "display": "inline"
            }).text("Log in to post");
        }
    });

    myfunction();
    login();
};

$(document).ready(main);
