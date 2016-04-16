var express = require('express');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var  app = express();
var  bodyParser = require("body-parser");
var url = require('url');
mongoose.connect('mongodb://localhost/links');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var linkSchema = mongoose.Schema({

    title : String,
    link : String,
    clicks : Number

});
var Links = mongoose.model('Links',linkSchema);

app.post("/links", function (req, res) {
    console.log(req.body);
    var newLinks = Links({"title":req.body.title,
        "link":req.body.link,
        "clicks":0});

    newLinks.save(function (error, result) {
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
        res.redirect(result.link)
    });


});

app.listen(3000, function () {
    console.log("listening on port 3000");
});
