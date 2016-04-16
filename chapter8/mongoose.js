// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
"use strict";
var express = require("express");
var mongoose = require("mongoose");
var  app = express();
var  bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost/links");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var linkSchema = mongoose.Schema({

    title : String,
    link : String,
    clicks : Number

});
var Links = mongoose.model("Links",linkSchema);

app.post("/links", function (req, res) {

    console.log(req.body);
    var newLinks = new Links({"title":req.body.title,
        "link":req.body.link,
        "clicks":0});

    newLinks.save(function (error) {
        if (error !== null) {
            console.log(error);
            res.send("ERROR");
        } else {
            Links.find({}, function (err, result) {
                if (err !== null) {
                    // the element did not get saved!
                    res.send("ERROR");
                }
                res.json(result);
            });
        }

    });
});

app.get("/links", function (req, res) {

    Links.find({}, function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        }
        res.json(result);
    });
});

app.get("/click/:title", function (req, res) {


    console.log(req.params.title);

    Links.findOneAndUpdate({"title" : req.params.title},{ $inc : { "clicks" : 1 }}, function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        }
        console.log(result);
        res.redirect(result.link);
    });


});

app.listen(3000, function () {
    console.log("listening on port 3000");
});
