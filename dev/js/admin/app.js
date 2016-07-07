var app = {};
app.model = {};
app.view = {};


requirejs.config({
    baseUrl: "/js",
    paths: {
        jquery: "vendor/jquery/dist/jquery",
        underscore: "vendor/underscore/underscore",
        backbone: "vendor/backbone/backbone",
        jade: "vendor/jade/runtime",
        moment: "vendor/momentjs/moment",
        backgrid: 'vendor/backgrid/lib/backgrid',
        utils: "utils"
    }
    // ,
    // shim: {}

});
require([
        "backbone",
        "admin/router"
    ],
    function(
        Backbone,
        Router
    ){
        console.log('admin');
        app.pageView = {};
        app.router = new Router();
        Backbone.history.start();

    });