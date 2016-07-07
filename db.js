var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;
var config = require('./config');

mongoose.connect(config.get('mongoose:uri'));

db.on('error', console.error);

var base = {};

var validate = {};

var controller = {};

validate.title = function(value) {
    return typeof value === "string" && value.length > 2 && value.length < 255
};
validate.refLanguage = function(value, callback) {
    base.Language.findById(value.id, function (error, data) {
        callback(data !== null);
    });
};
validate.refWord = function(value, callback) {
    base.Word.findById(value.id, function (error, data) {
        callback(data !== null);
    });
};
validate.login = function(value, callback) {
    var login = /^[a-zA-Z0-9]+$/;
    if ( typeof value === 'string' && value.length > 3 && value.length < 64 && login.test(value) ) {
        base.User.findOne({ login: value }, function (error, data) {
            callback(data == null);
        });
    } else {
        return false;
    }
};
validate.email = function(value, callback) {
    var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( typeof value === 'string' && value.length > 4 && email.test(value) ) {
        base.User.findOne({ email: value }, function (error, data) {
            callback(data == null);
        });
    } else {
        return false;
    }
};
validate.word = function() {
    var word = /^[a-zA-Zа-яА-Я]+$/;
    if ( typeof value === 'string' && value.length > 0 && value.length < 64 && word.test(value) ) {
        base.User.findOne({ login: value }, function (error, data) {
            callback(data == null);
        });
    } else {
        return false;
    }
};

// Модель LANGUAGE
var Language = new Schema({
    title: {
        type: String,
        validate: {
            validator: validate.title,
            message: '{VALUE} is not a valid language name!'
        },
        required: [true, 'Language name required']
    }
});
// Модель WORD
var Word = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: validate.word,
            message: '{VALUE} is not a valid word!'
        }
    },
    language: {
        type: Schema.ObjectId,
        ref: 'Language',
        validate: {
            validator: validate.refLanguage,
            message: '{VALUE} this language does not exist!'
        },
        required: true
    },
    translate: [{
        name: {
            type: String,
            required: true
        },
        language: {
            type: Schema.ObjectId,
            ref: 'Language',
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    }]
});
// Модель GROUP
var Group = new Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: validate.title,
            message: '{VALUE} is not a valid group title!'
        }
    },
    words: [{
        count: {
            type: Number,
            required: true
        },
        word: {
            type: Schema.ObjectId,
            required: true
        },
        translate: {
            type: Number,
            required: false
        }
    }]
});
//Модель USER
var User = new Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: validate.title,
            message: '{VALUE} is not a valid user name!'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validate.email,
            message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    language: {
        type: Schema.ObjectId,
        ref: 'Language',
        validate: {
            validator: validate.refLanguage
        },
        message: '{VALUE} this language does not exist!'
    },
    words: [{
        type: Schema.ObjectId,
        ref: 'Word',
        required: true
    }],
    groups: [{
        type: Schema.ObjectId,
        ref: 'Group',
        required: true
    }]
});

base.Language = mongoose.model("Language", Language);
base.Word = mongoose.model("Word", Word);
base.Group = mongoose.model("Group", Group);
base.User = mongoose.model("User", User);

controller.get = function(model, params, filter, fields) {
    var result = {};
    return new Promise(function(resolve, reject) {
        model
            .find(
                filter,
                fields,
                params,
                function(err, data) {
                    if ( !data ) reject({
                        statusCode: 404,
                        error: 'GET ALL not found items'
                    });
                    if (!err) {
                        result.data = data;
                        model.count(filter, function(err, count) {
                            if (!err) {
                                result.total = data;
                                resolve(result)
                            } else {
                                reject({
                                    statusCode: 404,
                                    error: 'GET ALL not fount count'
                                })
                            }
                        })
                    }
                    else reject({
                        statusCode: 500,
                        error: 'GET ALL Server error'
                    });
                })
    });
};

controller.getById = function(model, id, fields) {
    return new Promise(function(resolve, reject) {
        model.findById(id, function (err, data) {
            if (!data) {
                reject({
                    statusCode: 404,
                    error: { error: 'GET Not found' }
                })
            }
            if (!err) {
                resolve(data);
            } else {
                reject({
                    statusCode: 500,
                    error: 'GET ALL Server error'
                });

            }
        });
    })
};

controller.update = function (model, id, body) {
    if ( !id ) {
        return { error: 'UPDATE id not fount'};
    }
    return new Promise(function(resolve, reject) {
        console.log('promise');
        model.findById(id, function (err, data) {
            console.log('find');
            if( !data ) {
                reject({
                    statusCode: 404,
                    error: 'PUT Not found'
                });
            }

            for (var key in body) {
                data[key] = body[key] || data[key];
            }

            return data.save(function (err) {
                console.log('save');
                if (!err) {
                    return resolve(data);
                } else {
                    if(err.name == 'ValidationError') {
                        console.log(err)
                        reject({
                            statusCode: 400,
                            error: err
                        });
                    } else {
                        reject({
                            statusCode: 500,
                            error: 'PUT  Server error'
                        })
                    }
                }
            });
        });
    });

};


module.exports.Schema = Schema;
module.exports.models = base;
module.exports.controller = controller;


