import {reduceAndMemoize, createWriteStream} from '../../js/lib/helper';
import {expect} from 'chai';
import sinon from 'sinon';

describe('Helper functions', function() {
    describe('reduceAndMemoize', function() {
        let memoizeObj;

        beforeEach(function() {
            memoizeObj = {};
        });

        it('should return function', function() {
            const result = reduceAndMemoize(memoizeObj, 'key', 'value');
            expect(result).to.be.a('function');
        });

        it('should correctly reduce and memoize', function() {
            const resultFunction = reduceAndMemoize(memoizeObj, 'key', 'value');
            function reduceFunc(previous, current) {
                previous.push(current.value);
                return previous;
            }

            const input = [
                {key: 1, value: 'hello'},
                {key: 2, value: 'world'}
            ];
            const expectedOutput = ['hello', 'world'];
            const expectedMemoizeObj = {
                1: 'hello',
                2: 'world'
            };

            const result = resultFunction(input, reduceFunc, []);
            expect(result).to.eql(expectedOutput);
            expect(memoizeObj).to.eql(expectedMemoizeObj);
        });
    });

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
});
