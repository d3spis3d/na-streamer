import {createStreamToServer} from '../../js/lib/client';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Client functions', function() {
    describe('createStreamToServer', function() {
        it('should return a function', function() {
            const input = {};

            const results = createStreamToServer(input);

            expect(results).to.be.a('function');
        });

        it('should create a function that writes to stream', function() {
            const stream = {
                write: function() { }
            };
            const spy = sinon.spy(stream, 'write');
            const inputData = { key: 'value' };

            const func = createStreamToServer(stream);
            func(inputData);

            expect(spy.calledWith(inputData)).to.be.true;
        });
    });
});
