"use strict";
exports.name = "original setup";

exports.up = function (db) {
  db.class.create('Artist', 'V').then(Artist => {
      Artist.property.create({
          name: 'name',
          type: 'String'
      });
  });

  db.class.create('Album', 'V').then(Album => {
      Album.property.create({
          name: 'title',
          type: 'String'
      });
  });

  db.class.create('Song', 'V').then(Song => {
      Song.property.create([
          {
              name: 'title',
              type: 'String'
          },
          {
              name: 'number',
              type: 'String'
          },
          {
              name: 'id',
              type: 'String'
          }
      ]);
  });

  db.class.create('Streamer', 'V').then(Streamer => {
      Streamer.property.create({
          name: 'key',
          type: 'String'
      });
  });

  db.class.create('Queue', 'V').then(Queue => {
      Queue.property.create({
          name: 'id',
          type: 'String'
      });
  });

  db.class.create('Found_On', 'E');
  db.class.create('Recorded_By', 'E');
  db.class.create('Hosted_On', 'E');
};

exports.down = function (db) {
  db.query('drop class Artist');
  db.query('drop class Album');
  db.query('drop class Song');
  db.query('drop class Streamer');
  db.query('drop class Queue');

  db.query('drop class Found_On');
  db.query('drop class Recorded_By');
  db.query('drop class Hosted_On');
};
