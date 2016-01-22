import {listArtists, listAlbums, listAlbumsByArtist} from '../queries/list-tracks';

export const getLibrary = {
    url: '/library',
    generateHandler: function(tracks) {
        return function(req, res) {
            res.send(JSON.stringify(tracks));
        };
    }
}

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
            let results;
            if (req.param.artist) {
                listAlbumsByArtist(db, req.param.artist).then(results => {
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
