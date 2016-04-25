// Client-side code
/* jshint browser: true, jquery: true,curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true,eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);
var io = require("socket.io").listen(http);
var mongoose = require("mongoose");

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// connect to the amazeriffic data store in mongo
mongoose.connect("mongodb://localhost/assignment8");

// This is our mongoose model for todos
var ToDoSchema = mongoose.Schema({
    description: String,
    tags: [ String ]
});

var ToDo = mongoose.model("ToDo", ToDoSchema);

app.get("/todos.json", function (req, res) {
    ToDo.find({}, function (err, toDos) {
	res.json(toDos);
    });
});

app.get("/", function(req, res){
  res.sendFile("/index.html");
});

io.on("connection", function(socket){
  socket.on("todoItem", function(data){
	
    io.emit("todoItem", data);
  });
});

app.post("/todos", function (req, res) {
    console.log(req.body);
    var newToDo = new ToDo({"description":req.body.description, "tags":req.body.tags});
    newToDo.save(function (err, result) {
	if (err !== null) {
	    // the element did not get saved!
	    console.log(err);
	    res.send("ERROR");
	} else {
	    // our client expects *all* of the todo items to be returned, so we'll do
	    // an additional request to maintain compatibility
	    ToDo.find({}, function (err, result) {
		if (err !== null) {
		    // the element did not get saved!
		    res.send("ERROR");
		}
		res.json(result);
	    });
	}
    });
});

http.listen(3000, function(){
  console.log("listening on *:3000");
});