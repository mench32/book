var express =       require('express');
var Promise =       require('promise');
var bodyParser =    require('body-parser');
var livereload =    require('connect-livereload');
var config =        require('./config');
var controllers = {};
controllers.languages = require('./controllers/languages');


var rest = express();

rest.use(livereload());
rest.use(express.static('./public'));
rest.use(bodyParser.json());
rest.use(bodyParser.urlencoded({ extended: true }));

rest.get('/api/languages',controllers.languages.get);
rest.get('/api/languages/:id',controllers.languages.getById);
rest.put('/api/languages/:id',controllers.languages.put);
// for (var key in controllers) {
//     if (!controllers.hasOwnProperty(key)) continue;
//     if (controllers[key].post)      { rest.post(  '/api/' + key,          controllers[key].post); }
//     if (controllers[key].get)       { rest.get(   '/api/' + key,          controllers[key].get); }
//     if (controllers[key].getById)   { rest.get(   '/api/' + key + '/:id', controllers[key].getById); }
//     if (controllers[key].put)       { rest.put(   '/api/' + key + '/:id', controllers[key].put); }
//     if (controllers[key].delete)    { rest.delete('/api/' + key + '/:id', controllers[key].delete); }
// }




rest.listen(config.get('port'), function () {
    var host = this.address().address;
    var port = this.address().port;

    console.log('app listening at http://%s:%s', host, config.get('port'));
});