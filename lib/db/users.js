var recordFile = './lib/db/data/users.json';

var getRecords = function(cb) {
    var jsonfile = require('jsonfile');
    var util = require('util');
    jsonfile.readFile(recordFile, cb);
};

var putRecords = function(records, cb) {
    var jsonfile = require('jsonfile');
    jsonfile.writeFile(recordFile, records, cb);
};

var getNextId = function(cb) {
    var _ = require('underscore');
    getRecords(function (err, records) {
        if (err) { cb(err); }
        var maxUser = _.max(records, function(record){ return record.id; });
        if (_.isEmpty(maxUser)) {
            cb(null, 1);
        } else {
            var maxID = maxUser.id;
            cb(null, maxID + 1);
        }
    });
};

var findById = function(id, cb) {
    process.nextTick(function() {
        getRecords(function (err, records) {
            if (err) { cb(err); }
            var _ = require('underscore');
            var record = _.findWhere(records, {id: id});
            if (record) {
                cb(null, record);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }
        });
    });
};

var findByUsername = function(username, cb) {
    getRecords(function(err, records) {
        if (err) {
            cb(err);
        }
        var _ = require('underscore');
        var record = _.findWhere(records, {username: username});
        if (record) {
            cb(null, record);
        } else {
            cb(new Error('User ' + username + ' does not exist'));
        }
    });
};

var validateUserRecord = function(record, cb) {
    var _ = require('underscore');
    if (!_.has(record, "username")) {
        cb(new Error('username is a required field'), record)
    }
    if (!_.has(record, "emails") && _.isArray(record.emails)) {
        cb(new Error('emails is a required field and must be an array'), record)
    }
    cb(null, record);
};

var addUser = function(username, password, emails, cb) {
    findByUsername(username, function (err, record) {
        if (record) {
            cb (new Error('User ' + username + ' already exists!'));
        } else {
            getRecords(function (err, records) {
                if (err) { console.error(err); cb(err); }
                var _ = require('underscore');
                if (!_.isArray(records)) {
                    cb(new Error('retrieved records object is not an array'));
                }
                getNextId(function(err, nextId) {
                    if (err) {cb(err); }
                    records.push({id:nextId, username: username, password: password, emails: emails});
                    putRecords(records, function (err) {
                        if (err) { cb(err) }
                        findByUsername(username, function(err, record) {
                            cb(err, record);
                        });
                    });
                });
            });
        }
    });
};

exports.findById = findById;
exports.findByUsername = findByUsername;
exports.validateUserRecord = validateUserRecord;
exports.addUser = addUser;