const express = require('express');
const app = express();
const port = 3000;


app.get('/', (req, res) => {

    res.send('Benvenuto sulla mia app!');

});

app.listen(port, () => {

    console.log(`app listening at port ${port}`);

});