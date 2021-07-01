const express = require('express'),
    body_parser = require('body-parser'),
    cors = require('cors'),
    http = require('http'),
    routes = require('./routes'),
    app = express(),
    router = express.Router(),
    Server = http.createServer(app),
    PORT = 8082;

app.use(express.static("client"));

app.use(body_parser.json());

app.use(body_parser.urlencoded({ extended: false }));

app.use(cors());

app.use('/', router);

Server.listen(PORT, function () {
    console.log('Escuchando por el puerto ' + PORT);
    routes.startDB();
});

router.route('/login').post((req, res) => {
    let login = { ...req.body };
    routes.login(login).then(result => {
        res.status(201).json(result);
    })
});

router.route('/events/all').post((req, res) => {
    let user = { ...req.body };
    routes.getAllEvents(user).then(result => {
        res.status(201).json(result);
    })
});

router.route('/events/new').post((req, res) => {
    let record = { ...req.body }
    routes.addRecord(record).then(result => {
        res.status(201).json(result);
    })
});

// app.get("/events/all", function (req, res) {
// console.log(record);

//     routes.getAllEvents().then(result => {
//         res.status(201).json(result);
//     })
// });
