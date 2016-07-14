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

        urlRoot: 'api/words',

        defaults: {
            name: "",
            language: undefined
        }

    });

});







