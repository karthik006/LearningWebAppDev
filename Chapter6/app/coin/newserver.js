var express = require("express"),
    http = require("http"),
    app = express(),
    bodyParser = require('body-parser');
wins = 0;
losses = 0;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.post("/flip", function (req, res) {

    var selection = req.body.call;
    console.log(selection);
    console.log("I choose " + selection);


    var result = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails'; 
    console.log("Randomly generated: " + result);


    if (result === selection) {
        wins = wins + 1;
		console.log("wins:" + wins);
        console.log("losses:" + losses);
		res.send(JSON.stringify({
        "result": "win"
    }));

    } else {
        losses = losses + 1;
        console.log("wins:" + wins);
        console.log("losses:" + losses);
     res.send(JSON.stringify({
        "result": "lost"
    }));
    }

});

app.get("/stats", function (req, res) {
    res.send(JSON.stringify({
        "wins": wins,
        "losses": losses
    }));
});
app.listen(3000, function () {
    console.log('listening on port 3000');
});
