



mongoose.connect(config.get('mongoose:uri'));

module.exports = class DataBase {
    constructor(model, url) {
        var config = Symbol();

        this[config] = require('./config');

        this.mongoose = require('mongoose');
        this.db = mongoose.connection;
        this.Schema = mongoose.Schema;

        this.db.on('error', console.error);

        validate = {
            title: function(value) {
            console.log('title', value);
            return typeof value === "string" && value.length > 2 && value.length < 255
        },
            refLanguage: function(value, callback) {
                base.Language.findById(value.id, function (error, data) {
                    callback(data !== null);
                });
            },
            refWord: function(value, callback) {
                base.Word.findById(value.id, function (error, data) {
                    callback(data !== null);
                });
            },
            login: function(value, callback) {
                var login = /^[a-zA-Z0-9]+$/;
                if ( typeof value === 'string' && value.length > 3 && value.length < 64 && login.test(value) ) {
                    base.User.findOne({ login: value }, function (error, data) {
                        callback(data == null);
                    });
                } else {
                    return false;
                }
            },
            email: function(value, callback) {
                var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if ( typeof value === 'string' && value.length > 4 && email.test(value) ) {
                    base.User.findOne({ email: value }, function (error, data) {
                        callback(data == null);
                    });
                } else {
                    return false;
                }
            },
            word: function() {
                var word = /^[a-zA-Zа-яА-Я]+$/;
                if ( typeof value === 'string' && value.length > 0 && value.length < 64 && word.test(value) ) {
                    base.User.findOne({ login: value }, function (error, data) {
                        callback(data == null);
                    });
                } else {
                    return false;
                }
            }

    }
    }
    
    static validate(name) {
        
    }
}









var base = {};

var validate = {};


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


function getList(model, offset, limit, sort, filter, fields) {
    return new Promise(function(resolve, reject) {
        db.models[model]
            .find(filter, { __v: false, _id: true, title: true }, function (err, data) {
                if (!data) {
                    reject({
                        statusCode: 404,
                        error: '1'
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
            })
            .skip(offset)
            .limit(limit)
            .sort([[sort, -1]]);
    })
}


module.exports.Schema = Schema;
module.exports.models = base;