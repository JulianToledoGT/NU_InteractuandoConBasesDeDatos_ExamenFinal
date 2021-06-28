const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    user = require('./userModel.js'),
    event = require('./eventModel.js'),
    userSchema = new Schema(user),
    eventSchema = new Schema(event),
    userModel = mongoose.model("usuarios", userSchema),
    eventModel = mongoose.model("eventos", eventSchema);

mongoose.connect('mongodb://localhost:27017/agenda', { useNewUrlParser: true, useUnifiedTopology: true });

function createUser(user, pass) {
    userModel.findOne({ email: user }).exec(function (err, docs) {
        if (docs == null) {
            var usuario = new userModel({ email: user, password: pass });
            usuario.save();
        }
    });
};

async function startDB() { //Crea un registro en la colección de usuarios, en caso que no exista y en el proceso crea la base de datos y/o la colección, si no existieran.
    createUser("juliantoledogt@hotmail.com", "1+2+3=6")
};

async function login(login) { //Verifica si hay un registro que coincida para el usuario y la contraseña recibida.
    let data = await userModel.findOne({ email: login.user, password: login.pass }).exec();
    if (data != null) {
        return "Validado"   //{tcMsg : "¡Bienvenido!"}
    } else {
        return "No validado"   //{tcMsg : "Credenciales inválidas. Verifique."}
    }
};

async function getAllEvents() {
    var data = "";
    var records = await eventModel.find().exec();   //db.eventos.find({$and:[{"startDate": {$lte: endDate}},{"endDate": {$gte: startDate}}]})
    if (records == "") {
        var evento = new eventModel({
            eventId: "Hoy",
            title: "Iniciar mi agenda",
            startDate: startDate,
            startTime: "00:00",
            endDate: startDate,
            endTime: "00:00"
        });
        evento.save();
    } else {
        for (var record in records) {
            var eventId = "";
            var title = "";
            var startDT = "";
            var endDT = "";
            if (records[record].eventId !== undefined) {
                eventId = records[record].eventId;
            }
            if (records[record].title !== undefined) {
                title = records[record].title;
            }
            if (records[record].startDate !== undefined) {
                startDT = records[record].startDate;
            }
            if (records[record].startTime !== undefined && records[record].startTime !== undefined) {
                startDT += "T" + records[record].startTime;
            }
            if (records[record].endDate !== undefined) {
                endDT = records[record].endDate;
            }
            if (records[record].endTime !== undefined && records[record].endTime !== undefined) {
                endDT += "T" + records[record].endTime;
            }
            if (data == "") {
                data = '[{"eventId":"' + eventId + '","title":"' + title + '","startDT":"' + startDT + '","endDT":"' + endDT + '"}';
            } else {
                data += ',{"eventId":"' + eventId + '","title":"' + title + '","startDT":"' + startDT + '","endDT":"' + endDT + '"}';
            }
        }
        if (data != "") {
            data += "]";
        }
        return data
    }
}

async function addRecord(record) { //Verifica si hay un registro que coincida para el usuario y la contraseña recibida.
console.log('3.-routes')

    let title = record.title || '',
        startDT = (record.startDT).split("T") || '',
        endDT = (req.body.endDT).split("T") || '';

    let startDate = startDT[0],
        startTime = startDT[1],
        endDate = endDT[0],
        endTime = endDT[1];

    eventModel.findOne({ title: title, startDate: startDate, startTime: startTime }).exec(function (err, docs) {
        if (docs == null) {
            var evento = new eventModel({
                eventId: "Hoy",
                title: title,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime
            });
            evento.save();
            //return evento;
        }
    });
};

module.exports = {
    login: login,
    startDB: startDB,
    getAllEvents: getAllEvents,
    addRecord: addRecord
};
