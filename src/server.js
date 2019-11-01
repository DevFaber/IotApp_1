import express from 'express';
import mongoose from 'mongoose';
import { Board, Led } from 'johnny-five';

import routes from './routes';
import firebase from 'firebase';

const app = express();

const admin = require('firebase-admin');
const serviceAccount = require('../fabertech-iot-firebase-adminsdk-ems62-61de4fb3f2');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fabertech-iot.firebaseio.com',
});

const db = admin.database();

/* //Conexão com MongoDB
mongoose.connect(
  'mongodb+srv://faberhome:faberhome@faberhome-1ctdj.mongodb.net/mongodbio?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
*/
// Função Arduino by Johnny-Five lib
const board = new Board();

board.on('ready', () => {
  const led = new Led(13);

  board.repl.inject({
    led,
  });

  // Finalizado UserCreate no Firebase
  app.post('/users', function(req, res) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    db.ref('usuarios').push(newUser);

    return res.json(newUser);
  });

  //Finalizado UserList no Firebase
  app.get('/list', function(req, res) {
    const list = db.ref('usuarios');

    list.on('value', function(snapshot) {
      return res.json(snapshot.val());
    });
  });

  // Finalizado novo metodo de Criar Dispositivos
  app.post('/devices', function(req, res) {
    const newDispo = {
      dispo: req.body.dispo,
      state: req.body.state,
    };

    const device = db.ref('dispositivos').push(newDispo);

    return res.json(device.key);
  });

  // Finalizado SetStateDispo Arduíno e Firebase
  const checkDispo = db.ref('dispositivos');
  checkDispo.on('child_changed', function(snapshot) {
    const stateCheck = snapshot.val();

    if (stateCheck.state == true) {
      led.on();
    }
    if (stateCheck.state == false) {
      led.off();
    }
  });

  //Metodo de Set Dispo

  app.put('/devices', function(req, res) {
    const dispo = req.body;

    if (dispo.state == true) {
      db.ref('dispositivos')
        .child('-LsZhQiNd_Gt6DgN91OI')
        .update({ state: true });
    } else {
      db.ref('dispositivos')
        .child('-LsZhQiNd_Gt6DgN91OI')
        .update({ state: false });
    }
    return res.json(dispo);
  });
  // Consulta do estado dos Dispositivos
  app.get('/devices', function(req, res) {
    const checkDispo = db.ref('dispositivos');
    checkDispo.on('value', function(snapshot) {
      const stateDispo = snapshot.child('-LsZhQiNd_Gt6DgN91OI').val();

      return res.json(stateDispo);
    });
  });
});

app.use(express.json());
app.use(routes);

app.listen(3333);
