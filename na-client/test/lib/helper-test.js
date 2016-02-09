import {expect} from 'chai';
import sinon from 'sinon';

import {createWriteStream} from '../../js/lib/helper';

describe('createWriteStream', function() {
    it('should return a function', function() {
        const input = {};

        const results = createWriteStream(input);

        expect(results).to.be.a('function');
    });

    it('should create a function that writes to stream', function() {
        const stream = {
            write: function() { }
        };
        const spy = sinon.spy(stream, 'write');
        const inputData = { key: 'value' };

        const func = createWriteStream(stream);
        func(inputData);

        expect(spy.calledWith(inputData)).to.be.true;
    });
});
