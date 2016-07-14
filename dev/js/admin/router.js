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
            console.log('req');
            app.pageView = new Controller({
                template: name,
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
    require(["controllers/" + controller, "models/" + model], function (Controller, Model) {
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
            'languages(/)':     'languages',
            'words(/)':         'words',
            '*path':            'home'


        },
        home: function() {
            console.log('home');
            createList('controller', 'model-list-languages', 'languages');
        },

        languages: function() {
            console.log('lang');
            createList('controller-list', 'model-list-languages', 'languages');
        },
        words: function() {
            console.log('word');
            createList('controller-list', 'model-list-words', 'words');
        }

    }); 
});