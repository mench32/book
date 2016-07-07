var db = require('../db');

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
    return db.models.Language.find(function (err, data) {
        if (!data) {
            res.statusCode = 404;
            return res.send({error: '1'});
        }
        if (!err) {
            return res.send(data);
        } else {
            res.statusCode = 500;
            console.error('GET ALL Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'GET ALLServer error'});
        }
    });
};

module.exports.getById = function(req, res) {
    return db.models.Language.findById(req.params.id, function (err, data) {
        if(!data) {
            res.statusCode = 404;
            return res.send({ error: 'GET Not found' });
        }
        if (!err) {
            return res.send(data);
        } else {
            res.statusCode = 500;
            return res.send({ error: 'GET Server error' });
        }
    });
};

module.exports.put = function (req, res) {
    console.log('body', req.body);
    return db.models.Language.findById(req.body._id, function (err, data) {
        if( !data ) {
            res.statusCode = 404;
            return res.send({ error: 'PUT Not found' });
        }

        for (var key in req.body) {
            data[key] = req.body[key];
        }

        return data.save(function (err) {
            if (!err) {
                return res.send(data);
            } else {
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'PUT Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'PUT  Server error' });
                }
            }
        });
    });
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