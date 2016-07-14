var db = require('../db');
var utils = require('../utils');

module.exports.post = function(req, res) {
    db.controller.post(db.models.Language, req.body)
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
    db.controller.delete(db.models.Language, req.params.id)
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