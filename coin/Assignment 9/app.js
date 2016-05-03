function AppViewModel() {
    "use strict";
    var self=this;

    self.tagline=ko.observable("Comments");
    self.commentlist=ko.observableArray([
        {comments: "This is the first comment!"},
        {comments: "Here's the second one!"},
        {comments: "And this is one more."},
        {comments: "Here is another one!"},
        ]);

    self.comment=ko.observable("comment");
    self.addComment=function(){
        self.commentlist.push({comments:self.comment()});
    }
};

ko.applyBindings(new AppViewModel());

