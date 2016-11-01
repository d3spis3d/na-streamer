import path from 'path';

import { expect } from 'chai';

import extractTrack from '../../js/files/extract-track';

describe('extractTrack', function() {
    it('should return a function', function() {
        const input = '/home/test/music';

        const result = extractTrack(input);
        expect(result).to.be.a('function');
    });

    it('should correctly extract track data from file path', function() {
        const musicDir = ['home', 'test', 'music'].join(path.sep);
        const input = ['home', 'test', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep);

        const expectedResult = {
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            file: input,
            number: '01',
            title: 'Song Title',
            id: /[0-9a-f]{56}/
        };

        const func = extractTrack(musicDir);
        const result = func(input);

        expect(result.genre).to.equal(expectedResult.genre);
        expect(result.artist).to.equal(expectedResult.artist);
        expect(result.album).to.equal(expectedResult.album);
        expect(result.file).to.equal(expectedResult.file);
        expect(result.number).to.equal(expectedResult.number);
        expect(result.title).to.equal(expectedResult.title);
        expect(result.id).to.match(expectedResult.id);
    });
});
