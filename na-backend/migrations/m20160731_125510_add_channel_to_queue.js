"use strict";
exports.name = "add channel";

exports.up = function (db) {
  db.class.get('Queue').then(Queue => {
     Queue.property.create({
         name: 'channel',
         type: 'String'
     });
  });
};

exports.down = function (db) {
    db.class.get('Queue').then(Queue => {
       Queue.property.drop('channel');
    });
};
