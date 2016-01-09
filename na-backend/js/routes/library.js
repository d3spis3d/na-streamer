export const getLibrary = {
    url: '/library',
    generateHandler: function(tracks) {
        return function(req, res) {
            res.send(JSON.stringify(tracks));
        };
    }
}
