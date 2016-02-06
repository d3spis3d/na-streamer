"use strict";
exports.name = "add genre";

exports.up = function (db) {
  db.class.create('Genre', 'V').then(Genre => {
      Genre.property.create({
          name: 'name',
          type: 'String'
      });
  });

  db.class.create('Classified_As', 'E');
};

exports.down = function (db) {
  db.query('drop class Genre');

  db.query('drop class Classified_As');
};
