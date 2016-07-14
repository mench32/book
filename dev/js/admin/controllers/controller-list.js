define([
    "jquery",
    "underscore",
    "backbone",
    "admin/controllers/controller"

], function(
    $,
    _,
    Backbone,
    Controller
) {

    return Controller.extend({
        events: {
            'click .js-add': 'onAdd',
            'click .js-remove': 'onRemove'
        },

        onLoadHandler: function() {
            this.listenTo(this.model, 'change', function(model) {
                this.render();
            }.bind(this));
            this.listenTo(this.model.get('data'), 'change destroy', function(data) {
                this.render();
            });

            this.model.fetch();
        },

        onAdd: function(event) {
            // debugger;
            var collection = this.model.get('data');
            var fields = {};
            this.$('.js-field').each(function(event) {
                var $element = $(this);
                var key = $element.attr('data-field');
                fields[key] = $element.val();
            });
            var model = collection.add(fields);
            model.save()
        },

        onRenderHandler: function() {
            this.$('.js-field-complete').each(function(event) {
                var $element = $(this);
                var modelPath = 'admin/models/' + $element.attr('data-model');
                require([modelPath, 'admin/controllers/controller-complete'], function(Model, Controller) {
                    $element.html(
                        new Controller({
                            tagName: 'input',
                            model: new Model(),
                            className: 'js-field',
                            field: $element.attr('data-field')
                        }).$el
                    )
                })

            })

        },
        onRemove: function(event) {
            var $element = $(event.target);
            var collection = this.model.get('data');
            id = $element.attr('data-id');
            model = collection.get(id);
            model.destroy();
        }



    });

});