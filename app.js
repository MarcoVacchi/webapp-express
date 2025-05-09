const express = require('express');
const app = express();
const port = 3000;

const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleError');


app.get('/', (req, res) => {

    res.send('Benvenuto sulla mia app!');

});

//error 500;
app.use(handleError);

//error 404;
app.use(notFound);

app.listen(port, () => {

    console.log(`app listening at port ${port}`);

});