define([
    "jquery",
    "jqueryui",
    "underscore",
    "backbone"
], function(
    $,
    jqueryui,
    _,
    Backbone
) {

    return Backbone.View.extend({
        initialize: function(params) {
            this.$el.attr('data-field', params.field);
            this.model.fetch().then(function(model) {
                var data = model.data.map(function(item) {
                    return {
                        label: item.get('title'),
                        value: item.id
                    }
                });
                this.$el.autocomplete({
                    minLength: 0,
                    source: data,
                    focus: function (event, ui) {
                        // console.log('ui', ui);
                        // return false;
                    }.bind(this)
                })
            }.bind(this));
        }
    });

});