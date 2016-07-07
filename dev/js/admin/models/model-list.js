//Model.List
define([
    "jquery",
    "admin/models/model"
], function(
    $,
    Model
) {

    return Model.extend({

        defaults: {
            limit: 10,
            offset: 0,
            data: undefined
        },

        parse: function(response) {
            if ( response.data ) {
                this.attributes.data.reset(response.data);
                response.data = this.attributes.data;
            }

            return response;
        }

    });

});







