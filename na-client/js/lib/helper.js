export function reduceAndMemoize(memo, memoKey, memoValue) {
    return function(array, reduceFunction, initial) {
        return array.reduce(function(previous, current) {
            memo[current[memoKey]] = current[memoValue];
            return reduceFunction(previous, current);
        }, initial);
    };
}

export function createWriteStream(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}
