var db = require('../lib/db');

exports.authenticate = function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
    });
};

exports.serializeUser = function(user, cb) {
    cb(null, user.id);
};

exports.deserializeUser = function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
};

exports.register = function(id, cb) {

};