import {listArtists, listAlbums, listAlbumsByArtist,
        listSongs, listSongsByAlbum, listSongsByArtist} from '../queries/list-tracks';

export const getArtists = {
    url: '/artists',
    generateHandler: function(db) {
        return function(req, res) {
            listArtists(db).then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const getAlbums = {
    url: '/albums',
    generateHandler: function(db) {
        return function(req, res) {
            if (req.query.artist) {
                listAlbumsByArtist(db, req.query.artist).then(results => {
                    res.send(JSON.stringify(results));
                });
            } else {
                listAlbums(db).then(results => {
                    res.send(JSON.stringify(results));
                });
            }
        };
    }
}

export const getSongs = {
    url: '/songs',
    generateHandler: function(db) {
        return function(req, res) {
            if (req.query.album) {
                listSongsByAlbum(db, req.query.album).then(results => {
                    res.send(JSON.stringify(results));
                });
            } else if (req.query.artist) {
                listSongsByArtist(db, req.query.artist).then(results => {
                    res.send(JSON.stringify(results));
                });
            } else {
                listSongs(db).then(results => {
                    res.send(JSON.stringify(results));
                });
            }
        }
    }
}
