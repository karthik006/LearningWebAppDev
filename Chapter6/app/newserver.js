<<<<<<< HEAD
var express=require("express"),
    http=require("http"),app=express();

app.locals.wins=0;
app.locals.losses=0;

app.use(express.static(__dirname+"/client"));
app.use(express.urlencoded());
app.post("/flip",function(req,res){

    var newcoin=req.body;
    console.log(newcoin);
    var low= 0,high=1;
    var coincomp=function coinFlip() {
        return (Math.floor(Math.random() * 2) == 0) ? 'head_s' : 'tail_s';
    }

    var result="";
    if(coincomp==newcoin.call){
        wins=wins+1;
        result={ "result": "win" };
    }
    else{
        losses=losses+1;
        result={ "result": "loss" };
    }
    res.json(result);

});


app.get("/stats",function(req,res){
    var statsjson={
        "wins": app.wins,
        "losses":app.losses
    }
    res.json(statsjson);


});

http.createServer(app).listen(3000);
=======
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
>>>>>>> b1a8cc41274a7a73ee39d05e7231cc08845fdbe8
