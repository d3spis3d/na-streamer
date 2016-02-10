import fs from 'fs';

import Rx from 'rx';

import extractTrack, {buildFileInfoForBackend} from './files-parsing';

const CLIENT_KEYFILE = '.clientkey';

export function setupFilePathProcessor(sendFileData, musicDir, key) {
    return function(err, files) {
        if (err) {
            console.log(err);
            return;
        }

        if (files) {
            const tracks = files.filter(file => file.indexOf(CLIENT_KEYFILE) === -1)
                                .map(extractTrack(musicDir));

            const songs = tracks.map(track => {
                return {
                    title: track.title,
                    number: track.number,
                    id: track.id,
                    album: track.album
                };
            });

            const albums = tracks.reduce((map, track) => {
                map[track.album] = map[track.album] || {
                    title: track.album,
                    artist: track.artist,
                };
                return map;
            }, {});

            const artists = tracks.reduce((map, track) => {
                map[track.artist] = map[track.artist] || {
                    name: track.artist,
                    genre: track.genre,
                };
                return map;
            }, {});

            const genres = tracks.reduce((map, track) => {
                map[track.genre] = map[track.genre] || {
                    name: track.genre,
                };
                return map;
            }, {});

            const hostedTracks = {
                genres: [],
                artists: [],
                albums: [],
                songs: songs
            };

            for (let albumName in albums) {
                const album = albums[albumName];
                hostedTracks.albums.push(album);
            }

            for (let artistName in artists) {
                const artist = artists[artistName];
                hostedTracks.artists.push(artist);
            }

            for (let genreName in genres) {
                const genre = genres[genreName];
                hostedTracks.genres.push(genre);
            }

            sendFileData({
                key: key,
                tracks: hostedTracks
            });
        }
    };
}

export function setupFileWatcher(sendFileData, musicDir, key) {
    return function(monitor) {
        Rx.Observable.fromEvent(monitor, 'created')
            .filter((file) => {
                return fs.lstatSync(file).isFile();
            })
            .bufferWithTime(10000)
            .map((files) => {
                const tracks = files.map(extractTrack(musicDir));
                const songs = tracks.map(track => {
                    return {
                        title: track.title,
                        number: track.number,
                        id: track.id,
                        album: track.album
                    };
                });

                const albums = tracks.reduce((map, track) => {
                    map[track.album] = map[track.album] || {
                        title: track.album,
                        artist: track.artist,
                    };
                    return map;
                }, {});

                const artists = tracks.reduce((map, track) => {
                    map[track.artist] = map[track.artist] || {
                        name: track.artist,
                        genre: track.genre,
                    };
                    return map;
                }, {});

                const genres = tracks.reduce((map, track) => {
                    map[track.genre] = map[track.genre] || {
                        name: track.genre,
                    };
                    return map;
                }, {});

                const hostedTracks = {
                    genres: [],
                    artists: [],
                    albums: [],
                    songs: songs
                };

                for (let albumName in albums) {
                    const album = albums[albumName];
                    hostedTracks.albums.push(album);
                }

                for (let artistName in artists) {
                    const artist = artists[artistName];
                    hostedTracks.artists.push(artist);
                }

                for (let genreName in genres) {
                    const genre = genres[genreName];
                    hostedTracks.genres.push(genre);
                }

                return hostedTracks;
            })
            .subscribe((tracks) => {
                if (tracks.songs.length > 0) {
                    sendFileData({
                        key: key,
                        tracks: tracks
                    });
                }
            });

        monitor.on('removed', (file) => {
            console.log('removing file:', file);
        });
    };
}
