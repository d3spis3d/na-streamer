export function createWriteStream(stream) {
    return function(hostedFileData) {
        stream.write(hostedFileData);
    };
}
