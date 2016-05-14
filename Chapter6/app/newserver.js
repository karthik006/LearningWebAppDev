var express=require("express"),
http=require("http"),
app=express();

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

app.listen(3000, function () {
    console.log('listening on port 3000');
});

