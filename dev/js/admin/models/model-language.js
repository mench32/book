//Model.Article
define([
    "jquery",
    "admin/models/model"
], function(
    $,
    Model
) {

    return Model.extend({

        idAttribute: '_id',

        urlRoot: 'api/languages',

        defaults: {
            title: "",
            name: ""
        }

    });

});







