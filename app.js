const express = require('express');
const app = express();
const port = 3000;

const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleError');

//router;
const movieRouter = require('./router/movies');

app.use(express.static('public'));

app.use(express.json());

app.get('/', (req, res) => {

    res.send('Benvenuto sulla mia app!');

});

app.use('/movies', movieRouter);

//error 500;
app.use(handleError);

//error 404;
app.use(notFound);

app.listen(port, () => {

    console.log(`sono attivo sulla porta ${port}`);

});