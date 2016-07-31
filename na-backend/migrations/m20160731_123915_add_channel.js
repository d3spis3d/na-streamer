"use strict";
exports.name = "add channel";

exports.up = function (db) {
    db.class.create('Channel', 'V').then(Channel => {
        Channel.property.create({
            name: 'title',
            type: 'String'
        });
        Channel.property.create({
            name: 'key',
            type: 'String'
        });
    });
};

exports.down = function (db) {
    db.query('drop class Channel');
};
