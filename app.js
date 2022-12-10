const venom = require('venom-bot');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); 
const { google } = require("googleapis");
const { datacatalog } = require('googleapis/build/src/apis/datacatalog');


venom
  .create({
    session: 'session-name', //name of session
    multidevice: true // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

  var dataPlayer = new Array();

  client.onMessage(async (message) => {

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
    // Create client instance for auth
    const gclient = await auth.getClient();
  
    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: gclient });
  
    const spreadsheetId = "1927xBquC0QfIBcOHXZ93LfXGbz1RRENP9e3nWXQP3n4";

    getPlayersFromExcel(auth, googleSheets, spreadsheetId).then(val => {

      if (val.length) {
        let player_ = findPlayer(val, message.from); 
              if(player_ !== null){
                    //Jugador registrado
                    client.sendText(message.from, 'Hola '+player_[1]+', bienvenido nuevamente 🤝');
              }else{
                  registrarJugador(client,message, dataPlayer, auth, googleSheets, spreadsheetId);
              }
        } else {
              registrarJugador(client,message, dataPlayer, auth, googleSheets, spreadsheetId);
        }
    });

 
  });
}

function registrarJugador(client, message, dataPlayer,auth, googleSheets, spreadsheetId){
  if (message.body === 'Hola' && message.isGroupMsg === false) {
    dataPlayer.push(message.from);
    client.sendText(message.from, 'Bienvenido al bot del Torneo. Voy a registrar tus datos')
   .then((result) => {
        client.sendText(message.from, '👉 *Citá este mensaje con tu nombre*')
        .then((result) => {
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
    }else{
      if(message.type === 'reply' && message.quotedMsg.body==='👉 *Citá este mensaje con tu nombre*'){
          client.sendText(message.from, 'Genial '+message.body+' ya registramos tu nombre').then((result) => {
              dataPlayer.push(message.body);
              client.sendText(message.from, '👉 *Ahora citá este mensaje con tu apellido*').
              then((result) =>{}).catch((error) => console.log(error))
          }).catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });

      }
      if(message.type === 'reply' && message.quotedMsg.body==='👉 *Ahora citá este mensaje con tu apellido*'){
        client.sendText(message.from, 'Ya registramos tus datos').then((result) => {
            dataPlayer.push(message.body);
            saveDataInExcel(auth, spreadsheetId, googleSheets, dataPlayer)
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });

    }  
    }
  }  
 
  function findPlayer(players, user){
    let player = null;
    if (players.length) {
            players.map((row) => {
              if(row[0] === user){
                player = row;
              }
            });
            return player;
    }
  }

  async function getPlayersFromExcel(auth, googleSheets,spreadsheetId){
    // Read rows from spreadsheet
    const res =await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "inscriptos!A:C",
    });
    return res.data.values;
  }

  async function saveDataInExcel(auth, spreadsheetId, googleSheets, dataPlayer){
    //Write row(s) to spreadsheet
   let res = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "inscriptos!A:C",
      valueInputOption:'RAW',
      valueInputOption: "USER_ENTERED",
      resource:{
        values:[dataPlayer]
      }
    });
    res
  }
