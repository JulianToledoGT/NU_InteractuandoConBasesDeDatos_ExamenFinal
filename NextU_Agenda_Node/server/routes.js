const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    user = require('./userModel.js'),
    userSchema = new Schema(user),
    userModel = mongoose.model("usuarios", userSchema),

    event = require('./eventModel.js'),
    eventSchema = new Schema(event),
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

async function getAllEvents(user) {
    let data = "[";
    let records = await eventModel.find({ "user": user.user }).exec();
    //let records = await eventModel.find({ "user" : "juliantoledogt@hotmail.com" }).exec();
    if (records == null) {
        var evento = new eventModel({
            user: user.user,
            title: "Iniciar mi agenda",
            startDate: "2021-06-30",
            startTime: "00:00",
            endDate: "2021-06-30",
            endTime: "23:59"
        });
        evento.save();
    } else {
        for (var record in records) {
            var Id = records[record]._id;
            var title = "";
            var startDT = "";
            var endDT = "";

            if (records[record].title !== undefined) {
                title = records[record].title;
            }
            if (records[record].startDate !== undefined) {
                startDT = records[record].startDate;
            }
            if (records[record].startTime !== undefined && records[record].startTime !== undefined) {
                startDT += " " + records[record].startTime;
            }
            if (records[record].endDate !== undefined) {
                endDT = records[record].endDate;
            }
            if (records[record].endTime !== undefined && records[record].endTime !== undefined) {
                endDT += " " + records[record].endTime;
            }
            if (data !== "[") {data += ","};
            data += '{"Id":"' + Id + '","title":"' + title  + '","start":"' + startDT + '","end":"' + endDT + '"}';
        }
        if (data !==  "") {data += "]"};;
        return JSON.parse(data);
    }
}

async function addRecord(record) { //Verifica si hay un registro que coincida para el usuario y la contraseña recibida.
    let user = record.user,
        title = record.title,
        startDT = (record.start).split(" "),
        endDT = (record.end).split(" ");

    let startDate = startDT[0],
        startTime = startDT[1],
        endDate = endDT[0],
        endTime = endDT[1];

    eventModel.findOne({ title: title, startDate: startDate, startTime: startTime }).exec(function (err, docs) {
        if (docs == null) {
            var evento = new eventModel({
                user : user,
                title: title,
                startDate: startDate,
                startTime: startTime,
                endDate: endDate,
                endTime: endTime
            });
            evento.save();
            return evento;
        }
    });
};

async function delRecord(record) { //Verifica si hay un registro que coincida para el usuario y la contraseña recibida.
    eventModel.deleteOne({ _id : record.id }).exec(function (err, docs) {
        return "Se ha eliminado el registro."
    });
};

module.exports = {
    login: login,
    startDB: startDB,
    getAllEvents: getAllEvents,
    addRecord: addRecord,
    delRecord: delRecord
};
