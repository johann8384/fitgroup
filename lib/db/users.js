var recordFile = './lib/db/data/users.json';
var getRecords = function() {
    var fs = require('fs');
    var file_content = fs.readFileSync(recordFile);
    return JSON.parse(file_content);
};

var putRecords = function(records) {
    fs.writeFileSync(recordFile, JSON.stringify(records));
};

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var records = getRecords();
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        var records = getRecords();
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

exports.addUser = function(username, password, emails, cb) {
    var records = getRecords();
    records.push({id:999, username: username, password: password, emails: emails});
    putRecords(records);
    return cb(null, true);
};