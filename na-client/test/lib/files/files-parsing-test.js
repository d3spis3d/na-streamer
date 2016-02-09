import path from 'path';

import {expect} from 'chai';

import extractTrack, {createTrackData} from '../../../js/lib/files/files-parsing';

describe('createTrackData', function() {
    it('should correctly split song string', function() {
        const input = '01-Song Title.mp3';

        const expectedNumber = '01';
        const expectedTitle = 'Song Title';

        const result = createTrackData(input);
        expect(result.number).to.equal(expectedNumber);
        expect(result.title).to.equal(expectedTitle);
    });
});

describe('extractTrack', function() {
    it('should return a function', function() {
        const input = '/home/test/music';
        const filesStore = {};

        const result = extractTrack(input, filesStore);
        expect(result).to.be.a('function');
    });

    it('should correctly extract track data from file path', function() {
        const musicDir = ['home', 'test', 'music'].join(path.sep);
        const input = ['home', 'test', 'music', 'Genre', 'Artist', 'Album', '01-Song Title.mp3'].join(path.sep);
        const filesStore = {};

        const expectedResult = {
            genre: 'Genre',
            artist: 'Artist',
            album: 'Album',
            file: input,
            number: '01',
            title: 'Song Title',
            id: /[0-9a-f]{56}/
        };

        const func = extractTrack(musicDir, filesStore);
        const result = func(input);

        expect(result.genre).to.equal(expectedResult.genre);
        expect(result.artist).to.equal(expectedResult.artist);
        expect(result.album).to.equal(expectedResult.album);
        expect(result.number).to.equal(expectedResult.number);
        expect(result.title).to.equal(expectedResult.title);
        expect(result.id).to.match(expectedResult.id);
        expect(Object.keys(filesStore).length).to.equal(1);
    });
});
