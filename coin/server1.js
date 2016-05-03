var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var w, l;


var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    client.EXISTS('loss', function(err, reply) {
        if (reply === 1) {} else {
            client.set('loss', '0', function(err, reply) {
                console.log(reply);
            });

            client.set('win', '0', function(err, reply) {
                console.log(reply);
            });
        }

    });

    app.use(express.static('.'));
    app.get('/', function(req, res) {
        res.sendFile(__dirname + "/" + "input1.html");
    });

    app.get('/stats', function(req, res) {

        client.get('win', function(err, reply) {
            console.log("win " + reply);
            l = reply;

            client.get('loss', function(err, reply) {
                console.log("loss " + reply);
                w = reply;

                res.send(JSON.stringify({
                    "wins": w,
                    "losses": l
                }));
            });
        });
    });

    app.use(bodyParser.json());

    app.post('/Flip', function(request, response) {


        var x = (Math.random() * 1) + 0;
        console.log(x);
        if (x >= 0.5) {
            if ((request.body.call == "heads")) {
                console.log("win head");
                response.send(JSON.stringify({
                    "result": "win"
                }));


                client.incr('win', function(err, reply) {
                    console.log("win " + reply);
                });

            } else {
                console.log("loss head");
                response.send(JSON.stringify({
                    "result": "loss"
                }));


                client.incr('loss', function(err, reply) {
                    console.log("loss " + reply);
                });
            }
        } else {
            if ((request.body.call == "tails")) {
                response.send(JSON.stringify({
                    "result": "win"
                }));
                console.log(" win tail");


                client.incr('win', function(err, reply) {
                    console.log("win " + reply);
                });
            } else {
                console.log("loss tail");
                response.send(JSON.stringify({
                    "result": "loss"
                }));


                client.incr('loss', function(err, reply) {
                    console.log("loss " + reply);
                });
            }
        }

    });

    app.post('/Del', function(request, response) {
        console.log(request.body.reset);
        client.set('loss', '0', function(err, reply) {

            console.log("reset");
        });

        client.set('win', '0', function(err, reply) {


        });

    });

});


app.listen(3000);