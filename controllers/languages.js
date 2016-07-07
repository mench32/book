var db = require('../db');
var utils = require('../utils');

// params = {
//     skip: 0,
//     limit: 10,
//     sort: {date_added: -1} //Sort by Date Added DESC
// };
// fields = [];
//
// filter = {};

module.exports.post = function(req, res) {
    var obj = new db.models.Language(req.body);

    obj.save(function (error, data) {
        if (!error) {
            res.send(data);
        } else {
            if ( error.name == 'ValidationError' ) {
                res.statusCode = 400;
                res.send({ error: error.errors.title.message });
            } else {
                res.statusCode = 500;
                res.send({ error: 'POST Server error' });
            }
        }
    });
};

module.exports.get = function(req, res) {
    var params = {
        skip: parseInt(req.query.offset) || 0,
        limit: parseInt(req.query.limit) || 20,
        sort: {date_added: -1} //Sort by Date Added DESC //req.query.sort
    };
    var filter = utils.parseFilter(req.query.filter);

    db.controller.get(db.models.Language, params, filter)
        .then(
            function(data) {
                res.send({
                    offset: params.skip,
                    limit: params.limit,
                    total: data.total,
                    data: data.data
                });
            },
            function(data) {
                res.statusCode = data.statusCode;
                res.send({ error: data.error });
            }
        );
};

module.exports.getById = function(req, res) {
    db.controller.getById(db.models.Language, req.params.id)
        .then(
            function(data) {
                res.send(data);
            },
            function(data) {
                res.statusCode = data.statusCode;
                res.send({ error: data.error });
            }
        );
};

module.exports.put = function (req, res) {
    console.log('body', req.body);
    db.controller.update(db.models.Language, req.params.id, req.body)
        .then(
            function(data) {
                res.send(data);
            },
            function(data) {
                res.statusCode = data.statusCode;
                res.send({ error: data.error });
            }
        )

};

module.exports.delete = function (req, res) {

    return db.models.language.findById(req.params.id, function (err, data) {
        if ( !data ) {
            res.statusCode = 404;
            return res.send({ error: 'DELETE Not found' });
        }
        return data.remove(function (err) {
            if ( !err ) {
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                return res.send({ error: 'DELETE Server error' });
            }
        });
    });
};