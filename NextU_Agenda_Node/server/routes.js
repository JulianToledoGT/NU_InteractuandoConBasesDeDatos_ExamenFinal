const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    user = require('./userModel.js'),
    userSchema = new Schema(user),
    userModel = mongoose.model("usuarios", userSchema);

mongoose.connect('mongodb://localhost:27017/agenda', { useNewUrlParser: true, useUnifiedTopology: true });

async function startDB() { //Crea un registro en la colección de usuarios, en caso que no exista y en el proceso crea la base de datos y/o la colección, si no existieran.
    createUser("juliantoledogt@hotmail.com", "1+2+3=6")
};

async function login(login) { //Verifica si hay un registro que coincida para el usuario y la contraseña recibida.
    let doc = await userModel.findOne({email: login.user, password: login.pass}).exec();
    if (doc != null){
        return "Validado"   //{tcMsg : "¡Bienvenido!"}
    }else{
        return "No validado"   //{tcMsg : "Credenciales inválidas. Verifique."}
    }
};

function createUser(user, pass) {
    userModel.findOne({ email: user }).exec(function (err, docs) {
        if (docs == null) {
            var usuario = new userModel({ email: user, password: pass });
            usuario.save();
        }
    });
};

module.exports = {
    startDB : startDB,
    login : login
};
