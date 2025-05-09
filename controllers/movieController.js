function index(req, res) {

    res.send('Indice movie');

};

function show(req, res) {

    res.send('Show movie');

};

module.exports = { index, show };