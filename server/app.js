const express = require('express');
const bodyParser = require('body-parser');
const {routers} = require('./routers');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./client/build'));
app.use("/api", routers);

app.get('/generator', function (req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT, function () {
    console.log(`server listening on port ${process.env.PORT}`);
});
