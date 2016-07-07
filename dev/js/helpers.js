define([
    "jquery",
    "utils"
], function(
    $,
    U
){
    'use strict';

    return {

        parseDateTime: U.parseDateTime,

        parseDate: U.parseDate,

        digitFormat: U.digitFormat,

        parseDate2: function(dateInt) {

            var date = dateInt ? new Date(parseInt(dateInt)) : new Date();
            return date.toISOString().substring(0, 10);
        },

        getField: function(model, name) {
            return app.model.fields.get("data").findWhere({
                name: name,
                model: model
            }).attributes;
        },

        objectToClass: function(object) {
            return object.replace(/\./g, '-').toLowerCase();
        }
    }

});


