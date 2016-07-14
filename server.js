var express =       require('express');
var Promise =       require('promise');
var bodyParser =    require('body-parser');
var livereload =    require('connect-livereload');
// var config =        require('./config');
var controllers = {};
controllers.languages = require('./controllers/languages');
controllers.words = require('./controllers/words');
var db = require('./db');

db.models.Word.findOne({name: "word"}, function(err, data) {
    console.log('data', data);
});


var rest = express();

rest.use(livereload());
rest.use(express.static('./public'));
rest.use(bodyParser.json());
rest.use(bodyParser.urlencoded({ extended: true }));

rest.post('/api/languages',controllers.languages.post);
rest.get('/api/languages',controllers.languages.get);
rest.get('/api/languages/:id',controllers.languages.getById);
rest.put('/api/languages/:id',controllers.languages.put);
rest.delete('/api/languages/:id',controllers.languages.delete);

rest.post('/api/words',controllers.words.post);
rest.get('/api/words',controllers.words.get);
rest.get('/api/words/:id',controllers.words.getById);
rest.put('/api/words/:id',controllers.words.put);
rest.delete('/api/words/:id',controllers.words.delete);



// for (var key in controllers) {
//     if (!controllers.hasOwnProperty(key)) continue;
//     if (controllers[key].post)      { rest.post(  '/api/' + key,          controllers[key].post); }
//     if (controllers[key].get)       { rest.get(   '/api/' + key,          controllers[key].get); }
//     if (controllers[key].getById)   { rest.get(   '/api/' + key + '/:id', controllers[key].getById); }
//     if (controllers[key].put)       { rest.put(   '/api/' + key + '/:id', controllers[key].put); }
//     if (controllers[key].delete)    { rest.delete('/api/' + key + '/:id', controllers[key].delete); }
// }




rest.listen(9000, function () {
    var host = this.address().address;
    var port = this.address().port;

    console.log('app listening at http://%s:%s', host, 9000);
});