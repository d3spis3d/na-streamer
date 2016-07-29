import {listArtists, listAlbums, listAlbumsByArtist,
        listSongs, listSongsByAlbum, listSongsByArtist} from '../queries/list-tracks';

export const getArtists = {
    url: '/api/artists',
    generateHandler: function(db) {
        return function(req, res) {
            return listArtists(db).then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const getAlbums = {
    url: '/api/albums',
    generateHandler: function(db) {
        return function(req, res) {
            if (req.query.artist) {
                return listAlbumsByArtist(db, req.query.artist).then(results => {
                    res.send(JSON.stringify(results));
                });
            }
            return listAlbums(db).then(results => {
                res.send(JSON.stringify(results));
            });
        };
    }
}

export const getSongs = {
    url: '/api/songs',
    generateHandler: function(db) {
        return function(req, res) {
            if (req.query.album) {
                return listSongsByAlbum(db, req.query.album).then(results => {
                    res.send(JSON.stringify(results));
                });
            } else if (req.query.artist) {
                return listSongsByArtist(db, req.query.artist).then(results => {
                    res.send(JSON.stringify(results));
                });
            }
            return listSongs(db).then(results => {
                res.send(JSON.stringify(results));
            });
        }
    }
}
