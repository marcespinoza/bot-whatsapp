const venom = require('venom-bot');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); 

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
  client.onMessage((message) => {
    if (message.body === 'Hola' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Genial, seleccioná que queres hacer')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }else{
        client
        .sendText(message.from, 'Hola, bienvenido al bot del Torneo, para comenzar enviá la palabra Hola')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });

  const headingColumnNames = [
    "Name",
    "Email",
    "Mobile",
]
const data = [
    {
      "name":"Shadab Shaikh",
      "email":"shadab@gmail.com",
      "mobile":"1234567890"
    }
  ]

let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});
let rowIndex = 2;
data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
});
wb.write('filename.xlsx');
}