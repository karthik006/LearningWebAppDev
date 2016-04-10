var express = require("express"),
redis = require("redis")
    http = require("http"),
    app = express(),
    bodyParser = require('body-parser');

redisClient = redis.createClient();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


redisClient.mget(["wins", "losses"], function (err, results) {
    // check to make sure there's no error
    if (err !== null) {
        console.log("ERROR: " + err);

        // exit the function
        return;
    }
wins = parseInt(results[0], 10) || 0;
losses = parseInt(results[1], 10) || 0;

app.post("/flip", function (req, res) {

    var selection = req.body.call;
    console.log(selection);
    console.log("I choose " + selection);


    var result = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails'; 
    console.log("Randomly generated: " + result);


    if (result === selection) {
        wins = wins + 1;
		redisClient.incr("wins");
		console.log("wins:" + wins);
        console.log("losses:" + losses);
		res.send(JSON.stringify({
        "result": "win"
    }));

    } else {
        losses = losses + 1;
		redisClient.incr("losses");
        console.log("wins:" + wins);
        console.log("losses:" + losses);
     res.send(JSON.stringify({
        "result": "lost"
    }));
    }
});
});
app.get("/stats", function (req, res) {
    res.send(JSON.stringify({
        "wins": wins,
        "losses": losses
    }));
	
app.delete("/stats",function(req,res){
	redisClient.set("wins", 0);
	redisClient.set("losses", 0);
	wins = 0;
	losses = 0;
	res.send(JSON.stringify({
        "wins": 0,
        "losses": 0
    }));
	
});
});
app.listen(3000, function () {
    console.log('listening on port 3000');
});
