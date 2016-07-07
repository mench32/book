//Router
define([
    "jquery",
    "backbone"
], function(
    $,
    Backbone
) {
function createList(controller, model, name) {
    if (app.pageView && app.pageView.name == name) {
        app.pageView.fetched();
    } else {
        if (app.pageView.close) app.pageView.close();
        require(["admin/controllers/" + controller, "admin/models/" + model], function (Controller, Model) {
            app.pageView = new Controller({
                template: "home",
                model: new Model(),
                className: 'list list--' + name,
                name: name
            });
            // app.pageView.render();
            $('#content').html(app.pageView.$el);

        });
    }
}

function createForm(controller, model, id, name) {

    if (app.pageView.close) app.pageView.close();
    require(["controller/" + controller, "model/" + model], function (Controller, Model) {
        app.pageView = new Controller({
            template: 'form',
            model: new Model(name == 'user' ? {login: id} : {guid: id}),
            name: name
        });

        $('#content').html(app.pageView.$el);
    });

}
    return Backbone.Router.extend({

        routes: {

            'home(/)':          'home',
            'language(/)':      'language',
            '*path':            'home'


        },
        home: function() {
            console.log('home');
            createList('controller', 'model-list-languages', 'languages');
        },

        language: function() {

            require(["backgrid", "admin/models/model-list-languages"], function (Backgrid, Model) {

                var columns = [
                    {
                        name: "_id",
                        label: "ID",
                        editable: false,
                        cell: "string"
                    },
                    {
                        name: "title",
                        label: "Title",
                        cell: "string"
                    },
                    {
                        name: "remove",
                        label: "",
                        editable: false,
                        cell: Backgrid.Cell.extend({
                            render: function () {
                                this.$el.html('<div class="cell--remove">x</div>');
                                return this;
                            }
                        })
                    }
                ];

                var model = new Model();
                var collection = model.get('data');
                collection.on('change', function(model) {
                    model.save();
                });
                var grid = new Backgrid.Grid({
                    columns: columns,
                    collection: collection
                });


                model.fetch({reset: true}).then(function() {
                    $("#content").html(grid.render().el);
                });

            });
        }
    }); 
});