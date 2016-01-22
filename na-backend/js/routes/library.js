import {listArtists} from '../queries/list-tracks';

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
            listArtists(db).then((results) => {
                res.send(JSON.stringify(results));
            });
        };
    }
}
