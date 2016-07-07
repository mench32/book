define([
    "jquery",
    "underscore",
    "backbone",
    "utils"
], function(
    $,
    _,
    Backbone,
    U
) {

    return Backbone.View.extend({

        //Кешированные шаблоны
        _templates: {},

        templatePath: "views/",

        //Основной шаблон, можно указать в момент создания шаблона или задать при наследовании
        template: undefined,

        //Загрузчик шаблонов
        loadTemplate: function( path, callback ) {
            return new Promise(function( resolve ) {
                if (this._templates[path]) {
                    if ( U.isFunction(callback) ) callback(this._templates[path]);
                    resolve(this._templates[path]);
                    this.trigger("load", this);
                    return;
                }

                require([this.templatePath + path], function (template) {
                    this._templates[path] = template;
                    if ( U.isFunction(callback) ) callback(this._templates[path]);
                    resolve(this._templates[path]);
                    this.trigger("load", this);
                }.bind(this));
            }.bind(this))
        },

        //Метод открисовки шаблона
        render: function (data) {
            var html;
            if (!data) {
                if (this.model) {
                    data = this.model.attributes;
                } else {
                    data = {};
                }
            }

            if ( this._templates[this.template] ) {
                html = this._templates[this.template](data);
            } else {
                return this;
            }

            this.$el.html(html);
            this.trigger("render", this.$el);
            return this;
        },

        //Обработчик метода загрузки шаблона
        onLoadHandler: function(data) {
            console.log('onLoadHandler', data.name)
        },

        //Обработчик метода отрисовки шаблона
        onRenderHandler: function(data) {
            console.log('onRenderHandler', data)
        },

        //Метода удаления контроллера со всеми вложенными контроллерами
        close: function() {
            console.log("close", this.name)
            this.trigger("close", this);
            this.remove();
            this.unbind();
            _.each(this.childViews, function(view) {
                if (view.close) {
                    view.close();
                }
            }.bind(this));
        },

        //Инит вызывается перед методом initialize, для удобстванаследования
        init: function(params) {
            console.log('init', params);
        },

        //Стандартый метод инициализации
        initialize: function(params) {
            //Список вложенных контроллеров.
            //При добавлении вложенного контроллера необходимо выполнить this.childViews.push(CONTROLLER)
            this.childViews = [];


                this.name = params.name;
            this.init(params);
            if ( params && params.template ) {
                this.template = params.template
            }

            this.on("load", this.onLoadHandler.bind(this));
            this.on("render", this.onRenderHandler.bind(this));
            this
                .loadTemplate(this.template)
                .then(this.render.bind(this));
            return this;
        }
    });

});