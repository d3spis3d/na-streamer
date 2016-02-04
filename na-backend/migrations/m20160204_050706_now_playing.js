"use strict";
exports.name = "now playing";

exports.up = function (db) {
  db.class.create('Now_Playing', 'V').then(NowPlaying => {
      NowPlaying.property.create([
          {
              name: 'title',
              type: 'String'
          },
          {
              name: 'album',
              type: 'String'
          },
          {
              name: 'artist',
              type: 'String'
          }
      ]);
  });
};

exports.down = function (db) {
  db.query('drop class Now_Playing');
};
