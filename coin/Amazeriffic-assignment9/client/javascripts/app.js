/*globals ko*/
/*globals $*/

var Tabname = function (name, selected) {
    this.name = name;
    this.ifActive = ko.computed(function () {
        return this === selected();
    }, this);
};
function ToDoObj(data) {
    this.description = ko.observable(data.description);
    this.tags = ko.observableArray(data.tags);
}

function AppViewModel() {
    var self = this;

    self.activeTab = ko.observable();

    self.tabs = ko.observableArray([
        new Tabname('new', self.activeTab),
        new Tabname('old', self.activeTab),
        new Tabname('tag', self.activeTab),
        new Tabname('add', self.activeTab)
    ]);
    
    self.activeTab(self.tabs()[0]);

    self.todos = ko.observableArray([]);
    self.new_description = ko.observable("");
    self.new_tags = ko.observable("");
    self.todoTags = ko.observable([]);

    function TagData() {
        var tags = [];

        self.todos().forEach(function (toDo) {
            toDo.tags().forEach(function (tag) {
                if (tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });
        });

        var tagObjects = tags.map(function (tag) {
            var toDosWithTag = [];

            self.todos().forEach(function (toDo) {
                if (toDo.tags.indexOf(tag) !== -1) {
                    toDosWithTag.push(toDo.description);
                }
            });

            return { "name": tag, "toDos": toDosWithTag };
        });
        self.todoTags(tagObjects);
    }

    $.getJSON("/todos.json", function (data) {
        var Todos = $.map(data, function (item) { return new ToDoObj(item); });
        self.todos(Todos);
        TagData();
    });

    self.addItem = function () {
        var description = self.new_description,
            tags = self.new_tags,
            multiple_tags = tags().split(','),
            newToDo = { "description": description, "tags": multiple_tags };

        if (description() !== "" && tags() !== "") {
            $.post("/todos", newToDo, function (data) {
                var Todos = $.map(data, function (item) { return new ToDoObj(item); });
                self.todos(Todos);
                TagData();
            });
        }
        self.new_description("");
        self.new_tags("");
    };
}

ko.applyBindings(new AppViewModel());

